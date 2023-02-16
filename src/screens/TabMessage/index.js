import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, TouchableHighlight, View, } from 'react-native';
import { NavBarShadow } from '../../components/NavBarShadow';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../../helpers/fonts';
import { empty, icon, placeholderImages } from '../../helpers/assets';
import ScreenHeader from '../../components/ScreenHeader';
import { NavigationHeaderText } from '../../components/NavigationHeaderText';
import SafeAreaView from 'react-native-safe-area-view';
import { windowHeight } from '../../helpers/dimensions';
import { useDispatch, useSelector } from 'react-redux';
import { selectChatRooms, setChatrooms } from '../../slices/myChatRoomSlice';
import { fnGetChatRooms, fnGetImageURL } from '../../helpers/api';
import { errorAlert } from '../../helpers/alerts';
import { selectProfile } from '../../slices/profileSlice';
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS } from '../../helpers/colors';
import NavigationBarButton from '../../components/NavigationBarButton';
const TabMessage = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const chatroomsStore = useSelector(selectChatRooms);
  const [chatRooms, setChatRooms] = useState([]);
  const [isRefresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setChatRooms(chatroomsStore);
    // fetchFeedData()
  }, [chatroomsStore]);

  const fetchFeedData = () => {
    console.log(profile.id)
    fnGetChatRooms(profile.id)
      .then(async response => {
        // alert(JSON.stringify(response.data.data))
        let dat = await response.json()
        let data = dat.data || [];
        console.log(JSON.stringify("chat=====>", data))
        dispatch(setChatrooms(data));
      })
      .catch(error => {
        errorAlert('Error', "We’ve encountered a problem, try again later");
      })
      .finally(() => {
        setRefresh(false);
      });
  };

  const goToChatroom = (id, societyName, item) => {
    navigation.navigate('ChatMessaging', { chatId: id, societyName, item });
  };

  /**
   * Create ChatRoom component feed item
   */
  const renderChatRoomItem = ({ item, index }) => {
    if(item.society_name){
    return (
      <TouchableHighlight
        onPress={() => {
          goToChatroom(item.id, item.society_name, item);
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0.3)',
            paddingHorizontal: 15,
            height: 110,
            alignItems: 'center',
            marginBottom: 3,
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              resizeMode: 'cover',
              borderRadius: 40,
              overflow: 'hidden',
              backgroundColor: COLORS.purple,
              justifyContent:"center",
              alignItems:"center"
            }}
          >
            <Text
            style={{ color: '#cfd0d0', fontFamily: FONTS.bwBold, fontSize: 30 }}
            >{item.society_name && item.society_name.substring(0, 1).toUpperCase()}</Text>
          </View>
          {/* <Image
            style={{
              width: 80,
              height: 80,
              resizeMode: 'cover',
              borderRadius: 40,
              overflow: 'hidden',
              backgroundColor: '#1a3130',
            }}
            source={
              item?.user_avatar_url
                ? { uri: fnGetImageURL(item?.user_avatar_url) }
                : placeholderImages.profile_pic_placeholder
            }
          /> */}
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text
              style={{ color: '#cfd0d0', fontFamily: FONTS.bwBold, fontSize: 15 }}
              numberOfLines={1}>
              {item.society_name}
            </Text>
            <Text
              style={{
                marginTop: 3,
                color: '#cfd0d0',
                fontFamily: item.last_message
                  ? FONTS.bwMedium
                  : FONTS.bwMediumItalic,
                fontSize: 11,
                lineHeight: 14,
                height: 30,
              }}
              numberOfLines={2}>
              {item.last_message || '*No New Messages* '}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
            }else{
              return null
            }
  };

  const returnEmptyState = () => {
    return (
      <View
        style={{
          position: 'absolute',
          height: windowHeight,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={empty.chat} />
          <Text
            style={{
              color: '#cfd0d0',
              fontFamily: FONTS.bwBold,
              fontSize: 16,
              textAlign: 'center',
            }}>
            Your messages with societies and
          </Text>
          <Text
            style={{
              color: '#cfd0d0',
              fontFamily: FONTS.bwBold,
              fontSize: 16,
              textAlign: 'center',
            }}>
            groups will be here. Go start a conversation!
          </Text>
        </View>
      </View>
    );
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);
    fetchFeedData();
  }, []);
  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} locations={[0, 0.8, 1]} style={{ flex: 1, width: '100%', height: '100%' }}>
      {chatRooms.length <= 0 ? returnEmptyState() : null}
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <ScreenHeader
          showDivider={false}
          style={{ borderColor: 'rgba(255,255,255, 0.1)' }}
          centerView={<NavigationHeaderText text="Messages" />}
          leftButton={(
            <NavigationBarButton
              icon={icon.back_block}
              onPress={() => {
                navigation.goBack();
              }}
            />
          )}
        />
        <ScrollView
          style={styles.list}
        >
          <FlatList
            refreshControl={
              <RefreshControl
                enabled={true}
                color={'#ffffff'}
                tintColor={'#ffffff'}
                refreshing={isRefresh}
                onRefresh={onRefresh}
              />
            }
            style={styles.list}
            data={chatRooms}
            renderItem={renderChatRoomItem}
            keyExtractor={item => item?.id?.toString()}
          />
        </ScrollView>
      </SafeAreaView>
      {/* <NavBarShadow /> */}
    </LinearGradient>
  );
};
export default TabMessage;
const styles = StyleSheet.create({
  debugBox: {
    borderWidth: 1,
    borderColor: 'red',
  },
  list: {
    flex: 1,
    marginBottom: 40
  }
});
