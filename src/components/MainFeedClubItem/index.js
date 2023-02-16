import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FONTS } from '../../helpers/fonts';
import { COLORS } from '../../helpers/colors';
import React from 'react';
import { placeholderImages } from '../../helpers/assets';
import { fnGetImageURL } from '../../helpers/api';
import Hyperlink from 'react-native-hyperlink'
const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth * 0.85;
/**
 *
 * card component used in feed to display society details
 *
 * @param index
 * @param background
 * @param title
 * @param description
 * @param members
 * @param memberCount
 * @param onItemPress
 */

const MainFeedClubItem = ({
  index,
  background,
  title,
  description,
  members,
  memberCount,
  onItemPress,
}) => {
  /** Create member component with societies member's profile picture
   *  Adjustable based on number of members in society
   *  when <3 members display only profile picture
   *  when >3 show an additional +X member circle
   */
  const memberView = () => {
    let viewMargin = 17;
    return (
      <View>
        {memberCount > 0 ? (
          <View
            style={{
              ...styles.itemUsers,
              backgroundColor: '#1e1e20',
              left: (Math.min(4, members.length) + 1) * viewMargin,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                marginLeft: 6,
                fontFamily: FONTS.bwBlack,
                fontSize: 7,
                color: COLORS.white,
              }}>
              {'+' + memberCount}
            </Text>
          </View>
        ) : null}
        {members?.map((data, index) => {
          return (
            <Image
              key={index}
              style={{
                ...styles.itemUsers,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: data === null ? COLORS.appYellow : 'transparent',
                left:
                  -viewMargin * index +
                  Math.min(4, members.length) * viewMargin,
              }}
              source={
                data === null
                  ? placeholderImages.profile_pic_placeholder
                  : { uri: fnGetImageURL(data) }
              }
            />
          );
        })}
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={() => onItemPress()}>
      <View style={styles.item}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            resizeMode: 'cover',
          }}
          source={background}
        />
        <View
          style={{
            width: '75%',
            height: '100%',
            position: 'absolute',
            right: 0,
            backgroundColor: 'rgba(01,08,08,0.8)',
            flex: 1,
          }}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {title}
          </Text>
          <Hyperlink linkDefault={true} linkStyle={ { color: '#2980b9'} }>
            <Text style={styles.itemDescription} numberOfLines={3}>
              {description} 
            </Text>
          </Hyperlink>
          <View style={{ position: 'absolute', bottom: 0 }}>
            <View style={{ height: 26 }}>{memberView()}</View>
            <View style={styles.itemButton}>
              <Text
                style={{
                  color: COLORS.appYellow,
                  fontFamily: FONTS.bwBlack,
                  fontSize: 13,
                }}>
                LEARN MORE
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#1a3130',
    height: 150,
    width: cardWidth,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 23,
    marginLeft: 5,
    marginRight: 5,
    overflow: 'hidden',
  },
  itemTitle: {
    color: '#cfd0d0',
    fontFamily: FONTS.bwBold,
    fontSize: 13,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  itemDescription: {
    color: '#cfd0d0',
    fontFamily: FONTS.bwMedium,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 4,
    marginLeft: 15,
    marginRight: 15,
  },
  itemUsers: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: 'absolute',
  },
  itemButton: {
    width: 130,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainFeedClubItem;
