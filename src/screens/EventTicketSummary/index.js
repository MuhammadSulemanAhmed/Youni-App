import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, Modal, TouchableOpacity, View, ScrollView } from "react-native";
import { COLORS } from "../../helpers/colors";
import { FONTS } from "../../helpers/fonts";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaView from "react-native-safe-area-view";
import { empty, icon } from "../../helpers/assets";
import { contentWidth, windowHeight, windowWidth } from "../../helpers/dimensions";
import HollowButton from "../../components/HollowButton";
import axios from "axios";
import { selectEmail, selectProfileId } from "../../slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectProfile } from "../../slices/profileSlice";
import QRCode from 'react-native-qrcode-generator';
import moment from "moment";
import { fnGetPopularEvents, fnGetUserEvents } from "../../helpers/api";
import { FlatList } from "react-native-gesture-handler";
let a = 0
const EventTicketSummary = ({ route, navigation }) => {
  // const dispatch = useDispatch();
  const [showTickets, setShowTickets] = useState(false)
  const [ids, setIds] = useState(null)
  const [idq, setIdq] = useState(0)
  const [filtered, setFIltered] = useState([])
  const { formData, } = route.params;
  const profile = useSelector(selectProfile);
  console.log("===>", formData.quantity)
  // const userEmail = useSelector(selectEmail);
  const onSummaryComplete = () => {
    navigation.navigate('EventDetails')
    // HandleEventIDStore({
    //   firstlast: formData.firstlast,
    //   email: userEmail,
    //   ticketid: ticketid,
    //   quantity: formData.quantity,
    // });
  };
  useEffect(() => {
    let startDate = new Date()
    let endDate = new Date()
    fnGetUserEvents(profile.id, 100, 0, startDate, endDate)
      .then(async (response) => {

        const data = response.data?.data || [];
        const filtered = data.filter((_item) => _item.title === formData.eventDetails.title)

        let temp2 = []
        // console.log("asasasa", temp)
        filtered.forEach(element => {
          temp2.push(element.id)

        });
        // setFIltered(filtered)
        let temp = temp2.sort((a, b) => {
          if (a < b) {
            return 1
          } else {
            return -1
          }
        })
        console.log("asasasa", temp)
        const slicedArray = temp.slice(0, formData.quantity);
        console.log("asasasa", slicedArray)
        setIds(slicedArray)
        let temp3 = []
        filtered.forEach((a) => {
          if (slicedArray.indexOf(a.id) > -1) {
            temp3.push(a)
          }
        })
        setFIltered(temp3)
        a = 0
        // setUpcomingEvents(data);
      })
      .catch((error) => {
        // errorAlert("Error", "We’ve encountered a problem, try again latera");
      })
  }, [])
  // const api = axios.create({
  //   /* baseURL: "http://localhost:5000/api", // DEV */
  //   baseURL: "http://18.134.155.19:3000/", // PRODUCTION
  // });

  // async function HandleEventIDStore(data) {
  //   return await api.post("/ticketauth/storeticketinauth", data);
  // }

  // function makeid(length) {
  //   var result = [];
  //   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  //   var charactersLength = characters.length;
  //   for (var i = 0; i < length; i++) {
  //     result.push(
  //       characters.charAt(Math.floor(Math.random() * charactersLength))
  //     );
  //   }
  //   return result.join("");
  // }

  // const ticketid = makeid(6);

  return (
    <LinearGradient
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
      colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      locations={[0, 0.8, 1]}
    >
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        forceInset={{ bottom: "never" }}
      >
        <Image
          source={icon.ticket_compl}
          style={{
            height: windowHeight * 0.3,
            width: windowWidth * 0.5,
            resizeMode: 'contain'
          }}
        />
        <Text
          style={{
            marginTop: 30,
            color: "white",
            fontFamily: FONTS.bwBold,
            fontSize: 21,
            textAlign: "center",
          }}
        >
          {formData.isFree ? "Congratulations!" : "Congratulations!"}
        </Text>
        <Text
          style={{
            marginTop: 5,
            color: COLORS.disableText,
            fontFamily: FONTS.bwBold,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {formData.isFree ? "Event added, you're now going!" : "Event added, you're now going!"}
        </Text>
        {/* {formData.isFree ?
        null
        :
          <>
            <QRCode
              value={{
                "id": formData?.ticket_type_id ? formData?.ticket_type_id : 1,
                "user_id": formData?.user_id ? formData?.user_id : 1,
                "event_id": formData?.scheduled_event_id ? formData?.scheduled_event_id : 1
              }}
              size={200}
              bgColor='black'
              fgColor='white' />
            <Text
              style={{
                marginTop: 30,
                color: "red",
                fontFamily: FONTS.bwBold,
                fontSize: 13,
                textAlign: "center",
              }}
            >
              {"This QR Code is only valid for one time scan"}
            </Text>
          </>
        } */}
      </SafeAreaView>
      <SafeAreaView>
        <TouchableOpacity
          style={{
            height: 60,
            backgroundColor: COLORS.purple,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            width: windowWidth * 0.9
          }}
          onPress={() => {
            setShowTickets(true)
          }}
        >
          <Text
            style={{
              fontSize: 19,
              color: 'white',
              fontFamily: FONTS.bwBold
            }}
          >View ticket</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 19,
            color: 'white',
            fontFamily: FONTS.bwBold,
            textAlign: 'center',
            marginVertical: 20
          }}
          onPress={() => {
            onSummaryComplete()
          }}
        >Discover more events</Text>
        {/* <HollowButton
          style={{ width: contentWidth, marginTop: 0 }}
          text={"CONTINUE"}
          onPress={onSummaryComplete}
        /> */}
      </SafeAreaView>
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
            <FlatList
              data={filtered}
              horizontal
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={{
                      width: 10
                    }}
                  />
                )
              }}
              renderItem={({ item, index }) => {

                if (ids.indexOf(item.id) > -1) {
                a=index+1
                  return (
                    <ScrollView
                      style={{
                        marginTop: 10,
                        // marginLeft:20
                        // paddingBottom:100

                      }}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
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
                        <Text
                          style={{
                            fontSize: 16,
                            textAlign: 'center',
                            marginBottom: 15
                          }}
                        >{a}/{formData.quantity}</Text>
                        <View
                          style={{
                            alignSelf: 'center'
                          }}
                        >

                          <QRCode
                            value={JSON.stringify({
                              // "id": formData?.ticket_type_id ? formData?.ticket_type_id : 1,
                              "id": item.id,
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
                            >{formData?.eventDetails?.title}</Text>
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
                            >{formData?.eventDetails?.description}</Text>
                          </View>
                          <View

                          >
                            <Text
                              style={styles.greyText}
                            >Address</Text>
                            <Text
                              style={styles.blaclText2}
                            >{formData?.eventDetails?.location}</Text>
                          </View>
                          <View

                          >
                            <Text
                              style={styles.greyText}
                            >Ticket/Seat</Text>
                            <Text
                              style={styles.blaclText2}
                            >1</Text>
                          </View>
                          <View

                          >
                            <Text
                              style={styles.greyText}
                            >Cost</Text>
                            <Text
                              style={styles.blaclText2}
                            >{formData?.price ? `\n\u00A3 ${formData?.price}` : " - "}</Text>
                          </View>
                        </View>

                      </View>
                    </ScrollView>
                  )
                } else {
                  // a = a + 1
                  return null
                }
              }}
            ></FlatList>

          </View>
        </View>
      </Modal>
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
  mainText: {
    color: COLORS.white,
    fontFamily: FONTS.bwBold,
    fontSize: 14,
  },
  minorText: {
    color: "#b0b0b0",
    fontFamily: FONTS.bwMedium,
    fontSize: 14,
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
export default EventTicketSummary;
