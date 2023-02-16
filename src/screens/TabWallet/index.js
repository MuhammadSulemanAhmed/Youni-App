import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList, Image, RefreshControl, StyleSheet, Text,
  TouchableHighlight, View, TouchableOpacity,
  Modal, PermissionsAndroid, Platform
} from 'react-native';
import { NavBarShadow } from '../../components/NavBarShadow';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../../helpers/fonts';
import { empty, placeholderImages, icon } from '../../helpers/assets';
import ScreenHeader from '../../components/ScreenHeaderWallet';
import { NavigationHeaderText } from '../../components/NavigationHeaderText';
import SafeAreaView from 'react-native-safe-area-view';
import { windowHeight, windowWidth } from '../../helpers/dimensions';
import { useDispatch, useSelector } from 'react-redux';
import { selectChatRooms, setChatrooms } from '../../slices/myChatRoomSlice';
import { fnGetChatRooms, fnGetImageURL, fnGetPopularEvents, fnGetUserEvents } from '../../helpers/api';
import { errorAlert } from '../../helpers/alerts';
import { selectProfile } from '../../slices/profileSlice';
import { selectProfileId } from "../../slices/profileSlice";
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS } from '../../helpers/colors';
import moment from 'moment'
import TicketFeedItem from "../../components/TicketsWalletFeed";
// import QRCodeScanner from 'react-native-qrcode-scanner';
import { QRScannerView } from 'react-native-qrcode-scanner-view';
import { RNCamera } from 'react-native-camera';
import { URLB } from './../../helpers/api'
import axios from "axios";
import QRCode from 'react-native-qrcode-generator';

const TabWallet = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const userId = useSelector(selectProfileId);
  // const chatroomsStore = useSelector(selectChatRooms);
  const [currentTab, setCurrentTab] = useState('next');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [showScanModal, setShowScanModal] = useState(false);
  const [hostCode, setHostCode] = useState();
  const [hostAccepted, setHostAccepted] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [ticketId, setTicketId] = useState();
  const [showTickets, setShowTickets] = useState(false)
  const [formData, setFormData] = useState("")
  const api = axios.create({
    /* baseURL: "http://localhost:5000/api", // DEV */
    baseURL: URLB, // PRODUCTION
  });
  async function HandleCheckEventID(data) {
    return await api.patch("/ticketauth/authenticateticket", data);
  }
  const onSuccess = e => {
    // console.log("--------->", e)
    // return
    try {
      let da = JSON?.parse(e.data)
      let data = {
        "id": da?.id,
        "user_id": da?.user_id,
        "event_id": da?.event_id
      };
      console.log("hiashdiuasgd===>", data)
      // return
      fetch(URLB + `/users/qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
        .then(async (res) => {
          let da = await res.json()
          console.log(da)
          alert(da.message)
          setShowScanModal(false)
          // navigation.goBack()
        })
        .catch((err) => {
          alert(JSON.stringify(err))
        })
    } catch (error) {
      console.log(error)
    }

    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );
  };
  const dispatch = useDispatch();

  useEffect(() => {
    fetchFeedData()
    const willFocusSubscription = navigation.addListener(
      'focus',
      () => {
        fetchFeedData()
      }
    );
    // fetchFeedData()
  }, []);

  const fetchFeedData = () => {
    let startDate = new Date();
    let endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 100);
    fnGetUserEvents(userId, 100, 0, startDate, endDate)
      .then(async (response) => {
        console.log("asasasa", response.data.data)
        const data = response.data?.data || [];
        setUpcomingEvents(data);
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again latera");
      })

  };

  const renderUpcomingEventItem = (item, index) => {

    let startTime = moment(item.end_at).format('DD-MM-YYYY HH:mm A')
    let currentTime = moment(new Date).format('DD-MM-YYYY HH:mm A')

    console.log(item.title)
    if (currentTab === "next") {
      if (new Date(item.end_at) > new Date()) {
        console.log(item)
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
            showBottom={true}
            onPress={() => {
              // console.log("asdasdasdada",item)
              setFormData(item)
              setShowTickets(true)
            }}
            onPressDetail={() => {
              let startDate = new Date()
              let endDate = new Date()
              //   console.log(item)
              // return
              fnGetPopularEvents(100, 0, startDate, endDate, null, null)
                .then(async (res) => {
                  let dated = await res.json()
                  let data = dated.data || []
                  const filtered = data.filter((_item) => _item.title === item.title)
                  console.log(filtered[0].id)
                  navigation.navigate("EventStack", {
                    screen: "EventDetails",
                    params: { eventId: filtered[0].id },
                  });
                })

            }}
          />
        );
      } else {
        return null
      }
    } else {
      if (new Date(item.end_at) < new Date()) {
        console.log(item)
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
            onPressDetail={() => {
              let startDate = new Date()
              let endDate = new Date()
              fnGetPopularEvents(100, 0, startDate, endDate, null, null)
                .then(async (res) => {
                  let dated = await res.json()
                  let data = dated.data || []
                  const filtered = data.filter((_item) => _item.title === item.title)
                  console.log(filtered[0].id)
                  navigation.navigate("EventStack", {
                    screen: "EventDetails",
                    params: { eventId: filtered[0].id },
                  });
                })

            }}
            onPress={() => {
              setFormData(item)
              setShowTickets(true)
            }}
            showBottom={false}
          />
        );
      } else {
        return null
      }
    }
  };

  return (
    <LinearGradient
      colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      locations={[0, 0.8, 1]}
      style={{ width: '100%', height: '100%' }}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <ScreenHeader
          style={{ borderColor: 'rgba(255,255,255, 0.1)' }}
          centerView={<NavigationHeaderText text="" />}
          showDivider={false}
          rightButton={() => {
            return (<View
              style={{
                flexDirection: 'row',
              }}
            >
              <TouchableOpacity
                style={{
                  // marginRight: 15
                }}
                onPress={async () => {
                  if (Platform.OS === 'android') {
                    try {
                      const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                          title: "Allow app to use camera",
                          message:
                            "Allow app to use camera to scan QR code.",
                          buttonNeutral: "Ask Me Later",
                          buttonNegative: "Cancel",
                          buttonPositive: "OK"
                        }
                      );
                      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        setShowScanModal(true)
                        console.log("You can use the camera");
                      } else {
                        alert("Camera permission denied")
                        console.log("Camera permission denied");
                      }
                    } catch (err) {
                      console.warn(err);
                    }
                  } else {
                    setShowScanModal(true)
                  }

                }}
              >
                <Image
                  source={icon.scan}
                  style={{
                    height: 30,
                    width: 35,
                    tintColor: COLORS.white,
                    resizeMode: 'contain'
                    // backgroundColor: 'red'
                  }}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity>
                <Image
                  source={icon.search}
                  style={{
                    height: 30,
                    width: 35,
                    tintColor: COLORS.white, resizeMode: 'contain'
                    // backgroundColor: 'red'
                  }}
                />
              </TouchableOpacity> */}
            </View>)


          }}
        />
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: windowWidth * 0.04
          }}
        >
          <Text
            style={styles.headerText}
          >Wallet</Text>
          <View
            style={styles.rowTab}
          >
            <TouchableOpacity
              style={styles.tab}
              onPress={() => {
                setCurrentTab("next")
              }}
            >
              <Text
                style={[styles.tabText, { color: currentTab === "next" ? "white" : "#BDBDBD" }]}
              >Next</Text>
              <View style={[styles.tabLine, { height: currentTab === "next" ? 4 : 0 }]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => {
                setCurrentTab("previous")
              }}
            >
              <Text
                style={[styles.tabText, { color: currentTab === "previous" ? "white" : "#BDBDBD" }]}
              >Previous</Text>
              <View style={[styles.tabLine, { height: currentTab === "previous" ? 4 : 0 }]} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={upcomingEvents}
            renderItem={({ item }, index) => renderUpcomingEventItem(item, index)}
            style={{
              flex: 1,
              marginTop: 10
            }}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    height: 200
                  }}
                />
              )
            }}
          />
        </ScrollView>
      </SafeAreaView>
      <Modal
        transparent
        visible={showScanModal}
      >
        {/* <View
          style={{
            flex: 1,
            backgroundColor: 'black',
            paddingTop: 100,
            paddingHorizontal: windowWidth * 0.04
          }}
        > */}
        < QRScannerView
          onScanResult={onSuccess}
          cornerStyle={{
            borderColor: COLORS.purple
          }}
          isShowCorner={true}
          isShowScanBar={true}

          renderHeaderView={() => {
            return (
              <SafeAreaView>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: 'black',
                    marginTop: 10,
                    height: 50,
                    alignItems: "center",
                    paddingHorizontal: 20
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowScanModal(false)
                    }}
                  >
                    <Image
                      source={icon.close}
                      style={{
                        tintColor: 'white',
                        height: 25,
                        width: 25
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: FONTS.bwBold,
                      marginLeft: -25
                    }}
                  >Scan QR</Text>
                  <View />
                </View>
              </SafeAreaView>
            )
          }}
          renderFooterView={() => {
            return null
          }}
          hintText={''}
          scanBarAnimateReverse={false} />


        {/* </View> */}
      </Modal>
      <Modal
        transparent
        visible={showTickets}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(29, 30, 41, 0.6)',
            alignItems: 'flex-end',
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              bottom: -windowHeight / 8,
              padding: 10,
              backgroundColor: '#1D1E29',
              width: windowWidth,
              borderTopEndRadius: 10,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              paddingBottom: 50,
              padding: 15,
              height: windowHeight
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <View />
              <Text
                style={{
                  fontSize: 16,
                  color: 'white',
                  fontFamily: FONTS.bwBlack,
                  marginLeft: 20
                }}
              >Tickets</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowTickets(false)
                }}
              >
                <Image
                  source={icon.close}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: 'white'
                  }}
                />
              </TouchableOpacity>

            </View>
            <ScrollView
              style={{
                marginTop: 10
                // paddingBottom:100

              }}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  width: windowWidth * 0.9,
                  // padding: 20,
                  marginTop: 20,
                  borderRadius: 15,
                  paddingVertical: 20,
                  marginBottom: 150
                }}
              >
                <View
                  style={{
                    alignSelf: 'center'
                  }}
                >
                  <QRCode
                    value={JSON.stringify({
                      "id": formData?.id ? formData?.id : 1,
                      "user_id": formData?.user_id ? formData?.user_id : 1,
                      "event_id": formData?.scheduled_event_id ? formData?.scheduled_event_id : 1
                    })}
                    size={200}
                    bgColor='black'
                    fgColor='white' />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    // width: windowWidth,
                    // backgroundColor:'yellow',
                    marginLeft: -15,
                    justifyContent: 'space-between',
                    marginRight: -15,
                    marginVertical: 25
                  }}
                >
                  <View
                    style={{
                      // height:1,
                      // backgroundColor:'red',
                      //  flex:1,
                      position: 'absolute',
                      width: windowWidth * 0.92,
                      marginTop: 5,
                      // borderWidth: 1,
                      // borderStyle: 'dashed',
                      // borderColor: 'red',
                      // borderRadius: 1,
                      // borderTopColor: 'white',


                    }}
                  >
                    <Text ellipsizeMode="clip" numberOfLines={1} style={{ color: "#F0F0F0" }}>
                      - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                      - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                      - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                      - - - - - - - - - - - - - - - - -
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      backgroundColor: '#1D1E29',
                      borderRadius: 30
                    }}
                  >
                  </View>
                  <View
                    style={{
                      backgroundColor: "#F0F0F0",
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      paddingVertical: 5
                      // justifyContent:'center'
                    }}
                  >
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 16,
                        fontFamily: FONTS.bwMedium
                      }}
                    >Ticket</Text>
                  </View>
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      backgroundColor: "#1D1E29",
                      borderRadius: 30
                    }}
                  >
                  </View>
                </View>
                <View
                  style={{
                    marginHorizontal: 20
                  }}
                >
                  <View>
                    <Text
                      style={styles.greyText}
                    >Name</Text>
                    <Text
                      style={styles.blaclText}
                    >{profile.first_name + " " + profile.last_name}</Text>
                  </View>
                  <View

                  >
                    <Text
                      style={styles.greyText}
                    >Event</Text>
                    <Text
                      style={styles.blaclText}
                    >{formData?.title}</Text>
                  </View>
                  <View

                  >
                    <Text
                      style={styles.greyText}
                    >Date</Text>
                    <Text
                      style={styles.blaclText2}
                    >{moment(formData.start_at).format("ddd, DD MMM . hh:mm - ")}{moment(formData.end_at).format("hh:mm")}</Text>
                  </View>
                  <View

                  >
                    <Text
                      style={styles.greyText}
                    >Place</Text>
                    <Text
                      style={styles.blaclText2}
                    >  - </Text>
                  </View>
                  <View

                  >
                    <Text
                      style={styles.greyText}
                    >Address</Text>
                    <Text
                      style={styles.blaclText2}
                    >  - </Text>
                  </View>
                  <View

                  >
                    <Text
                      style={styles.greyText}
                    >Ticket/Seat</Text>
                    <Text
                      style={styles.blaclText2}
                    >{formData.quantity}</Text>
                  </View>
                  <View

                  >
                    <Text
                      style={styles.greyText}
                    >Cost</Text>
                    <Text
                      style={styles.blaclText2}
                    > -</Text>
                  </View>
                </View>

              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};
export default TabWallet;
const styles = StyleSheet.create({
  debugBox: {
    borderWidth: 1,
    borderColor: 'red',
  },
  list: {
    flex: 1,
    marginBottom: 40
  },
  headerText: {
    color: "white",
    fontSize: 34,
    fontFamily: FONTS.bwMedium,
    marginTop: 10
  },
  rowTab: {
    flexDirection: 'row'
  },
  tab: {
    marginTop: 20,
    marginRight: 25
  },
  tabText: {
    color: "#BDBDBD",
    fontSize: 20,
    fontFamily: FONTS.bwMedium,
  },
  tabLine: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.purple,
    borderRadius: 10,
    marginTop: 3
  },
  greyText: {
    fontSize: 12,
    color: COLORS.disableText,
    fontFamily: FONTS.bwBold,
    marginTop: 15
  },
  blaclText: {
    fontSize: 20,
    color: 'black',
    fontFamily: FONTS.bwBlack
  },
  blaclText2: {
    fontSize: 20,
    color: 'black',
    fontFamily: FONTS.bwMedium
  },

});
