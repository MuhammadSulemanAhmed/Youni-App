import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  Alert,
  AsyncStorage
} from "react-native";
import { COLORS } from "../../helpers/colors";
import { NavBarShadow } from "../../components/NavBarShadow";
import LinearGradient from "react-native-linear-gradient";
import { FONTS } from "../../helpers/fonts";
import { background, empty, icon, searchImages, } from "../../helpers/assets";
import TicketFeedItem from "../../components/TicketFeedItem";
import ScreenHeader from "../../components/ScreenHeader";
import { NavigationHeaderText } from "../../components/NavigationHeaderText";
import { cardHeight, cardWidth, contentWidth, windowWidth } from "../../helpers/dimensions";
import {
  fnGetImageURL,
  fnGetProfileSocieties,
  fnGetProfileSocietiesNode,
  fnGetUserEvents,
  fnAddViewToSociety,
  fnGetPopularEvents
} from "../../helpers/api";
import { errorAlert } from "../../helpers/alerts";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import {
  selectMySocieties,
  setMySocieties,
} from "../../slices/mySocietiesSlice";
import SafeAreaView from "react-native-safe-area-view";
import HollowButton from "../../components/HollowButton";
import moment from "moment";
import { selectProfile, selectProfileId } from "../../slices/profileSlice";
import QRCode from 'react-native-qrcode-generator';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { FeedSections } from "../../components/FeedSection";
import EventCardFeedItem from "../../components/EventCardFeedItem";
import SocietyCardFeedItem from "../../components/SocietyCardFeedItem";
import { current } from "@reduxjs/toolkit";
const TabMyLife = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const isFocused = useIsFocused();
  const MY_SOCIETY_HEADER = "MY SOCIETY";
  const UPCOMING_EVENTS_HEADER = "UPCOMING EVENTS";
  const mySocieties = useSelector(selectMySocieties);
  const userId = useSelector(selectProfileId);
  const [currentSocieties, setCurrentSocieties] = useState([]);
  const [twoRowCurrent, setTwoRowCurrent] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [data, updateData] = useState([]);
  const [selectedEvent, setSelectedevent] = useState(null);

  const [isRefresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isFocused) {
      // alert("A")
      fetchFeedData();
    }
    // fetchFeedData();
  }, [isFocused]);

  const fetchFeedData = () => {
    let startDate = new Date();
    let endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 100);
    fnGetUserEvents(userId, 100, 0, startDate, endDate)
      .then(async (response) => {
        // return
        // let dat = await response.json()
        // console.warn("=====?", dat)
        const data = response.data?.data || [];
        setUpcomingEvents(data);
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again latera");
      })
      .finally(() => {
        setRefresh(false);
      });

    fnGetProfileSocietiesNode(userId)
      .then((response) => {
        response.json().then((json) => dispatch(setMySocieties(json.data)));
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again lateZr");
      })
      .finally(() => {
        setRefresh(false);
      });
      
  };

  useEffect(() => {
    //Create a Deep copy of the Array
    let clonedArray = JSON.parse(JSON.stringify(mySocieties));
    setCurrentSocieties(mySocieties);
    setTwoRowCurrent(createTwoRowData(clonedArray));
  }, [mySocieties]);

  /**
   * Update Data to be fed into SectionList
   */
  useEffect(() => {
    updateData([
      {
        title: MY_SOCIETY_HEADER,
        data: [twoRowCurrent],
      },
      {
        title: UPCOMING_EVENTS_HEADER,
        data:
          upcomingEvents.length === 0
            ? [UPCOMING_EVENTS_HEADER]
            : upcomingEvents, //When length is 0 create an array of a single item to represent Empty state
      },
    ]);
  }, [twoRowCurrent, upcomingEvents]);

  /**
   * Splice the data into sets of 2
   * @param data
   */
  const createTwoRowData = (data) => {
    let arrays = [],
      size = 2;
    while (data.length > 0) {
      arrays.push(data.splice(0, size));
    }
    return arrays;
  };

  /**
   * Render item depending on section
   */
  const renderItem = ({ item, index, section }) => {
    return section.title === MY_SOCIETY_HEADER
      ? renderMySociety(section.data[0], index)
      : renderUpcomingEvents(item, index);
  };

  /**
   * Render empty or feed depending on array
   */
  const renderUpcomingEvents = (item, index) => {
    return item === UPCOMING_EVENTS_HEADER
      ? renderEmptyUpcomingEvents()
      : renderUpcomingEventItem(item, index);
  };

  const renderEmptyUpcomingEvents = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          width: "100%",
          paddingBottom: 20,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Image
          style={{ width: "90%", resizeMode: "contain" }}
          source={empty.upcoming_events}
        />
        <Text
          style={{
            marginTop: 10,
            color: COLORS.white,
            fontFamily: FONTS.bwBold,
            fontSize: 18,
          }}
        >
          No Upcoming Events
        </Text>
      </View>
    );
  };

  const renderUpcomingEventItem = (item, index) => {

    let startTime = moment(item.end_at).format('DD-MM-YYYY HH:mm A')
    let currentTime = moment(new Date).format('DD-MM-YYYY HH:mm A')

    // console.log(item.title)
    if (new Date(item.end_at) > new Date()) {
      console.log(item.ticket_price)
      return (
        <TicketFeedItem
          title={item.title}
          titcketClass={item?.name ? item.name : null}
          eventDate={item.start_at}
          numTickets={item.quantity}
          index={index}
          eventImageID={item.image_url}
          showArrow={false}
          ticket_type_id={item.id}
          onPress={() => {
            Alert.alert(
              "Disclaimer",
              "Show your ticket to the organiser, Remember, once they scan it, you can't scan it again!",
              [
                {
                  text: "Yes,Confirm",
                  onPress: () => { setSelectedevent(item) }
                },
                {
                  text: "Cancel",
                  onPress: () => { }
                }
              ]
            )

            // alert(JSON.stringify(item))
          }}
        />
      );
    } else {
      return null
    }
  };

  /**
   * Render empty state or a single large card or a column of multiple cards depending on array size
   */
  const renderMySociety = (item, index) => {
    if (!item[0]) {
      return renderMySocietyEmptyState();
    }
    if (item[0].length === 1) {
      return renderMySocietyRowItem(
        item[0][0],
        index,
        {
          height: 365,
          width: contentWidth,
          marginVertical: 10,
          alignSelf: "center",
          borderRadius: 23,
          overflow: "hidden",
        },
        ["rgba(48,165,147,0.88)", "rgba(7,20,20,0.88)"]
      );
    }
    return renderMySocietyFeed(item, index);
  };

  const renderMySocietyEmptyState = () => {
    return (
      <View
        style={{
          height: 365,
          width: contentWidth,
          marginVertical: 10,
          backgroundColor: "#050f0f",
          alignSelf: "center",
          borderRadius: 23,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: "60%", marginTop: 30, resizeMode: "contain" }}
          source={empty.my_society}
        />
        <Text
          style={{
            marginTop: 10,
            fontFamily: FONTS.bwBold,
            fontSize: 18,
            color: COLORS.white,
          }}
        >
          You are not a part of any groups!
        </Text>
        <HollowButton
          width={cardWidth}
          text={"FIND A GROUP"}
          onPress={() => {
            navigation.navigate("TabHome");
          }}
        />
      </View>
    );
  };

  /**
   * Create a horizontal feed for user's followed society
   */
  const renderMySocietyFeed = (items, index) => {
    return (
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 10}
        decelerationRate={"fast"}
        snapToAlignment={"start"}
        style={{ marginVertical: 15, height: 365 }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={items}
        renderItem={renderTwoRowEventItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  /**
   * Create a component of a column of followed society
   */
  const renderTwoRowEventItem = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: 5, paddingBottom: 10 }}>
        {renderMySocietyRowItem(
          item[0],
          index,
          {
            height: 175,
            width: cardWidth,
            marginTop: 10,
            alignSelf: "center",
            borderRadius: 23,
            overflow: "hidden",
          },
          ["rgba(48,165,147,0.88)", "rgba(7,20,20,0.88)"]
        )}
        {item.length > 1
          ? renderMySocietyRowItem(
            item[1],
            index,
            {
              height: 175,
              width: cardWidth,
              marginTop: 5,
              alignSelf: "center",
              borderRadius: 23,
              overflow: "hidden",
            },
            ["rgba(27,192,147,0.88)", "rgba(7,20,20,0.88)"]
          )
          : null}
      </View>
    );
  };

  const renderMySocietyEvents = (events) => {
    if (events.length <= 0) {
      return null;
    }

    return (
      <View>
        {renderMySocietyEventField(events[0].name, events[0].start_at)}
        {events.length > 1
          ? renderMySocietyEventField(events[1].name, events[1].start_at)
          : null}
      </View>
    );
  };

  const renderMySocietyEventField = (eventName, eventStart) => {
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.bwMedium,
            fontSize: 13,
          }}
        >
          {eventName}
        </Text>
        <Image
          style={{
            width: 13,
            height: 13,
            tintColor: COLORS.white,
            resizeMode: "contain",
            marginLeft: 5,
          }}
          source={icon.clock}
        />
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.bwMedium,
            fontSize: 13,
            marginLeft: 5,
          }}
        >
          {moment(eventStart).format("DD MMMM")}
        </Text>
      </View>
    );
  };

  const renderMySocietyRowItem = (item, index, itemStyle, colors) => {
    let society = item;
    return (
      <TouchableHighlight
        style={{
          ...itemStyle,
        }}
        onPress={() => {
          goToSociety(item);
        }}
      >
        <ImageBackground
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          source={{ uri: item.banner_url }}
        >
          <LinearGradient
            style={{ width: "100%", height: "100%" }}
            colors={colors}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={{ position: "absolute", bottom: 26, left: 26 }}>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.bwBold,
                  fontSize: 21,
                  marginBottom: 5,
                }}
              >
                {society.name}
              </Text>
              {/* {renderMySocietyEvents(society.events)} */}
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.bwBoldItalic,
                  fontSize: 13,
                  marginTop: 5,
                }}
              >{`${society.content_updates ? society.content_updates.length : 0
                } Recent Content Updates`}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableHighlight>
    );
  };

  const goToSociety = async (item) => {
    const tempId = item.id ? item.id : item.society_id;
    let dat = {
      society_id: parseInt(tempId),
      user_id: parseInt(userId)
    }
    fnAddViewToSociety(dat)
    console.log(item)
    // return
    navigation.navigate("SocietyDetails", {
      societyId: tempId,
      societyName: item.name,
      societyDescription: item?.description,
      societyAvatarId: item.avatar_url === "null" ? null : item.avatar_url,
      isFollowing:
        mySocieties.filter((society) => {
          return society.id === tempId;
        }).length > 0,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onRefresh = useCallback(() => {
    setRefresh(true);
    fetchFeedData();
  });

  const onFeedEventItemPress = (_item, index) => {

    let startDate = new Date();
    // startDate.setFullYear(startDate.getFullYear() -1)
    let endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 100);
    fnGetPopularEvents(100, 0, startDate, endDate, null, null)
      .then(async(response) => {
        let dataed=await  response.json()
        // console.log(dataed)
        // return
        let data = dataed.data || [];
        const filtered = data.filter((item) => item.title === _item.title);
        navigation.navigate("EventStack", {
          screen: "EventDetails",
          params: { eventId: filtered[0].id },
        });
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again later");
      });
  };

  const onSocietyItemPress = (item, index ) => {
    const tempId = item.id ? item.id : item.society_id;
    let dat = {
      society_id: parseInt(tempId),
      user_id: parseInt(profile.id)
    }
    // alert(JSON.stringify(dat))
    fnAddViewToSociety(dat)
    navigation.navigate("SocietyDetails", {
      societyId: tempId,
      societyName: item.name,
      societyDescription: item?.description,
      societyAvatarId: item.avatar_url,
      isFollowing:
        mySocieties.filter((society) => {
          return society.id === tempId;
        }).length > 0,
    });
  };
  

  const renderEventItem = ({ item, index }) => {    
    return (
      <EventCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight }}
        index={index}
        onItemPress={() => onFeedEventItemPress(item, index)}
      />
    )
    /* return (
      <MainFeedClubItem
        key={index}
        index={index}
        title={item.title}
        background={{uri:item.image_url}}
        // background={item.image_url}
        description={item.description}
        memberCount={item?.members - Math.min(4, item.members?.length)}
        members={item?.members?.filter((item, index) => {
          if (index < 4) {
            return item;
          }
        })
          .map((item) => {
            return item.avatar_url;
          })}
        isLast={index === events.length - 1}
        onItemPress={() => onFeedEventItemPress(item, index)}
      />
    ); */
  };

  const renderSocietyCardFeedItem = ({item, index}) => {
    return (
      <SocietyCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight, marginTop: 15 }}
        index={index}
        onItemPress={() => {onSocietyItemPress(item, index )}}
      />
    );
  };
  

  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} locations={[0, 0.8, 1]} style={{ width: '100%', height: '100%' }}>
      {selectedEvent != null ?
        <View
          style={{
            position: "absolute",
            zIndex: 11,
            alignSelf: "center",
            // marginTop: '40%',
            backgroundColor: "rgba(0,0,0,0.1)",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            flex: 1,
            height: '100%'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // console.log(selectedEvent)
              setSelectedevent(null)
            }}
          >
            <View
              style={{
                // position:"absolute",
                // zIndex:11,
                // alignSelf: "center",
                backgroundColor: "white",
                width: Dimensions.get('screen').width * 0.8,
                // height: Dimensions.get('screen').height * 0.5,
                // justifyContent: "center",
                // alignItems: "center",
                borderRadius: 10,
                paddingVertical: 29
              }}
            >
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  // backgroundColor:"red",
                  alignSelf: "flex-end",
                  marginTop: -15,
                  marginRight: 10,
                  justifyContent: 'center',
                  alignItems: "center"
                }}
                onPress={() => {
                  // console.log(selectedEvent)
                  setSelectedevent(null)
                }}
              >
                <Image
                  source={icon.close}
                  style={{
                    height: 25,
                    width: 25
                  }}
                />
              </TouchableOpacity>
              <View
                style={{
                  alignSelf: 'center'
                }}
              >
                {selectedEvent.ticket_price > 0 || selectedEvent.quantity > 0 ?
                  <QRCode
                    value={JSON.stringify({
                      "id": selectedEvent.id,
                      "user_id": selectedEvent.user_id,
                      "event_id": selectedEvent.scheduled_event_id
                    })}
                    size={200}
                    bgColor='black'
                    fgColor='white' />
                  :
                  null
                }
              </View>
              <View
                style={{
                  marginTop: 10,
                  // alignSelf:'center',

                }}
              />

              <Text
                style={{
                  fontSize: 18,
                  marginTop: 20,
                  left: 23
                }}
              >Event Name:{selectedEvent.title}</Text>
              {selectedEvent?.name ?
                <Text
                  style={{
                    fontSize: 18,
                    left: 23
                  }}
                >Ticket Type:{selectedEvent.name}</Text>
                :
                null
              }
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 5,
                  left: 23
                }}
              >Ticket Price: {selectedEvent?.ticket_price ? selectedEvent?.ticket_price : 0}</Text>
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 5,
                  left: 23
                }}
              >Event Time: {moment(selectedEvent.start_at).format("DD MMM,YYYY hh:mm a")}</Text>
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 5,
                  left: 23
                }}
              >Quantity: {selectedEvent.quantity}</Text>
            </View>
          </TouchableOpacity>
        </View>
        :
        null
      }
      <ScrollView style={{ flex: 1, overflow: 'scroll' }}>
        <View style={styles.heaederTitleWrapper}>
          <Text adjustsFontSizeToFit numberOfLines={1} style={{...styles.headerTitle}}>My Life</Text>
        </View>
        {/* <View
          style={styles.customSectionHeader}
        >
          <Text style={styles.feedSectionTitle}>Community</Text>
        </View> */}    
                        

        {/* My Life Communties section */}
        {/* {mySocieties.length >= 1 ? (
          <FeedSections
                title={"Communities"}
                data={mySocieties}
                renderItem={renderSocietyCardFeedItem}
                snapWidth={cardWidth + 10}                
              />
        ) : (
          <View style={{height: 200, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                ...styles.feedSectionHeader,                
                borderColor: "rgba(255, 255, 255, .1)",
              }}
            >
              <Text style={styles.feedSectionTitle}>Communities</Text>
            </View>
            <Image
            style={{height: 50, width: 50, marginBottom: 10}}
            source={searchImages.search}
          />
          <Text
              style={{
                color: COLORS.purple,
                fontFamily: FONTS.bwMedium,
                fontSize: 13,
              }}
            >
              You haven't followed any communities yet
            </Text>
            </View>
        )} */}
        {/* <ScrollView horizontal style={{marginBottom: 20}}>
        {mySocieties.map((item, index) => {
          return renderSocietyCardFeedItem(item, index)
        })}
        </ScrollView>  */}
{/*         <SafeAreaView style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20}}>
          <Text style={styles.feedSectionTitle}>Events</Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
            }}
          >
            <Text
              style={{
                color: COLORS.purple,
                fontFamily: FONTS.bwMedium,
                fontSize: 13,
              }}
            >
              View all
            </Text>
          </TouchableOpacity>
        </SafeAreaView> */}
        {upcomingEvents.length >= 1 ? (
          <FeedSections
            title={"Events"}
            data={upcomingEvents}
            renderItem={renderEventItem}
            snapWidth={cardWidth + 10}
            listStyle={{ paddingBottom: 50 }}
          />
        ) : (
          <View style={{height: 200, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                ...styles.feedSectionHeader,
                /* borderBottomWidth: StyleSheet.hairlineWidth, */
                borderColor: "rgba(255, 255, 255, .1)",
              }}
            >
              <Text style={styles.feedSectionTitle}>Events</Text>
            </View>
            <Image
            style={{height: 50, width: 50, marginBottom: 10}}
            source={searchImages.search}
          />
          <Text
              style={{
                color: COLORS.purple,
                fontFamily: FONTS.bwMedium,
                fontSize: 13,
              }}
            >
              You haven't purchased any tickets yet
            </Text>
            </View>
        )}

        {/* <View
          style={styles.customSectionHeader}
        >
          <Text style={styles.feedSectionTitle}>Community</Text>
        </View> */}
        {/* <SectionList
          refreshControl={
            <RefreshControl
              enabled={true}
              color={"#ffffff"}
              tintColor={"#ffffff"}
              refreshing={isRefresh}
              onRefresh={onRefresh}
            />
          }
          horizontal={true}
          style={{ ...styles.list }}
          sections={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item + index}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={renderEventItem}          
        /> */}
      </ScrollView>
      
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
  feedSectionHeader: {
    flex: 1,
    marginTop: 20,
    paddingTop: 20,
    justifyContent: "center",
    alignSelf: "center",
    width: contentWidth,
  },
  feedSectionTitle: {
    fontFamily: FONTS.bwBold,
    fontSize: 20,
    color: COLORS.white,
    alignSelf: "flex-start",
  },
  item: {
    backgroundColor: "rgba(0,0,0,0.3)",
    marginTop: 20,
    marginHorizontal: 30,
    height: 90,
  },
  list: {
    flex: 1,
    flexDirection: "row",
    marginTop: 14,
  },
  customSectionHeader: {
    marginLeft: 20,
    width: '100%'
  },
  heaederTitleWrapper: {
    width: '100%',
    height: 75,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  headerTitle: {        
    color: COLORS.white,
    fontFamily: FONTS.bwBold,
    fontSize: 25,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
export default TabMyLife;
