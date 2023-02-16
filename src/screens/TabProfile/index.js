import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../helpers/colors";
import { NavBarShadow } from "../../components/NavBarShadow";
import LinearGradient from "react-native-linear-gradient";
import { FONTS } from "../../helpers/fonts";
import { empty, icon, placeholderImages } from "../../helpers/assets";
import SafeAreaView from "react-native-safe-area-view";
import TicketFeedItem from "../../components/TicketFeedItem";
import NavigationBarButton from "../../components/NavigationBarButton";
import ScreenHeader from "../../components/ScreenHeader";
import {
  contentWidth,
  windowHeight,
  windowWidth,
} from "../../helpers/dimensions";
import { useSelector } from "react-redux";
import { selectProfile } from "../../slices/profileSlice";
import { fnGetImageURL, fnGetUserEvents, fnGetUserPastEvents } from "../../helpers/api";
import { errorAlert } from "../../helpers/alerts";
import moment from "moment";

const TabMyLife = ({ navigation }) => {
  const PHOTOS_HEADER = "Scrapbook";
  const PAST_EVENT_HEADER = "Previous events";
  const ADD_PHOTO_STRING = "ADD PHOTO";
  const displayPhotoRowLimit = 2;
  const profile = useSelector(selectProfile);
  // const [profilePhotos, updateProfilePhotos] = useState([]);
  const [threeColumnPhotos, setThreeColumnPhotos] = useState([]);
  const [displayPhotos, setDisplayPhotos] = useState([]);
  const [showMoreUpdateButton, setShowMoreUpdateButton] = useState(false);
  const [pastEvents, updatePastEvents] = useState([]);
  const [data, updateData] = useState([]);

  const [isRefresh, setRefresh] = useState(true);

  useEffect(() => {
    if (isRefresh) {
      fetchFeedData();
    }
  }, [isRefresh]);

  const fetchFeedData = () => {
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 100);
    // Get data from that last 100 years to today get past event
    fnGetUserPastEvents(profile.id, 100, 0, startDate, new Date())
      .then(async (response) => {
        let dat = await response.json()
        let data = dat.data || [];
        updatePastEvents(data);
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again later");
      })
      .finally(() => {
        setRefresh(false);
      });

    // let photoData = [ADD_PHOTO_STRING, ...tempProfileImage()]
    let photoData = profile?.photos?.length > 0 ? [...profile.photos] : [];
    console.log("--------", photoData.length)
    let threeColumnPhotoData = createThreeColumnPhotos(photoData);
    setThreeColumnPhotos(threeColumnPhotoData);
    if (threeColumnPhotoData.length > 2) {
      let slice = threeColumnPhotoData.slice(0, displayPhotoRowLimit);
      setDisplayPhotos(slice);
    } else {
      setDisplayPhotos(threeColumnPhotoData);
    }
  };

  /**
   * Splice the data into sets of 3
   * @param data
   */
  const createThreeColumnPhotos = (data) => {
    let photoData = data;
    let arrays = [],
      size = 3;
    while (photoData.length > 0) {
      arrays.push(photoData.splice(0, size));
    }
    return arrays;
  };

  /**
   * Update Data to be fed into SectionList
   */
  useEffect(() => {
    updateData([
      {
        title: PHOTOS_HEADER,
        // data: [profilePhotos],
        data: displayPhotos.length === 0 ? [PHOTOS_HEADER] : displayPhotos, //When length is 0 create an array of a single item to represent Empty state
      },
      {
        title: PAST_EVENT_HEADER,
        data: pastEvents.length === 0 ? [PAST_EVENT_HEADER] : pastEvents, //When length is 0 create an array of a single item to represent Empty state
      },
    ]);
  }, [displayPhotos, pastEvents]);

  useEffect(() => {
    if (
      threeColumnPhotos.length > displayPhotoRowLimit &&
      displayPhotos.length === displayPhotoRowLimit
    ) {
      setShowMoreUpdateButton(true);
    } else {
      setShowMoreUpdateButton(false);
    }
  }, [displayPhotos]);

  /**
   * Render item depending on section
   */
  const renderItem = ({ item, index, section }) => {
    return section.title === PHOTOS_HEADER
      ? renderProfilePhotos(item)
      : renderPastEvents(item, index);
  };

  /**
   *  Create profile View
   */  

  const renderProfileView = (item, index) => {    
    return (
      <View style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
        {/* <ImageBackground
          style={{
            width: "100%",
            height: 260,
            borderBottomLeftRadius: 23,
            borderBottomRightRadius: 23,
            overflow: "hidden",
            resizeMode: "cover",
            backgroundColor: "#1a3130",
          }}
          source={
            profile.avatar_url
              ? { uri: tempLocal }
              : placeholderImages.profile_banner_placeholder
          }
        >
          <LinearGradient
            style={{
              width: "100%",
              height: "50%",
              position: "absolute",
              bottom: 0,
            }}
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
          >
            <Text
              style={{
                color: COLORS.white,
                position: "absolute",
                left: 33,
                bottom: 5,
                textTransform: "uppercase",
                fontFamily: FONTS.bwBlack,
                fontSize: 21,
              }}
            >{`${profile.first_name} ${profile.last_name}`}</Text>
          </LinearGradient>
        </ImageBackground> */}
        <View style={{
          width: "100%",   
          paddingTop: 0,
          paddingLeft: 10,    
        }}>
          <Image style={{height: 100, width: 100, borderRadius: 100, marginBottom: 20}} source={
            profile.avatar_url
              && { uri: profile.avatar_url }
              /* : placeholderImages.profile_banner_placeholder */
          } />
          <Text
            style={{
              color: COLORS.white,              
              textTransform: "uppercase",
              fontFamily: FONTS.bwBlack,
              fontSize: 21,
            }}
          >{`${profile.first_name} ${profile.last_name}`}</Text>
        </View>
        <View
          style={{
            width: "100%",
            height: 80,
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                color: "#cfd0d0",
                fontFamily: FONTS.bwBold,
                fontSize: 13,
                textTransform: "capitalize",
              }}
            >
              College
            </Text>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.bwMedium,
                fontSize: 13,
              }}
            >
              {profile.jcr !== null && profile.jcr.length >= 1 ? profile.jcr : 'No college'}
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: "#cfd0d0",
                fontFamily: FONTS.bwBold,
                fontSize: 13,
                textTransform: "capitalize",
              }}
            >
              Event Count
            </Text>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.bwMedium,
                fontSize: 13,
              }}
            >
              {pastEvents.length}
            </Text>
          </View>
        </View>
        <ScreenHeader
          style={{ position: "absolute", marginTop: Platform.OS === 'ios' ? 60 : 30, right: -20 }}
          useMessages={() => {
            navigation.navigate('TabMessage')
          }}
          rightButton={
            <NavigationBarButton
              large
              icon={icon.setting}
              onPress={() => {
                navigation.navigate("ProfileSettings");
              }}
            />
          }
          showDivider={false}
        />
      </View>
    );
  };

  const renderProfilePhotos = (item) => {
    return item === PHOTOS_HEADER ? emptyPhotoState() : renderPhotoStack(item);
  };

  const emptyPhotoState = () => {
    return (
      <View
        style={{
          width: "100%",
          height: 250,
          paddingHorizontal: 12,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1D1E29",
        }}
      >
        <Image source={icon.photo_camera} style={{height: 75, width: 75, marginBottom: 20}} />
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.bwBold,
            fontSize: 13,
            lineHeight: 20,
          }}
        >
          Add photos to your Scrapbook!{" "}
        </Text>
        <Text
          style={{
            color: "#cfd0d0",
            fontFamily: FONTS.bwRegular,
            fontSize: 13,
            lineHeight: 20,
            textAlign: "center",
          }}
        >
          {
            "Add photos Societies post to your profile and build up your memories"
          }{" "}
        </Text>
        {/* <TouchableOpacity style={{ padding: 20 }}>
          <Text
            style={{
              color: COLORS.purple,
              fontFamily: FONTS.bwBold,
              fontSize: 15,
              textAlign: 'center',
            }}>
            Share your first photo
          </Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  /**
   * Render Photo item Component
   * @param item
   * @param style
   */

  const renderPhotoItem = (item, style = {}) => {
    let height = (windowWidth - 2) * 0.33;
    let width = (windowWidth - 4) * 0.33;
    if (item === ADD_PHOTO_STRING) {
      return (
        <TouchableHighlight
          style={{
            width: width,
            height: height,

            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => { }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 14,
              borderColor: COLORS.appYellow,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <Image source={icon.add_photo} />
              <Text
                style={{
                  position: "absolute",
                  top: -15,
                  right: -12,
                  fontFamily: FONTS.bwBlack,
                  color: COLORS.appYellow,
                  fontSize: 19,
                }}
              >
                +
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <Image
          source={{ uri: item }}
          style={{
            width: width,
            height: height,
            // backgroundColor: item.image,
            ...style,
          }}
        />
      );
    }
  };

  /**
   * Creates photo row of 3 photo Item components
   * @param item
   */
  const renderPhotoStack = (item) => {
    return (
      <View
        style={{
          width: "100%",
          marginBottom: 2,
          flex: 1,
          flexDirection: "row",
        }}
      >
        {renderPhotoItem(item[0])}
        {item.length > 1
          ? renderPhotoItem(item[1], { marginHorizontal: 2 })
          : null}
        {item.length > 2 ? renderPhotoItem(item[2]) : null}
      </View>
    );
  };

  const renderPastEvents = (item, index) => {
    return item === PAST_EVENT_HEADER
      ? renderEmptyPastEvent()
      : renderPastEventItem(item, index);
  };

  const renderEmptyPastEvent = () => {
    let height = windowHeight - 625;
    
    return (
      <View
        style={{
          width: "100%",
          height: 250,
          paddingHorizontal: 12,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1D1E29",
        }}
      >
        <Image source={icon.disco_ball} style={{height: 75, width: 75, marginBottom: 20}} />
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.bwBold,
            fontSize: 13,
            lineHeight: 20,
          }}
        >
          No previous events yet
        </Text>
        <Text
          style={{
            color: "#cfd0d0",
            fontFamily: FONTS.bwRegular,
            fontSize: 13,
            lineHeight: 20,
            textAlign: "center",
          }}
        >
          Once you go to your first event, it will appear here! Keep track of your time at Youni
        </Text>
      </View>
    );

    /* return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          width: "100%",
          padding: 60,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Image
          style={{ width: "100%", height: height, resizeMode: "contain" }}
          source={empty.past_events}
        />
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.bwBold,
            fontSize: 18,
          }}
        >
          No Past Events
        </Text>
      </View>
    ); */
  };

  const renderPastEventItem = (item, index) => {    
    return (
      <TouchableHighlight style={{backgroundColor: '#1D1E29', padding: 5, borderRadius: 10, marginBottom: 10}}>
        <View style={{ display: 'flex', flexDirection: 'row', height: 125 }}>
          <View style={{ flex: 2, justifyContent: 'space-between', padding: 10 }}>
            <Text numberOfLines={4} style={styles.previousEventTitle}>{item.title}</Text>
            <Text numberOfLines={4} style={styles.previousEventDate}>{moment(item.eventDate).format("dddd, MMM D, yyyy h:mm a")}</Text>
          </View>
          <Image source={{ uri: item.image_url}} style={{ flex: 1, resizeMode: "cover", borderRadius: 10, backgroundColor: 'red' }} />
        </View>
      </TouchableHighlight>
    )
    /* return (
      <TicketFeedItem
        title={item.title}
        titcketClass={null}
        eventDate={item.start_at}
        numTickets={item?.tickets === null ? 0 : item?.tickets?.length}
        eventImageID={item.image_url}
        index={index}
        showArrow={false}
        ticket_type_id={null}
        onPress={() => {
          console.log(item)
        }}
      />
    ); */
  };

  const renderSectionHeader = ({ item, section }) => {
    return section.title === PAST_EVENT_HEADER || section.title ===  PHOTOS_HEADER ? (
      <SafeAreaView
        style={{
          ...styles.feedSectionHeader,          
          borderColor: "rgba(255, 255, 255, .1)",
        }}
      >
        <Text style={styles.feedSectionTitle}>{section.title}</Text>
      </SafeAreaView>
    ) : null;
  };

  const renderSectionFooter = ({ item, section }) => {
    if (section.title === PHOTOS_HEADER && section.data[0] !== PHOTOS_HEADER) {
      if (showMoreUpdateButton) {
        return (
          <TouchableHighlight
            style={{
              ...styles.feedSectionHeader,
            }}
            onPress={() => {
              setDisplayPhotos(threeColumnPhotos);
            }}
          >
            <Text
              style={{
                color: "#d9bf71",
                fontFamily: FONTS.bwExtraBold,
                fontSize: 13,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              {"VIEW MORE"}
            </Text>
          </TouchableHighlight>
        );
      }
    } else {
      return null;
    }
  };

  /**
   * Pull to Refresh callback
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onRefresh = useCallback(() => {
    setRefresh(true);
    fetchFeedData();
  });

  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} locations={[0, 0.8, 1]} style={{ width: '100%', height: '100%' }}>
      <View style={{ flex: 1 }}>
        {renderProfileView()}
        <SectionList
          refreshControl={
            <RefreshControl
              enabled={true}
              color={"#ffffff"}
              tintColor={"#ffffff"}
              refreshing={isRefresh}
              onRefresh={onRefresh}
            />
          }
          bounces={false}
          // stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          style={{ ...styles.list }}
          sections={data}
          keyExtractor={(item, index, section) => {
            return item + index;
          }}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
        />
      </View>
      {/* <NavBarShadow /> */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  debugBox: {
    borderWidth: 1,
    borderColor: "red",
  },
  container: {
    flex: 1,
    width: windowWidth,
  },
  headerTitle: {
    color: COLORS.white,
    fontFamily: FONTS.bwBlack,
    fontSize: 21,
    alignContent: "center",
  },
  divider: {
    height: 3,
    color: "red",
    width: contentWidth,
  },
  list: {
    flex: 1,
  },
  feedSectionHeader: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "center",
    alignSelf: "center",
    width: windowWidth,    
  },
  feedSectionTitle: {
    fontFamily: FONTS.bwBold,
    fontSize: 21,
    color: COLORS.white,
    alignSelf: "flex-start",
    marginLeft: 10,
    textTransform: "capitalize",
  },
  item: {
    backgroundColor: "rgba(0,0,0,0.3)",
    marginTop: 20,
    marginHorizontal: 30,
    height: 90,
  },
  previousEventTitle: {
    fontFamily: FONTS.bwBold,
    fontSize: 16,
    color: COLORS.white,
    alignSelf: "flex-start",  
  },
  previousEventDate: {
    fontFamily: FONTS.bwLight,
    fontSize: 13,
    color: COLORS.white,
    alignSelf: "flex-start",
  }
});
export default TabMyLife;
