import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaView from "react-native-safe-area-view";
import RNCalendarEvents from "react-native-calendar-events";
import { COLORS } from "../../helpers/colors";
import moment from "moment";
import { icon, placeholderImages } from "../../helpers/assets";
import NavigationBarButton from "../../components/NavigationBarButton";
import { FONTS } from "../../helpers/fonts";
import EventCardFeedItem from "../../components/EventCardFeedItem";
import PhotoFeedItem from "../../components/PhotoFeedItem";
import { tempTicketData } from "../../helpers/tempData";
import { numberTruncate } from "../../helpers/functions";
import { FeedSections } from "../../components/FeedSection";
import Hyperlink from 'react-native-hyperlink'
import {
  cardHeight,
  cardWidth,
  contentWidth,
  eventTicketBottomBarHeight,
  windowWidth,
} from "../../helpers/dimensions";
import {
  fnGetEventDetails,
  fnGetImageURL,
  fnGetPopularEvents,
  fnGetScheduleEventDetails,
  fnTicketPurchase,
  URLB
} from "../../helpers/api";
import { errorAlert, okAlert } from "../../helpers/alerts";
import { useSelector } from "react-redux";
import { selectProfile } from "../../slices/profileSlice";
const EventDetails = ({ route, navigation }) => {
  const eventId = route.params.eventId;
  const [eventDetails, setEventDetails] = useState({});
  const [isTicketBought, updateTicketBought] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [moreEvents, setMoreEvents] = useState([]);
  const [tickets, updateTickets] = useState([]);
  const profile = useSelector(selectProfile);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let startDate = new Date();
    // startDate.setFullYear(startDate.getFullYear() -1)
    let endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 100);
    fnGetPopularEvents(100, 0, startDate, endDate, null, null)
      .then(async (response) => {
        let dataed = await response.json()
        // console.log(dataed)
        // return
        let data = dataed.data || [];
        const filtered = data.filter((item) => item.title !== eventId);
        setMoreEvents(filtered);
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again later");
      });
  }, []);

  useEffect(() => {
    console.log('ID: ', eventId)
    fnGetEventDetails(eventId)
      .then((response) => {
        response.json().then((json) => {
          setEventDetails(json?.data[0]);
          console.log('Res: ', json)
        });
      })
      .catch((error) => {
        // errorAlert("Error", "We’ve encountered a problem, try again later");
      });
  }, [eventId]);

  useEffect(() => {
    updateTickets(tempTicketData());
  }, []);

  const addCalendar = () => {
    let startDate = moment(eventDetails.start_at);
    let endDate = moment(eventDetails.start_at);
    RNCalendarEvents.checkPermissions().then(
      (result) => {
        if (result === "authorized") {
          // saveEvent(startDate, endDate)
          saveCalendar(startDate, endDate);
        } else {
          RNCalendarEvents.requestPermissions(false).then(
            (result) => {
              if (result === "authorized") {
                saveCalendar(startDate, endDate);
              } else if (result === "denied") {
                Alert.alert(
                  "Please enable calendar in the setting of your device."
                );
              }
            },
            (result) => {
              console.error(result);
              Alert.alert(
                "An Error has occurred when requesting permissions",
                result
              );
            }
          );
        }
      },
      (result) => {
        Alert.alert("An Error has occurred when checking permissions", result);
        console.error(result);
      }
    );
  };

  const saveEvent = (startDate, endDate, calendarId) => {
    RNCalendarEvents.saveEvent(
      `${eventDetails.name} - ${eventDetails.title}`,
      {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: eventDetails.location || "",
        description: eventDetails.description,
        calendarId: calendarId,
        alarms: [
          {
            date: Platform.OS === "ios" ? -60 : 60,
          },
        ],
      },
      { sync: true }
    ).then(
      (result) => {
        okAlert(
          "Event Saved Success",
          `Check your calendar for\n${eventDetails.name} - ${eventDetails.title
          }\n${moment(startDate).format("DD MMMM yyyy")}`
        );
      },
      (result) => {
        console.error(result);
        Alert.alert("An Error has occurred when adding an Event", result);
      }
    );
  };

  const saveCalendar = (startDate, endDate) => {
    RNCalendarEvents.findCalendars().then((calendars) => {
      if (Platform.OS === "android") {
        const calendar = calendars.find(
          (cal) => cal.allowsModifications && cal.isPrimary
        );
        if (!calendar) {
          errorAlert(
            "Unable Get Calendar",
            "Please make sure you are connected to your google account and allow calendar sync."
          );
          return;
        }
        saveEvent(startDate, endDate, calendar.id);
      } else {
        if (calendars <= 0) {
          saveEvent(startDate, endDate);
          return;
        }
        let source = {
          name: calendars[0].source,
          type: calendars[0].type,
        };
        let myScrollCalendar = calendars.filter((item) => {
          return item.title === "My Scroll Event";
        });

        if (myScrollCalendar.length > 0) {
          saveEvent(startDate, endDate, myScrollCalendar[0].id);
        } else {
          RNCalendarEvents.saveCalendar({
            title: "My Scroll Event",
            color: "red",
            entityType: "event",
            name: "My Scroll",
            accessLevel: "owner",
            ownerAccount: calendars[0].source,
            source: source,
          })
            .then((calendarId) => {
              saveEvent(startDate, endDate, calendarId);
            })
            .catch((error) => {
              saveEvent(startDate, endDate);
            });
        }
      }
    });
  };

  const createProfileRow = (members) => {
    if (!members) {
      return;
    }
    const marginLeft = 7;
    const profileDiameter = 34;
    const showNumProfile = Math.floor(
      (windowWidth - 40) / (profileDiameter + marginLeft) - 1
    );
    const remainingProfile = members.length - showNumProfile;
    let justify = {};
    if (members.length <= showNumProfile) {
      justify = {
        justifyContent: "flex-start",
      };
    } else {
      justify = {
        justifyContent: "space-between",
      };
    }

    return isTicketBought ? null : (
      <View
        style={{
          ...justify,
          margin: 10,
          flexDirection: "row",
          marginLeft: 20 - marginLeft,
          marginRight: 20,
        }}
      >
        {members.map((item, index) => {
          return index + 1 <= showNumProfile ? (
            <Image
              key={item.index}
              style={{
                resizeMode: "cover",
                marginLeft: marginLeft,
                width: profileDiameter,
                height: profileDiameter,
                borderRadius: profileDiameter / 2,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: "gray",
              }}
              source={
                item.avatar_url
                  ? { uri: fnGetImageURL(item.avatar_url) }
                  : placeholderImages.profile_pic_placeholder
              }
            />
          ) : null;
        })}
        {remainingProfile > 0 ? (
          <View
            key={"remaining"}
            style={{
              marginLeft: marginLeft,
              width: profileDiameter,
              height: profileDiameter,
              borderRadius: profileDiameter / 2,
              backgroundColor: "#1e1e20",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.bwBlack,
                fontSize: 8,
              }}
            >
              +{numberTruncate(remainingProfile)}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderPhotoFeedItem = ({ item, index }) => {
    return (
      <PhotoFeedItem
        key={index}
        item={item}
        index={index}
        onItemPress={() => onPhotoFeedItemPress({ item, index })}
      />
    );
  };

  const renderEventCardFeedItem = ({ item, index }) => {
    return (
      <EventCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight }}
        index={index}
        onItemPress={() => onEventItemPress({ item, index })}
      />
    );
  };

  const onEventItemPress = ({ item, index }) => {
    setEventDetails(item);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const onPhotoFeedItemPress = ({ item, index }) => { };

  const eventInteractions = () => {
    return (
      <View>
        <TouchableOpacity
          style={{
            marginTop: 20,
            flex: 1,
            height: 45,
            marginLeft: 20,
            marginRight: 20,
            borderWidth: 2,
            borderColor: '#321F3D',
            backgroundColor: '#321F3D',
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            addCalendar();
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.bwBlack,
              fontSize: 15,
            }}
          >
            Add to calendar
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ticketDetails = () => {
    return (
      <View>
        <View
          style={{
            ...styles.feedSectionHeader,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: "rgba(255, 255, 255, .1)",
          }}
        >
          <Text style={styles.feedSectionTitle}>
            {tickets.length + " Tickets"}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          {tickets.map((item, index) => {
            return renderTicketFeedItem(item, index);
          })}
        </View>
      </View>
    );
  };
  const renderTicketFeedItem = (item, index) => {
    return (
      <View style={styles.ticketContainer} key={index}>
        <LinearGradient
          style={{
            width: "55%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          colors={["#0a1818", "#142b2a"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        >
          <Image
            style={{ width: 100, height: 100, resizeMode: "contain" }}
            source={placeholderImages.qr_code}
          />
        </LinearGradient>
        <View style={{ marginLeft: 20 }}>
          <Image
            style={{ height: 20, resizeMode: "contain" }}
            source={icon.ticket}
          />
          <Text
            style={{ marginTop: 5, color: "#5c5c5c", fontFamily: FONTS.bwBold }}
          >
            Ticket Details
          </Text>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text
              style={{
                fontFamily: FONTS.bwBold,
                fontSize: 13,
                color: "#5c5c5c",
              }}
            >
              {"Section:" + "  "}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.bwBlack,
                fontSize: 13,
                color: "#5c5c5c",
              }}
            >
              {item.section}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text
              style={{
                fontFamily: FONTS.bwBold,
                fontSize: 13,
                color: "#5c5c5c",
              }}
            >
              {"Seats:" + "  "}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.bwBlack,
                fontSize: 13,
                color: "#5c5c5c",
              }}
            >
              {item.seat}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const displayBottomViews = () => {
    return isTicketBought ? ticketDetails() : eventInteractions();
  };

  const ticketOptions = () => {
    return isTicketBought ? null : (
      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <LinearGradient
          style={{
            position: "absolute",
            width: "100%",
            marginTop: -70,
            height: eventTicketBottomBarHeight,
          }}
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.9)"]}
          pointerEvents="none"
        />
        <SafeAreaView
          style={{
            backgroundColor: COLORS.black,
            height: 80,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                marginTop: 20,
                width: 90,
                height: 50,
                borderRadius: 14,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.bwLight,
                  fontSize: 10,
                  textTransform: "uppercase",
                }}
              >
                {eventDetails?.start_price ? 'Starting at' : ''}
              </Text>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.bwBlack,
                  fontSize: 24,
                }}
              >
                {eventDetails?.start_price ? `\u00A3${eventDetails?.start_price}` : 'Free'}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: 20,
                width: 175,
                height: 50,
                borderWidth: 2,
                backgroundColor: COLORS.purple,
                borderRadius: 14,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                buyTicket();
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.bwBold,
                  fontSize: 15,
                }}
              >
                {eventDetails.start_price ? "Buy ticket" : "Going"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  let scrollView = ScrollView;
  const buyTicket = () => {
    console.log(eventDetails)
    // return
    if (moment(eventDetails?.end_at).isAfter(new Date())) {
      if (eventDetails?.start_price === null) {
        let data = {
          price: 0,
          quantity: 0,
          "user_id": profile.id,
          "scheduled_event_id": eventDetails.id,
          "ticket_type_id": 0,
          "stripeTokenId": null,
          "base_price": 0
        }
        console.log(eventDetails)
        // return
        fetch(URLB+'/events/ticket', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
          .then(async (res) => {
            let json = await res.json()
            console.log(json)
            // alert(json.message)
            alert("Event added, you're now going!")
          })
          .catch((err) => {
            console.log(err)
          })
        return
        // fnTicketPurchase(eventDetails.event_id, [])
        //       .then(async(response) => {
        //         // let json =await response.json()
        //         // console.log(ticketsPurchase);
        //         console.log("response", response.data);
        //         var peopleAttending = 0;
        //         var ticket_type_id
        //         alert("Successfully marked as going!")


        //       })
        //       .catch((error) => {console.log(error) });
        // updateTicketBought(true)
      } else {
        navigation.navigate("EventTicketSelection", { event: eventDetails });
      }
    } else {
      alert("Event is expired")
    }
  };

  const loadingScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={COLORS.purple} />
    </View>
  );

  const detailScreen = () => (
    <View>
      <ScrollView
        style={{ width: windowWidth, height: "100%" }}
        contentContainerStyle={{
          paddingBottom: isTicketBought ? 30 : eventTicketBottomBarHeight + 80,
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        ref={(view) => {
          scrollView = view;
        }}
      >
        <View
          style={{
            paddingBottom: 20,
            borderBottomRightRadius: 23,
            borderBottomLeftRadius: 23,
          }}
        >
          <ImageBackground
            style={{
              width: "100%",
              height: 250,
              overflow: "hidden",
              backgroundColor: "rgba(0,0,0,0)",
            }}
            imageStyle={{
              borderBottomRightRadius: 23,
              borderBottomLeftRadius: 23,
            }}
            source={{
              uri: eventDetails.image_url,
            }}
          ></ImageBackground>
          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text
              style={{
                ...styles.mainText,
                marginHorizontal: 20,
                fontSize: 21,
              }}
            >
              {eventDetails.title}
            </Text>
            {createProfileRow(eventDetails.members)}
            <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9' }}>
              <Text
                style={{
                  ...styles.minorText,
                  marginHorizontal: 20,
                  fontSize: 14,
                  lineHeight: 17,
                }}
              >
                {eventDetails.description}
              </Text>
            </Hyperlink>
            {displayBottomViews()}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 35,
                  marginHorizontal: 20,
                }}
              >
                <Image style={{ tintColor: "white" }} source={icon.clock} />
                <Text
                  style={{
                    ...styles.mainText,
                    marginLeft: 20,
                  }}
                >
                  {moment(eventDetails.start_at,"yyyy-MM-DD").format("dddd, DD MMM, yyyy")}
                </Text>
                <Text
                  style={{
                    ...styles.minorText,
                    marginLeft: 20,
                  }}
                >{`${moment(eventDetails.start_at).format("h:mm a")} - ${moment(
                  eventDetails.end_at
                ).format("h:mm a")}`}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 35,
                  marginHorizontal: 20,
                }}
              >
                <Image
                  style={{ tintColor: "white" }}
                  source={icon.location_pin}
                />
                <Text style={{ ...styles.mainText, marginLeft: 20 }}>
                  {eventDetails.location}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 35,
                  marginHorizontal: 20,
                }}
              >
                <Image style={{ tintColor: "white" }} source={icon.people} />
                <Text style={{ ...styles.mainText, marginLeft: 20 }}>
                  {eventDetails.name}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <SafeAreaView>
          {/* Photos & Updates, comment this back in */}
          {photos && photos.length > 0 ? (
            <FeedSections
              title={"PHOTOS & UPDATES"}
              data={photos}
              renderItem={renderPhotoFeedItem}
              snapWidth={300}
              listStyle={{ height: 140 }}
            />
          ) : null}
          {moreEvents && moreEvents.length > 0 ? (
            <FeedSections
              title={"MORE EVENTS"}
              data={moreEvents}
              renderItem={renderEventCardFeedItem}
              snapWidth={cardWidth + 10}
              listStyle={{ height: cardHeight }}
            />
          ) : null}
        </SafeAreaView>
      </ScrollView>
      {ticketOptions()}
    </View>
  );

  const displayScreen = () => {
    return isLoading ? loadingScreen() : detailScreen();
  };

  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} locations={[0, 0.8, 1]} style={{
      flex: 1,
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}>
      {displayScreen()}
      <SafeAreaView style={{ position: "absolute", top: 0, left: 0 }}>
        <NavigationBarButton
          large
          style={{
            marginLeft: 20,
            marginTop: 20,
          }}
          icon={icon.back_block}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainText: {
    color: COLORS.white,
    fontFamily: FONTS.bwBold,
    fontSize: 12,
  },
  minorText: {
    color: "#b0b0b0",
    fontFamily: FONTS.bwLight,
    fontSize: 10,
  },
  feedSectionHeader: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "center",
    alignSelf: "center",
    width: contentWidth,
  },
  feedSectionTitle: {
    fontFamily: FONTS.bwBlack,
    fontSize: 21,
    color: COLORS.white,
    alignSelf: "center",
  },
  feedSectionCaption: {
    fontFamily: FONTS.bwMedium,
    fontSize: 13,
    color: "#b0b0b0",
    alignSelf: "center",
  },
  list: {
    flex: 1,
    flexDirection: "row",
    marginTop: 14,
  },
  ticketContainer: {
    marginTop: 15,
    backgroundColor: "white",
    height: 150,
    width: cardWidth,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 23,
    marginLeft: 5,
    marginRight: 5,
    overflow: "hidden",
  },
});

export default EventDetails;
