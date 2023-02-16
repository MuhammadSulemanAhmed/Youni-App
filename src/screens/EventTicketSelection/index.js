import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,

} from "react-native";

import { COLORS } from "../../helpers/colors";
import { FONTS } from "../../helpers/fonts";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaView from "react-native-safe-area-view";
import { icon } from "../../helpers/assets";
import InputBar from "../../components/SignupInput";
import {
  eventTicketBottomBarHeight,
  windowWidth,
  windowHeight
} from "../../helpers/dimensions";
import ScreenHeader from "../../components/ScreenHeader";
import NavigationBarButton from "../../components/NavigationBarButton";
import { NavigationHeaderText } from "../../components/NavigationHeaderText";
import moment from "moment";
import {
  BASEURL,
  fnGetEventAvailableTickets,
  fnTicketPurchase,
  fnVerifyPromoCode,
  fnVerifySecretCode,
  URLB,
} from "../../helpers/api";
import { useSelector } from "react-redux";
import { selectFirstName, selectLastName, selectProfile } from "../../slices/profileSlice";


const EventTicketSelection = ({ route, navigation }) => {
  const firstName = useSelector(selectFirstName);
  const lastName = useSelector(selectLastName);
  const eventDetails = route.params.event;
  const [staticTicketPrices, setStaticTicketPrices] = useState([]);
  const [ticketsPurchase, setTicketPurchase] = useState([]);
  const [total, setTotal] = useState(0);
  const [Basetotal, setBaseTotal] = useState(0);
  const [ticketsAvailable, setticketsAvailable] = useState(false);
  const [oneClass, setOneClass] = useState("");
  const [showPromoCodeView, setShowPromoCodeView] = useState(false);
  const [showSecretCodeView, setShowSecretCodeView] = useState(false);
  const [promoCodeApplied, setPromocodeApplied] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [promoCodeRes, setPromoCodeRes] = useState("");
  const [privateCodeRequired, setPrivateCodeRequired] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // alert('as')
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // alert('aass')
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const profile = useSelector(selectProfile);
  useEffect(() => {
    // console.log(eventDetails)
    fnGetEventAvailableTickets(eventDetails.event_id)
      .then((response) => {
        let data = response.data.data || [];
        setStaticTicketPrices(data);
        console.log("======", data)
        let purchase = [];
        data.map((item, index) => [
          purchase.push({
            ticket_type_id: item.id,
            quantity: 0,
            price: item.ticket_price,
            // base_price:item.ticket_price
          }),
        ]);
        if (purchase.length > 0) {
          if (purchase[0].price > 0) {
            setticketsAvailable(true)
          }
        }
        // console.log("======",purchase)
        setTicketPurchase(purchase);
      })
      .catch((error) => { });
  }, [eventDetails]);

  useEffect(() => {
    const reduce = ticketsPurchase.reduce((prevValue, currentValue) => {
      let grand = getTotalPrice(currentValue.price)
      return prevValue + currentValue.quantity * grand.grandTotal;
    }, 0);
    const reduce1 = ticketsPurchase.reduce((prevValue, currentValue) => {
      return prevValue + currentValue.quantity * currentValue.price;
    }, 0);
    setTotal(reduce.toFixed(2));
    setBaseTotal(reduce1)
  }, [ticketsPurchase]);
  const getTotalPrice = (total) => {

    if (total === 0) {
      return { grandTotal: 0, fee: 0 }
    } else if (total < 10) {
      let percent = total * 0.015
      let grandTotal
      if (promoCodeApplied) {
        let originalPrice = total
        let formula = (total / 100) * parseInt(promoCodeRes?.data?.discount)
        let discountPrice = originalPrice - formula
        percent = discountPrice * 0.015
        grandTotal = (discountPrice + 0.49 + percent).toFixed(2)

      } else {
        grandTotal = (total + 0.49 + percent).toFixed(2)
      }
      return { grandTotal: grandTotal, fee: 0.49 + percent }

    } else if (total < 20) {
      let percent = total * 0.02
      let grandTotal
      if (promoCodeApplied) {
        let originalPrice = total
        let formula = (total / 100) * parseInt(promoCodeRes?.data?.discount)
        let discountPrice = originalPrice - formula
        percent = discountPrice * 0.02
        grandTotal = (discountPrice + 0.49 + percent).toFixed(2)
      } else {
        grandTotal = (total + 0.49 + percent).toFixed(2)
      }

      // let grandTotal = (total + 0.49 + percent).toFixed(2)
      return { grandTotal: grandTotal, fee: 0.49 + percent }
      // return total
    } else if (total >= 20) {
      let percent = total * 0.025
      let grandTotal
      if (promoCodeApplied) {
        let originalPrice = total
        let formula = (total / 100) * parseInt(promoCodeRes?.data?.discount)
        let discountPrice = originalPrice - formula
        percent = discountPrice * 0.025
        grandTotal = (discountPrice + 0.49 + percent).toFixed(2)
      } else {
        grandTotal = (total + 0.49 + percent).toFixed(2)
      }
      // console.log(total)
      // let percent = total * 0.025
      // let grandTotal = (total + 0.49 + percent).toFixed(2)
      return { grandTotal: grandTotal, fee: 0.49 + percent }
    }
  }
  const renderTicketPriceItem = ({ item, index }) => {
    let grand = getTotalPrice(item.ticket_price)
    return (
      <View
        style={{
          // backgroundColor: "rgba(0,0,0,0.3)",
          height: 100,
          width: windowWidth,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: '70%',
            // backgroundColor:'red'
          }}
        >
          <Text
            style={{ color: "white", fontFamily: FONTS.bwBold, fontSize: 21, width: '100%' }}
          >
            {item.name}
          </Text>
          {item.number_of_tickets === item.ticket_qty || item.number_of_tickets === parseInt(item.ticket_qty) ?
            <Text
              style={{
                color: 'red',
                fontFamily: FONTS.bwBold,
                fontSize: 14,
              }}
            >Sold out</Text>
            :
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.bwBold,
                  fontSize: 13,
                }}
              >{`\u00A3 ${grand?.grandTotal}`}</Text>
              <Text
                style={{
                  color: "#b0b0b0",
                  fontFamily: FONTS.bwRegular,
                  fontSize: 13,
                  marginLeft: 5,
                }}
                onPress={() => {
                  console.log(item.number_of_tickets === parseInt(item.ticket_qty))
                }}
              >
                {`inc. \u00A3${grand.fee?.toFixed(2)} fee`}
              </Text>
            </View>


          }
          {item?.secret_code ?
            <Text
              style={{
                color: '#E5C1FB',
                fontFamily: FONTS.bwBold,
                fontSize: 13,
                marginTop: 3
              }}
            >Private code required</Text>
            :
            null
          }
          {/* <Text
            style={{
              color: "#b0b0b0",
              fontFamily: FONTS.bwRegularItalic,
              fontSize: 13,
            }}
          >
            {`${item.number_of_tickets} tickets remaining`}
          </Text> */}
        </View>
        {item.number_of_tickets === item.ticket_qty || item.number_of_tickets === parseInt(item.ticket_qty) ?

          null
          :
          < View
            style={{
              flexDirection: 'row',
              alignItems: "center",

            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: ticketsPurchase[index]?.quantity > 0 ? COLORS.purple : COLORS.disableGrey,
                height: 29,
                width: 29,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => {
                let temp = ticketsPurchase[index] && ticketsPurchase[index].quantity
                  ? `${ticketsPurchase[index].quantity}`
                  : 0
                let minus = temp === 0 ? 0 : temp - 1
                let value = minus === 0 ? "" : minus

                if (value === "") {
                  let quantity = parseInt(value) || 0;
                  if (quantity > item.number_of_tickets) {
                    quantity = parseInt(item.number_of_tickets);
                  }
                  let newData = [...ticketsPurchase];
                  newData[index].quantity = quantity;
                  console.log(newData)
                  setOneClass("")
                  setTicketPurchase(newData);
                  //////
                  if (item?.secret_code) {
                    setPrivateCodeRequired(false)
                  }
                  //////
                  return
                }
                if (oneClass === ticketsPurchase[index].ticket_type_id || oneClass === "") {
                  let quantity = parseInt(value) || 0;
                  if (quantity > item.number_of_tickets) {
                    quantity = parseInt(item.number_of_tickets);
                  }
                  let newData = [...ticketsPurchase];
                  newData[index].quantity = quantity;
                  console.log(newData)
                  setOneClass(newData[index].ticket_type_id)
                  setTicketPurchase(newData);
                } else {
                  alert("Please add tickets for only one class!")
                }
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontWeight: 'bold',
                  marginTop: -15
                }}
              >_</Text>
            </TouchableOpacity>
            <Text
              style={{ color: "white", fontFamily: FONTS.bwBold, fontSize: 24, marginHorizontal: 10 }}
            >{ticketsPurchase[index] && ticketsPurchase[index].quantity
              ? `${ticketsPurchase[index].quantity}`
              : 0}</Text>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.purple,
                height: 29,
                width: 29,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => {
                console.log("asokcmokwdmscomw==", item)
                let temp = ticketsPurchase[index] && ticketsPurchase[index].quantity
                  ? `${ticketsPurchase[index].quantity}`
                  : 0
                let minus = parseInt(temp) + 1
                let value = minus
                let v2 = value - 1
                console.log(item.number_of_tickets_per_user, value)
                if (item.number_of_tickets_per_user === v2 || parseInt(item.number_of_tickets_per_user) === v2) {
                  alert("You’ve can’t buy anymore tickets")
                } else {
                  if (value === "") {
                    let quantity = parseInt(value) || 0;
                    if (quantity > item.number_of_tickets) {
                      quantity = parseInt(item.number_of_tickets);
                    }
                    let newData = [...ticketsPurchase];
                    newData[index].quantity = quantity;
                    console.log(newData)
                    setOneClass("")
                    setTicketPurchase(newData);
                    if (item?.secret_code) {
                      setPrivateCodeRequired(true)
                    }
                    return
                  }
                  if (oneClass === ticketsPurchase[index].ticket_type_id || oneClass === "") {
                    let quantity = parseInt(value) || 0;
                    if (quantity > item.number_of_tickets) {
                      quantity = parseInt(item.number_of_tickets);
                    }
                    let newData = [...ticketsPurchase];
                    newData[index].quantity = quantity;
                    console.log(newData)
                    setOneClass(newData[index].ticket_type_id)
                    setTicketPurchase(newData);
                    if (item?.secret_code) {
                      setPrivateCodeRequired(true)
                    }
                  } else {
                    alert("Please add tickets for only one class!")
                  }
                }
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontWeight: 'bold',
                  // marginTop: -15
                }}
              >+</Text>
            </TouchableOpacity>
          </View>

        }
        {/* <View
          style={{
            backgroundColor: "#2e4645",
            height: 50,
            width: 120,
            borderRadius: 10,
            justifyContent: "center",
          }}
        >
          <TextInput
            style={{
              width: "100%",
              height: "100%",
              color: "white",
              fontFamily: FONTS.bwBlack,
              fontSize: 18,
              textAlign: "center",
            }}
            placeholder={"0"}
            placeholderTextColor={"rgba(255,255,255,0.4)"}
            keyboardType={"number-pad"}
            value={
              ticketsPurchase[index] && ticketsPurchase[index].quantity
                ? `${ticketsPurchase[index].quantity}`
                : ""
            }
            onChangeText={(value) => {
              console.log("=>", value)
              if (value === "") {
                let quantity = parseInt(value) || 0;
                if (quantity > item.number_of_tickets) {
                  quantity = parseInt(item.number_of_tickets);
                }
                let newData = [...ticketsPurchase];
                newData[index].quantity = quantity;
                console.log(newData)
                setOneClass("")
                setTicketPurchase(newData);
                return
              }
              if (oneClass === ticketsPurchase[index].ticket_type_id || oneClass === "") {
                let quantity = parseInt(value) || 0;
                if (quantity > item.number_of_tickets) {
                  quantity = parseInt(item.number_of_tickets);
                }
                let newData = [...ticketsPurchase];
                newData[index].quantity = quantity;
                console.log(newData)
                setOneClass(newData[index].ticket_type_id)
                setTicketPurchase(newData);
              } else {
                alert("Please add tickets for only one class!")
              }
            }}
          />
          <Image
            style={{
              position: "absolute",
              alignSelf: "center",
              right: 20,
              transform: [{ rotate: "90deg" }],
            }}
            source={icon.right_arrow}
          />
        </View> */}
      </View >
    );
  };

  const totalBar = () => {
    let quant = ticketsPurchase.reduce((prevValue, currentValue) => {
      return prevValue + currentValue.quantity;
    }, 0)
    return (
      <View style={{ position: "absolute", bottom: 40, width: "100%" }}>

        <SafeAreaView
          style={{
            // backgroundColor: COLORS.appGreen,
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
                width: 150,
                height: 50,
                borderRadius: 14,
                justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.bwBlack,
                  fontSize: 17,
                  textAlign: 'left'
                }}
              >{`\u00A3 ${total}`} {total > 0 ? "total" : ""}</Text>
              {quant > 0 ?
                <Text
                  style={{
                    color: '#8E8E8E',
                    fontFamily: FONTS.bwLight,
                    fontSize: 14,
                    textAlign: 'left'
                  }}
                >{quant} tickets selected</Text>
                :
                null
              }
            </View>
            <TouchableOpacity
              style={{
                marginTop: 20,
                width: 155,
                height: 70,
                borderWidth: 2,
                backgroundColor: quant > 0 ? COLORS.purple : COLORS.disableGrey,
                borderRadius: 14,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                if (privateCodeRequired) {
                  setShowSecretCodeView(true)
                } else {
                  onCheckOutPress()
                }
              }}
            >
              <Text
                style={{
                  color: quant > 0 ? COLORS.white : COLORS.disableText,
                  fontFamily: FONTS.bwBlack,
                  fontSize: 15,
                }}
              >
                CHECK OUT
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  const onCheckOutPress = () => {
    let scheduledEventId = eventDetails.id;

    // alert(JSON.stringify(ticketsAvailable))
    // console.log(promoCodeRes)
    // return
    // console.log(total)

    if (total === "0.00") {
      if (!ticketsAvailable) {
        if (ticketsPurchase.length > 0) {
          let quant = ticketsPurchase.reduce((prevValue, currentValue) => {
            return prevValue + currentValue.quantity;
          }, 0)
          if (quant === 0) {
            alert('Please select Ticket quantity!')
          } else {
            let data = {
              price: 0,
              quantity: ticketsPurchase[0].quantity,
              number_of_tickets: ticketsPurchase[0].quantity,
              "user_id": profile.id,
              "scheduled_event_id": scheduledEventId,
              "ticket_type_id": ticketsPurchase[0].ticket_type_id,
              "stripeTokenId": null,
              "base_price": 0
            }
            console.log(data)
            // return
            fetch(URLB + '/events/ticket', {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(data)
            })
              .then(async (res) => {
                let json = await res.json()
                console.log("asadddds", json)
                // alert(json.message)
                if (json.status === false || json.status === 0) {
                  alert(json.message)
                } else {
                  navigation.navigate("EventTicketSummary", {
                    formData: {
                      quantity: ticketsPurchase.reduce((prevValue, currentValue) => {
                        return prevValue + currentValue.quantity;
                      }, 0),
                      firstlast: firstName + lastName,
                      ticket_type_id: ticketsPurchase[0]?.ticket_type_id,
                      "user_id": profile.id,
                      "scheduled_event_id": eventDetails.id,
                      isFree: false,
                      promoCodeApplied: promoCodeRes === "" ? false : promoCodeRes
                    },

                  });
                }

              })
              .catch((err) => {
                console.log("asas", err)
              })
            return
            fnTicketPurchase(scheduledEventId, ticketsPurchase, data)
              .then((response) => {
                console.log(ticketsPurchase);
                console.log("response", response);
                var peopleAttending = 0;
                var ticket_type_id

                for (var i = 0; i < ticketsPurchase.length; i++) {
                  if (ticketsPurchase[i].quantity >= 1) {
                    switch (ticketsPurchase[i]["ticket_type_id"]) {
                      case 30:
                        // table of 2
                        peopleAttending += ticketsPurchase[i]["quantity"] * 2;
                        // ticket_type_id=ticketsPurchase[i]["ticket_type_id"]
                        break;
                      case 31:
                        // table of 4
                        peopleAttending += ticketsPurchase[i]["quantity"] * 4;
                        // ticket_type_id=ticketsPurchase[i]["ticket_type_id"]
                        break;
                      case 32:
                        // table of 5
                        peopleAttending += ticketsPurchase[i]["quantity"] * 5;
                        // ticket_type_id=ticketsPurchase[i]["ticket_type_id"]
                        break;
                      case 33:
                        // table of 6
                        peopleAttending += ticketsPurchase[i]["quantity"] * 6;
                        // ticket_type_id=ticketsPurchase[i]["ticket_type_id"]
                        break;
                    }
                  }
                }
              })
              .catch((error) => {
                console.log(error)
              });
            // navigation.navigate("EventTicketSummary", {
            //   formData: {
            //     quantity: ticketsPurchase.reduce((prevValue, currentValue) => {
            //       return prevValue + currentValue.quantity;
            //     }, 0),
            //     firstlast: firstName + lastName,
            //     ticket_type_id: ticketsPurchase[0]?.ticket_type_id,
            //     "user_id": profile.id,
            //     "scheduled_event_id": eventDetails.id,
            //     isFree: false
            //   },

            // });
          }

        } else {
          fnTicketPurchase(scheduledEventId, ticketsPurchase)
            .then((response) => {
              console.log(ticketsPurchase);
              console.log("response", response);
              var peopleAttending = 0;
              var ticket_type_id

              for (var i = 0; i < ticketsPurchase.length; i++) {
                if (ticketsPurchase[i].quantity >= 1) {
                  switch (ticketsPurchase[i]["ticket_type_id"]) {
                    case 30:
                      // table of 2
                      peopleAttending += ticketsPurchase[i]["quantity"] * 2;
                      // ticket_type_id=ticketsPurchase[i]["ticket_type_id"]
                      break;
                    case 31:
                      // table of 4
                      peopleAttending += ticketsPurchase[i]["quantity"] * 4;
                      // ticket_type_id=ticketsPurchase[i]["ticket_type_id"]
                      break;
                    case 32:
                      // table of 5
                      peopleAttending += ticketsPurchase[i]["quantity"] * 5;
                      // ticket_type_id=ticketsPurchase[i]["ticket_type_id"]
                      break;
                    case 33:
                      // table of 6
                      peopleAttending += ticketsPurchase[i]["quantity"] * 6;
                      // ticket_type_id=ticketsPurchase[i]["ticket_type_id"]
                      break;
                  }
                }
              }
            })
            .catch((error) => { });
          navigation.navigate("EventTicketSummary", {
            formData: {
              quantity: ticketsPurchase.reduce((prevValue, currentValue) => {
                return prevValue + currentValue.quantity;
              }, 0),
              firstlast: firstName + lastName,
              ticket_type_id: ticketsPurchase[0]?.ticket_type_id,
              "user_id": profile.id,
              "scheduled_event_id": eventDetails.id,
              isFree: true,
              promoCodeApplied: promoCodeRes === "" ? false : promoCodeRes
            },

          });
        }
      } else {
        let quant = ticketsPurchase.reduce((prevValue, currentValue) => {
          return prevValue + currentValue.quantity;
        }, 0)
        if (quant === 0) {
          alert('Please select Ticket quantity!')
        } else {
          let ticketID = ""
          ticketsPurchase.forEach((el) => {
            if (el.quantity > 0) {
              ticketID = el.ticket_type_id
            }
          })
          // alert(ticketID)
          navigation.navigate("EventTicketPurchase", {
            event: eventDetails,
            paymentInformation: total,
            ticketQuantity: quant,
            ticket_type_id: ticketID,
            base_price: Basetotal,
            promoCodeApplied: promoCodeRes === "" ? false : promoCodeRes
          });
        }
      }
    } else {
      let quant = ticketsPurchase.reduce((prevValue, currentValue) => {
        return prevValue + currentValue.quantity;
      }, 0)
      if (quant === 0) {
        alert('Please select Ticket quantity!')
      } else {
        let ticketID = ""
        ticketsPurchase.forEach((el) => {
          if (el.quantity > 0) {
            ticketID = el.ticket_type_id
          }
        })
        // alert(ticketID)
        navigation.navigate("EventTicketPurchase", {
          event: eventDetails,
          paymentInformation: total,
          ticketQuantity: quant,
          ticket_type_id: ticketID,
          base_price: Basetotal,
          promoCodeApplied: promoCodeRes === "" ? false : promoCodeRes
        });
      }
    };

  }
  const verifyPromoCode = () => {
    console.log(eventDetails.event_id)
    // return
    fnVerifyPromoCode(eventDetails.event_id, promoCode)
      .then(async (res) => {
        let json = await res.data
        if (res.status === 201) {
          console.log("ascasc ", json)
          alert(json?.message)
        } else {
          setPromocodeApplied(true)
          setPromoCodeRes(json)
          console.log(json)
        }

      })
  }
  const verifySecretCode = () => {
    console.log(eventDetails.event_id)
    // return
    fnVerifySecretCode(eventDetails.event_id, secretCode)
      .then(async (res) => {
        let json = await res.data
        console.log(json)
        if (json.is_valid) {
          setShowSecretCodeView(false)
          onCheckOutPress()
        }
        else {
          alert("Private code is in-valid, Please try again")
        }

      })
  }
  const secretCodeModal = () => {
    return (
      <Modal
        visible={showSecretCodeView}
        transparent
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss()
          }}
          style={{
            flex: 1,
            backgroundColor: 'rgba(29, 30, 41, 0.4)',
            alignItems: 'flex-end',
            justifyContent: 'flex-end'
          }}
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
                bottom: isKeyboardVisible ? -windowHeight / 3 : -windowHeight / 1.4,
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
                >Enter private code</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowSecretCodeView(false)
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
              <Text
                style={{
                  fontSize: 12,
                  color: 'white',
                  fontFamily: FONTS.bwRegular,
                  marginTop: 20,
                }}
              >Private code</Text>
              <View
                style={{
                  // marginTop: 20,
                  flexDirection: 'row'
                  // justifyContent: 'space-between'
                }}
              >

                <TextInput
                  style={{
                    backgroundColor: '#1D1E29',
                    height: 55,
                    borderRadius: 10,
                    marginTop: 10,
                    paddingHorizontal: 15,
                    fontFamily: FONTS.bwMedium,
                    borderWidth: 1,
                    borderColor: COLORS.purple,
                    color: 'white',
                    flex: 1
                  }}
                  placeholder={"Enter code"}
                  placeholderTextColor={COLORS.disableText}
                  value={secretCode}
                  onChangeText={(text) => { setSecretCode(text) }}

                />
              </View>
              <TouchableOpacity
                style={{
                  height: 50,
                  // width: windowWidth,
                  backgroundColor: COLORS.purple,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: COLORS.disableGrey,
                  borderRadius: 10,
                  marginTop: 20
                }}
                onPress={() => {
                  if (secretCode === "") {
                    alert("Please enter private code")
                  } else {
                    verifySecretCode()
                  }


                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: FONTS.bwBold
                  }}
                >Confirm</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>

      </Modal>
    )
  }
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
      <SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: "never" }}>
        <ScreenHeader
          leftButton={
            <NavigationBarButton
              icon={icon.backchevron}
              onPress={() => {
                navigation.goBack();
              }}
            />
          }
          centerView={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: 'white',
                  fontFamily: FONTS.bwBlack
                }}
              >Checkout</Text>
              {/* <NavigationHeaderText text={"Checkout"} />
               */}
            </View>
          }
          showDivider={false}
        />
        <View
          style={{
            // flexDirection: "row",
            // justifyContent: "center",
            // alignItems: "center",
            // width: windowWidth - 40,
            // marginTop: -15,
            marginHorizontal: 20,
            paddingBottom: 15,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: "rgba(255,255,255, 0.1)",
            backgroundColor: '#1D1E29',
            padding: 15,
            borderRadius: 10
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: 'white',
              fontFamily: FONTS.bwBlack
            }}
          >{eventDetails.title}</Text>
          {/* <Image style={{ tintColor: "white" }} source={icon.clock} /> */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10
            }}
          >
            <Text
              style={{
                ...styles.mainText,
                // marginLeft: 20,
                color: COLORS.disableText,
                fontFamily: FONTS.bwRegular
              }}
            >
              {moment(eventDetails.start_at).format("ddd, DD MMM yyyy")}
            </Text>

            <Text
              style={{
                ...styles.minorText,
                // marginLeft: 10,
                color: COLORS.disableText,
                fontFamily: FONTS.bwRegular
              }}
            >  .  {`${moment(eventDetails.start_at).format("h:mm a")} - ${moment(
              eventDetails.end_at
            ).format("h:mm a")}`}</Text>
          </View>

        </View>
        {promoCodeApplied ?
          <View
            style={{
              // flex:1,
              height: 40,
              backgroundColor: '#4E305F',
              marginHorizontal: 20,
              marginTop: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row'
            }}
          >
            <View
              style={{
                flexDirection: 'row'
              }}
            >
              <Image
                source={icon.confirm_tick}
                style={{
                  height: 20,
                  resizeMode: 'contain'
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: FONTS.bwMedium
                }}
              >Promo code applied</Text>
            </View>
            <TouchableOpacity
              style={{
                height: 30,
                width: 90,
                backgroundColor: COLORS.purple,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5
              }}
              onPress={() => {
                setPromocodeApplied(false)
                setShowPromoCodeView(true)
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: FONTS.bwBlack
                }}
              >Change</Text>
            </TouchableOpacity>
          </View>
          :
          <>
            {showPromoCodeView ?
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: 'white',
                    fontFamily: FONTS.bwRegular
                  }}
                >Promo code</Text>
                <TextInput
                  style={{
                    backgroundColor: '#1D1E29',
                    height: 55,
                    borderRadius: 10,
                    marginTop: 10,
                    paddingHorizontal: 15,
                    fontFamily: FONTS.bwMedium,
                    borderWidth: 1,
                    borderColor: COLORS.purple,
                    color: 'white'
                  }}
                  placeholder={"Enter code"}
                  placeholderTextColor={COLORS.disableText}
                  value={promoCode}
                  onChangeText={(text) => { setPromoCode(text) }}

                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    justifyContent: 'space-between'
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: windowWidth / 2.3,
                      height: 45,
                      backgroundColor: COLORS.purple,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      if (promoCode === "") {
                        alert("Please enter promo code")
                      } else {
                        verifyPromoCode()
                      }
                      // setPromocodeApplied(true)
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                        fontFamily: FONTS.bwBold
                      }}
                    >Apply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: windowWidth / 2.3,
                      height: 45,
                      backgroundColor: '#321F3D',
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      setShowPromoCodeView(false)
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                        fontFamily: FONTS.bwBold
                      }}
                    >Cancel</Text>
                  </TouchableOpacity>

                </View>
              </View>
              :
              <Text
                style={{
                  color: COLORS.purple,
                  marginLeft: 20,
                  marginTop: 20,
                  fontSize: 15,
                  fontFamily: FONTS.bwBold
                }}
                onPress={() => {
                  setShowPromoCodeView(true)
                }}
              >Enter promo code</Text>
            }
          </>
        }
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: eventTicketBottomBarHeight + 20,
          }}
          style={{ flex: 1 }}
          data={staticTicketPrices}
          renderItem={renderTicketPriceItem}
          keyExtractor={(item, index) => item.id.toString()}
        />
      </SafeAreaView>
      {totalBar()}
      {secretCodeModal()}
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
});
export default EventTicketSelection;