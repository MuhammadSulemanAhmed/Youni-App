import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaView from "react-native-safe-area-view";
import { COLORS } from "../../helpers/colors";
import { empty, icon, placeholderImages } from "../../helpers/assets";
import NavigationBarButton from "../../components/NavigationBarButton";
import { FONTS } from "../../helpers/fonts";
import MainFeedClubItem from "../../components/MainFeedClubItem";
import { cardWidth, windowWidth } from "../../helpers/dimensions";
import Hyperlink from 'react-native-hyperlink'
import {
  addToImages,
  fnCheckExistingChatRoom,
  fnCreateChatRoom,
  fnFollowSociety,
  fnFollowSocietyNode,
  fnGetImageURL,
  fnGetProfileSocietiesNode,
  fnGetPublishedEvents,
  fnGetSocietyMembersNode,
  fnGetSocietyUpdates,
  fnUnfollowSociety,
  fnUnfollowSocietyNode,
  fnGetSocietyFollowersNode
} from "../../helpers/api";
import { errorAlert } from "../../helpers/alerts";
import { useDispatch, useSelector } from "react-redux";
import { setMySocieties } from "../../slices/mySocietiesSlice";
import { selectProfileId, setPhotos } from "../../slices/profileSlice";
import moment from "moment";
import { createNewChatroom } from "../../slices/myChatRoomSlice";
import { ScaledImage } from "../../components/ScaledImage";
import RNFetchBlob from "rn-fetch-blob";
import CameraRoll from "@react-native-community/cameraroll";
import FilledButton from "../../components/FilledButton";
import HollowButton from "../../components/HollowButton";

const teamWidth = (Dimensions.get("window").width - 30 - 10 * 2) / 3;
const SocietyDetails = ({ route, navigation }) => {
  const SOCIETY_CARD_HEADER = "Society Detail Card";
  const EVENT_HEADER = "Events";
  const UPDATE_HEADER = "Photos & Updates";
  const TEAM_HEADER = "Teams";
  const displayUpdateLimit = 5;
  const profileId = useSelector(selectProfileId);
  // const profile = useSelector(selectProfile);
  const { societyId, societyName, societyDescription, societyAvatarId } =
    route.params;
  // alert(societyId)
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(route.params.isFollowing);
  const [events, setEvents] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [displayUpdates, setDisplayUpdates] = useState([]); // Set a limit of 3 until View More is pressed
  const [showMoreUpdateButton, setShowMoreUpdateButton] = useState(false);
  const [adminMembers, setAdminMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [sectionData, setSectionData] = useState([
    {
      title: SOCIETY_CARD_HEADER,
      data: ["society details card"],
    },
    {
      title: EVENT_HEADER,
      data: [[]],
    },
    {
      title: UPDATE_HEADER,
      data: [],
    },
    {
      title: TEAM_HEADER,
      data: [[]],
    },
  ]);
  const dispatch = useDispatch();
  useEffect(async () => {
    fnGetSocietyUpdates(societyId)
      .then(async (response) => {
        let dat = await response.json()
        // alert(JSON.stringify(dat.data))

        let data = dat.data || [];
        setUpdates(dat.data?.reverse());
        setDisplayUpdates(dat.data?.reverse());
        // let reverseData = JSON.parse(JSON.stringify(data)).reverse(); // Updates from backend are in order of oldest to newest, Needs to be reversed
        // if (data.length > displayUpdateLimit) {
        //   let slice = reverseData.slice(0, displayUpdateLimit);
        //   setDisplayUpdates(slice);
        //   // alert(JSON.stringify(slice))
        // } else {
        //   setDisplayUpdates(reverseData);
        // }
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again later");
      });

    try {
      const resEvents = await fnGetPublishedEvents(societyId);
      if (resEvents) {
        const json = await resEvents.json();
        console.log("------>",json.data)
        if (json) {
          setEvents(json.data);
        }
      }

      const resMembers = await fnGetSocietyFollowersNode(societyId);
      if (resMembers) {
        const json = await resMembers.json();
        // alert(JSON.stringify(societyId))
        if (json) {
          let data = json.data;
          let adminMember = data.filter((item) => {
            return item.admin;
          });

          // setAdminMembers(adminMember);
          setMembers(data);
        }
      }
    } catch (error) {
      console.log(error);
      errorAlert("Error", "We’ve encountered a problem, try again later");
    }
    try {
      const resMembers = await fnGetSocietyMembersNode(societyId);
      if (resMembers) {
        const json = await resMembers.json();
        if (json) {
          let data = json.data;
          // let adminMember = data.filter((item) => {
          //   return item.admin;
          // });

          setAdminMembers(data);
          // setMembers(data);
        }
      }
    } catch (error) {
      console.log(error);
      errorAlert("Error", "We’ve encountered a problem, try again later");
    }
  }, []);

  useEffect(() => {
    setIsFollowing(
      members.filter((item) => {
        return item.user_id === profileId;
      }).length > 0
    );
  }, [members]);

  useEffect(() => {
    if (
      updates?.length > displayUpdateLimit &&
      displayUpdates?.length === displayUpdateLimit
    ) {
      setShowMoreUpdateButton(true);
    } else {
      setShowMoreUpdateButton(false);
    }
  }, [displayUpdates]);

  useEffect(() => {
    setSectionData([
      {
        title: SOCIETY_CARD_HEADER,
        data: ["society details card"],
      },
      {
        title: EVENT_HEADER,
        data: [events],
      },
      {
        title: UPDATE_HEADER,
        data: displayUpdates?.length === 0 ? [UPDATE_HEADER] : displayUpdates,
      },
      /* {
        title: TEAM_HEADER,
        data: [adminMembers],
      }, */
    ]);
  }, [events, displayUpdates, adminMembers]);

  const renderEventCardFeedItem = ({ item, index }) => {
    console.log(item.image_url)
    // return
    return (
      <MainFeedClubItem
        index={index}
        title={item.title}
        background={{ uri: item.image_url }}
        description={item.description}
        memberCount={item.members - Math.min(4, item.members?.length)}
        // members={item.members
        //   .filter((item, index) => {
        //     return index < 4;
        //   })
        //   .map((item) => {
        //     return item.avatar_url;
        //   })}
        members={[]}
        isLast={index === events?.length - 1}
        onItemPress={() => onEventItemPress({ item, index })}
      />
    );
  };

  const renderTeamFeedItem = ({ item, index }) => {
    // if (item.admin) {
    //   return null
    // }
    return (
      <View style={{ marginHorizontal: 5, height: 120, alignItems: "center" }}>
        <Image
          style={{
            width: teamWidth,
            height: 70,
            resizeMode: "cover",
            borderRadius: 23,
            overflow: "hidden",
            backgroundColor: COLORS.purple,
          }}
          source={
            item?.image !== "null"
              ? { uri: item.image }
              : placeholderImages.team_placeholder
          }
        />
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.bwBold,
            fontSize: 12,
            marginTop: 8,
          }}
        >{`${item.name}`}</Text>
        {/* <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.bwBold,
            fontSize: 12,
            marginTop: 8,
          }}
        >{`${item.last_name}`}</Text> */}
        {/* <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.bwRegular,
            fontSize: 9,
          }}
        >
          {item.title ? item.title : "Admin"}
        </Text> */}
      </View>
    );
  };

  const onEventItemPress = ({ item, index }) => {
    navigation.navigate("EventStack", {
      screen: "EventDetails",
      params: { eventId: item.id },
    });
  };

  const onFollowPress = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    if (isFollowing) {
      fnUnfollowSocietyNode(profileId, societyId)
        .then(async () => {
          fnGetProfileSocietiesNode(profileId)
            .then((response) => {
              response
                .json()
                .then((json) => dispatch(setMySocieties(json.data)));
            })
            .catch((error) => {
              console.log(error);
              errorAlert(
                "Error",
                "We’ve encountered a problem, try again later"
              );
            })
            .finally(() => {
              setIsLoading(false);
            });
          try {
            const resMembers = await fnGetSocietyFollowersNode(societyId);
            if (resMembers) {
              const json = await resMembers.json();
              if (json) {
                let data = json.data;
                let adminMember = data.filter((item) => {
                  return item.admin;
                });

                // setAdminMembers(adminMember);
                setMembers(data);
              }
            }
          } catch (error) {
            console.log(error);
            errorAlert("Error", "We’ve encountered a problem, try again later");
          }

        })
        .catch((error) => {
          console.log(error);
          errorAlert("Error", "We’ve encountered a problem, try again later");
        });
      try {
        const resMembers = await fnGetSocietyMembersNode(societyId);
        if (resMembers) {
          const json = await resMembers.json();
          if (json) {
            let data = json.data;
            let adminMember = data.filter((item) => {
              return item.admin;
            });

            setAdminMembers(data);
            // setMembers(data);
          }
        }
      } catch (error) {
        console.log(error);
        errorAlert("Error", "We’ve encountered a problem, try again later");
      }
    } else {
      fnFollowSocietyNode(profileId, societyId)
        .then(async () => {
          fnGetProfileSocietiesNode(profileId)
            .then((response) => {
              response.json().then((json) => {
                setIsLoading(false);
                dispatch(setMySocieties(json.data));
              });
            })
            .catch((error) => {
              console.log(error);
              errorAlert(
                "Error",
                "We’ve encountered a problem, try again later"
              );
            })
            .finally(() => {
              setIsLoading(false);
            });
          try {
            const resMembers = await fnGetSocietyFollowersNode(societyId);
            if (resMembers) {
              const json = await resMembers.json();
              if (json) {
                let data = json.data;
                let adminMember = data.filter((item) => {
                  return item.admin;
                });

                // setAdminMembers(adminMember);
                setMembers(data);
              }
            }
          } catch (error) {
            console.log(error);
            errorAlert("Error", "We’ve encountered a problem, try again later");
          }
          try {
            const resMembers = await fnGetSocietyMembersNode(societyId);
            if (resMembers) {
              const json = await resMembers.json();
              if (json) {
                let data = json.data;
                // let adminMember = data.filter((item) => {
                //   return item.admin;
                // });

                setAdminMembers(data);
                // setMembers(data);
              }
            }
          } catch (error) {
            console.log(error);
            errorAlert("Error", "We’ve encountered a problem, try again later");
          }
        })
        .catch((error) => {
          console.log(error);
          errorAlert("Error", "We’ve encountered a problem, try again later");
        });
    }
  };

  const onChatPress = () => {
    fnCheckExistingChatRoom(profileId)
      .then(async (response) => {
        let data = await response.json();
        let chatId = ""
        for (const element of data.data) {
          if (element.society_name === societyName) {
            chatId = element.id
          }
        }
        if (chatId === "") {
          fnCreateChatRoom(societyId, profileId)
            .then(async (response) => {
              let dat = await response.json()
              console.log(dat.data.chat_id)
              // return
              // let data = response.data.data;
              navigation.navigate("ChatMessaging", {
                chatId: dat.data.chat_id,
                societyName,
              });
              dispatch(createNewChatroom(dat.data.chat_id));
            })
            .catch((error) => {
              errorAlert(
                "Error",
                "We’ve encountered a problem, try again latasxer"
              );
            });
        } else {
          console.log(data.data.length)
          if (data.data.length > 0) {
           
            console.log(chatId)
            navigation.navigate("ChatMessaging", {
              chatId: chatId,
              societyName,
            });
          }
        }
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again aaaalater");
      });
  };

  const renderSocietyDetailCard = (item) => {
    return (
      <View
        style={{
          backgroundColor: "rgba(19,38,37,0.5)",
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
            resizeMode: "contain",
            background: "#1a3130",
          }}
          imageStyle={{
            borderBottomRightRadius: 23,
            borderBottomLeftRadius: 23,
          }}
          source={{ uri: societyAvatarId }}
        ></ImageBackground>
        <View
          style={{
            marginTop: 20,
          }}
        >
          <Text
            style={{ ...styles.mainText, marginHorizontal: 20, fontSize: 21 }}
          >
            {societyName}
          </Text>
          <Hyperlink linkDefault={true} linkStyle={ { color: '#2980b9'} }>
          <Text
            style={{
              ...styles.minorText,
              marginHorizontal: 20,
              fontSize: 14,
              lineHeight: 20,
              marginTop: 12,
            }}
          >
            {societyDescription}
          </Text>
          </Hyperlink>
          <View style={{ flex: 1, flexDirection: "row", height: 45, marginTop: 20 }}>
            {isFollowing ? (
              <HollowButton
                style={{ flex: 1 }}
                text={"Unfollow"}
                onPress={onFollowPress}
              />
            ) : (
              <FilledButton
                style={{ flex: 1 }}
                text={'Follow'}
                onPress={onFollowPress}
                disabled={isLoading}
              />
            )}
            <FilledButton
              style={{ flex: 1, backgroundColor: '#4E305F' }}
              text={'Message'}
              onPress={onChatPress}
              disabled={isLoading}
            />

            {/* <TouchableOpacity
              style={{
                marginTop: 20,
                flex: 2,
                height: 45,
                marginLeft: 20,
                marginRight: 20,
                borderWidth: 2,
                borderColor: "#5f7978",
                borderRadius: 14,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                onChatPress();
              }}
            >
              <Image source={icon.chat} />
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    );
  };

  const renderSectionItem = ({ item, section }) => {
    switch (section.title) {
      case SOCIETY_CARD_HEADER:
        return renderSocietyDetailCard(item);
      case EVENT_HEADER:
        return renderEventSection(item);
      case UPDATE_HEADER:
        return renderPhotoUpdateSection(item);
      case TEAM_HEADER:
        return renderTeamSection(item);
      default:
        return <View />;
    }
  };

  const renderHorizontalList = (data, renderItem, itemHeight, itemWidth) => {
    const horizontalPadding = 10;
    return (
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + horizontalPadding}
        decelerationRate={"fast"}
        snapToAlignment={"start"}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        style={{ height: itemHeight, marginTop: 14 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
      />
    );
  };

  const renderEventSection = (events) => {
    return events?.length === 0
      ? renderEventEmptyState()
      : renderHorizontalList(events, renderEventCardFeedItem, 150, cardWidth);
  };

  const renderEventEmptyState = () => {
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.purple,
            height: 150,
            width: cardWidth,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 23,
            marginTop: 14,
            overflow: "hidden",
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.bwBold,
              fontSize: 15,
            }}
          >
            No Events
          </Text>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.bwRegular,
              marginTop: 8,
              fontSize: 15,
              textAlign: "center",
            }}
          >
            {"This society currently have\n no new events planned."}
          </Text>
        </View>
      </View>
    );
  };

  const renderPhotoUpdateSection = (item) => {
    return item === UPDATE_HEADER
      ? renderPhotoUpdateEmptyState()
      : renderPhotoUpdateItem(item);
  };

  const renderPhotoUpdateEmptyState = () => {
    return (
      <View
        style={{
          width: "100%",
          paddingHorizontal: 40,
          flex: 1,
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: "100%", height: 400, resizeMode: "contain" }}
          source={empty.updates}
        />
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.bwBold,
            fontSize: 18,
            marginTop: -40,
            marginBottom: 40,
          }}
        >
          No Photos and Updates Yet
        </Text>
      </View>
    );
  };

  const checkPermission = async (image_URL) => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission
    if (Platform.OS === "ios") {
      // downloadImage(image_URL);
      // alert(image_URL)
      CameraRoll.save(image_URL)
        .then(() => {
          alert("Image Downloaded Successfully.");
        })
        .catch(() => { });
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "App needs access to your storage to download Photos",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log("Storage Permission Granted.");
          downloadImage(image_URL);
        } else {
          // If permission denied then show alert
          alert("Storage Permission Not Granted");
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const downloadImage = (image_URL) => {
    // Main function to download the image
    // To add the time suffix in filename
    let date = new Date();
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          "/image_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ".png",
        appendExt: ".png",
        description: "Image",
      },
    };
    alert("Download Started");
    config(options)
      .fetch("GET", image_URL)
      .then((res) => {
        // Showing alert after successful downloading
        console.log("res -> ", JSON.stringify(res));
        alert(
          "Image Downloaded Successfully. Please Check " +
          PictureDir +
          " for your image"
        );
      });
  };

  const renderPhotoUpdateItem = (update) => {
    let updateSize = { height: null, width: null };
    let buttons = false
    if (update.image === "null" || update.image === "[object Object]" || update.image === "undefined") {
      buttons = false
    } else {
      buttons = true
    }
    console.log("sdxwexw",update)
    // return
    return (
      <View>
        <View
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: COLORS.white,
            borderTopStyle: "solid",
          }}
        >
          <View style={{ padding: 20 }}>
            <Text style={{ ...styles.minorText }}>{update.description}</Text>
            <Text
              style={{
                marginTop: 12,
                color: "#b0b0b0",
                fontFamily: FONTS.bwExtraBoldItalic,
                fontSize: 11,
              }}
            >{`${comparePostTime(update.created_at)} - ${moment(
              update.created_at
            ).format("DD / MM / yyyy")}`}</Text>
          </View>
        </View>
        {buttons ? (
          <View style={{ width: "100%", alignItems: "center" }}>
            <ScaledImage
              source={{
                uri: update.image,
              }}
              width={windowWidth}
            />
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  padding: 6,
                  borderRadius: 2,
                  borderColor: COLORS.appYellow,
                }}
                onPress={() => {
                  // alert()
                  checkPermission(update.image);
                }}
              >
                <Text
                  style={{
                    color: COLORS.appYellow,
                    fontFamily: FONTS.bwExtraBold,
                    fontSize: 15,
                  }}
                >
                  Save Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 6,
                  borderRadius: 2,
                  borderColor: COLORS.appYellow,
                }}
                onPress={async () => {
                  // checkPermission(fnGetImageURL(update.image_url));
                  try {
                    const response = await addToImages(
                      update.image,
                      profileId
                    );
                    console.log(response)
                    if (response) {

                      const data = await response.json();
                      console.log(data)
                      dispatch(setPhotos([update.image]));
                      alert("Image saved to scrapbook")
                    }
                  } catch (error) {
                    errorAlert(
                      "Error",
                      "We’ve encountered a problem, try again later"
                    );
                  }
                }}
              >
                <Text
                  style={{
                    color: COLORS.appYellow,
                    fontFamily: FONTS.bwExtraBold,
                    fontSize: 15,
                  }}
                >
                  Add to scrapbook
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    );
  };
  const comparePostTime = (postDateString) => {
    const todayDate = moment(new Date());
    const postDate = moment(postDateString).toDate();
    const duration = moment.duration(todayDate.diff(postDate));
    const minutes = duration.asMinutes();
    const hours = duration.asHours();
    const days = duration.asDays();
    const years = duration.asYears();
    if (minutes < 0) {
      `a few seconds ago`;
    } else if (minutes < 60) {
      return `${parseInt(minutes)} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (hours < 24) {
      return `${parseInt(hours)} hour${hours === 1 ? "" : "s"} ago`;
    } else if (days < 365) {
      return `${parseInt(days)} day${days === 1 ? "" : "s"} ago`;
    } else {
      return `${parseInt(years)} year${years === 1 ? "" : "s"} ago`;
    }
  };

  const renderTeamSection = (teamMembers) => {
    // alert(JSON.stringify(updates))
    return renderHorizontalList(
      adminMembers,
      renderTeamFeedItem,
      120,
      teamWidth
    );
  };

  const renderSectionHeader = ({ item, section }) => {
    return section.title === SOCIETY_CARD_HEADER ? null : (
      // section.data.length === 0 ? null :
      <SafeAreaView
        style={{
          ...styles.feedSectionHeader,
          borderColor: "rgba(255, 255, 255, .1)",
        }}
      >
        <Text style={styles.feedSectionTitle}>{section.title === EVENT_HEADER ? 'Upcoming Events' : section.title}</Text>
      </SafeAreaView>
    );
  };

  const renderSectionFooter = ({ item, section }) => {
    if (section.title === UPDATE_HEADER && section.data[0] !== UPDATE_HEADER) {
      if (showMoreUpdateButton) {
        return (
          <TouchableHighlight
            style={{
              ...styles.feedSectionHeader,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: COLORS.white,
            }}
            onPress={() => {
              let reverseData = JSON.parse(JSON.stringify(updates)).reverse(); // Updates from backend are in order of oldest to newest, Needs to be reversed
              setDisplayUpdates(reverseData);
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
      } else {
        return (
          <View
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: COLORS.white,
            }}
          />
        );
      }
    } else {
      return null;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.purple
      }}
    >
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{
      flex: 1,
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}>
        <SectionList
          bounces={false}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          style={{ ...styles.sectionList }}
          sections={sectionData}
          keyExtractor={(item, index, section) => {
            return index;
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={renderSectionItem}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
        />

        <SafeAreaView style={{ position: "absolute", top: 0, left: 0 }}>
          <NavigationBarButton
            style={{
              marginLeft: 20,
              marginTop: 10,
            }}
            icon={icon.back_block}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainText: {
    color: COLORS.white,
    fontFamily: FONTS.bwBold,
    fontSize: 15,
  },
  minorText: {
    color: "#b0b0b0",
    fontFamily: FONTS.bwMedium,
    fontSize: 15,
  },
  sectionList: {
    /* backgroundColor: "#020d0d", */
  },
  feedSectionHeader: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "center",
    alignSelf: "center",
    width: windowWidth,
  },
  feedSectionTitle: {
    fontFamily: FONTS.bwBlack,
    fontSize: 21,
    color: COLORS.white,
    alignSelf: "center",
    textTransform: "capitalize",
  },
});

export default SocietyDetails;
