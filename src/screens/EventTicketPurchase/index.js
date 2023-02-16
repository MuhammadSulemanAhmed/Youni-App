import React, { useState, useEffect } from "react";
import {
  Image, StyleSheet, Text, View, TouchableOpacity, Modal,
  TouchableWithoutFeedback, Keyboard, Platform, ActivityIndicator, KeyboardAvoidingView
} from "react-native";
import { COLORS } from "../../helpers/colors";
import { FONTS } from "../../helpers/fonts";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaView from "react-native-safe-area-view";
import { icon } from "../../helpers/assets";
import { windowHeight, windowWidth } from "../../helpers/dimensions";
import ScreenHeader from "../../components/ScreenHeader";
import NavigationBarButton from "../../components/NavigationBarButton";
import { NavigationHeaderText } from "../../components/NavigationHeaderText";
import moment from "moment";
import { PaymentView } from "../../components/PaymentView";
import { selectProfile } from "../../slices/profileSlice";
import { useSelector } from "react-redux";
import { STRIPE_LIVE_API_KEY, STRIPE_TEST_API_KEY } from "../../helpers/tempData";
import { URLB } from './../../helpers/api'
import { initStripe, CardField, useStripe, StripeProvider, createPaymentMethod, useConfirmPayment, useApplePay } from '@stripe/stripe-react-native';

// const STRIPE_PK = STRIPE_TEST_API_KEY;
const STRIPE_PK = STRIPE_LIVE_API_KEY;
const publishableKey = "pk_live_51Hc7A3CtcrhGM8ReraxljL0kM8rqQHzKYtUhrG0Vlt3MWl426TRHbmgvWxMzqU25CBu0E7EIQsnRH0pBbszdkc5200tmwpSees";

const EventTicketPurchase = ({ route, navigation }) => {
  const eventDetails = route.params.event;
  const { confirmPayment } = useConfirmPayment();
  const { presentApplePay, isApplePaySupported, confirmApplePayPayment } = useApplePay();
  const { paymentInformation, ticketQuantity, ticket_type_id, base_price, quantity, formData } = route.params;
  const profile = useSelector(selectProfile);
  console.log("quantiy=>", ticketQuantity);
  const [selectMethod, setSelectedmaethod] = useState(false)
  const [showPaymentSheet, setShowPaymentSheet] = useState(false)
  const [selectedPayment, setSelectedMethod] = useState("")
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [cardDetail, setCardDetails] = useState("")
  const [loading, setLoading] = useState(false)
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
  useEffect(() => {
    initStripe({
      publishableKey: STRIPE_PK,
      merchantIdentifier: "merchant.com.myscroll.youni"
    });
  }, [])
  const onCheckStatus = async (paymentResponse) => {
    // setResponse(paymentResponse)
    // let jsonResponse = JSON.parse(paymentResponse);
    // // perform operation to check payment status
    //
  };
  const makePayment = () => {
    // navigation.navigate("EventTicketSummary", { formData: {  isFree: false }, });
    // return
    setLoading(true)
    console.log({
      amount: paymentInformation,
      quantity: ticketQuantity,
      "user_id": profile.id,
      "scheduled_event_id": eventDetails.id,
      "ticket_type_id": ticket_type_id,
    })
    fetch(URLB + '/events/checkout', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: paymentInformation,
        quantity: ticketQuantity,
        "user_id": profile.id,
        "scheduled_event_id": eventDetails.id,
        "ticket_type_id": ticket_type_id,
      })
    })
      .then(async (res) => {
        console.log("====>", res)
        if (res.status === 203) {
          let js = await res.json()
          console.log(js)
          setLoading(false)
          alert(js.message + " Remaining tickets: " + js.ticket_count)
          return
        }

        let js = await res.json()
        console.log("====>", js)
        // response = js
        // return
        try {
          confirmPayment(js.paymentIntent,
            {
              liveMode: STRIPE_PK === STRIPE_LIVE_API_KEY ? true : false,
              customerId: js.customer,
              type: 'Card',

            }
            //    {
            //   email: 'string',
            //   name: 'string',
            //   phone: 'string',
            //   addressPostalCode: 'string',
            //   addressCity: 'string',
            //   addressCountry: 'string'
            // }
          )
            .then(async (res) => {
              setLoading(false)
              if (res.error) {
                console.log(res)
                alert(res.error.localizedMessage)
              } else {
                console.log("88 ", res)
                // alert(JSON.stringify(res))
                let data = {
                  price: paymentInformation,
                  quantity: ticketQuantity,
                  "user_id": profile.id,
                  "scheduled_event_id": eventDetails.id,
                  "ticket_type_id": ticket_type_id,
                  "stripeTokenId": res.paymentIntent.id,
                  "base_price": base_price
                }
                fetch(URLB + '/events/ticket', {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(data)
                })
                  .then(async (res) => {
                    let da = await res.json()
                    console.log("====>1", da)
                    // if (da?.message) {
                    //   alert(da.message)
                    // } else {
                    if (da.data) {
                      navigation.navigate("EventTicketSummary", { formData: { ...data, isFree: false, eventDetails: eventDetails }, });
                    } else {
                      alert(da.message)
                    }
                    // }

                  })
              }

            })
            .catch((error) => {
              setLoading(false)
              console.log("stripe error", error)
            })
        } catch (error) {
          console.log(error)
          console.log("stripe error2", error)
        }

      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
        alert('Some error occured, Please verify your ticket quantity and details!')
      })

    //  confirmPayment()
  }
  const makeApplePayment = async () => {
    // navigation.navigate("EventTicketSummary", { formData: {  isFree: false }, });
    console.log(isApplePaySupported)
    if (isApplePaySupported) {
      try {

        setLoading(true)
        const { error } = await presentApplePay({
          cartItems: [{
            label: 'for: ' + eventDetails.title,
            amount: paymentInformation,
            paymentType: 'Immediate'
          }],
          country: 'US',
          currency: 'gbp',
          apple_merchant_identifier: "merchant.com.myscroll.youni",
          shippingMethods: [
            {
              amount: paymentInformation,
              identifier: 'merchant.com.myscroll.youni',
              label: 'Youni Event tickets for ',
              detail: eventDetails.title,
              // type: 'final',
            },
          ],
          // requiredShippingAddressFields: ['emailAddress', 'phoneNumber'],
          // requiredBillingContactFields: ['phoneNumber', 'name'],
        });
        if (error) {
          console.log(error)
          alert("Error presenting payment sheet,Please try again later")
          setLoading(false)
          // handle error
        } else {
          fetch(URLB + '/events/checkout', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              amount: paymentInformation,
              quantity: ticketQuantity,
              "user_id": profile.id,
              "scheduled_event_id": eventDetails.id,
              "ticket_type_id": ticket_type_id,
            })
          })
            .then(async (res) => {
              // const clientSecret = await fetchPaymentIntentClientSecret();
              if (res.status === 203) {
                let js = await res.json()
                setLoading(false)
                alert(js.message + " Remaining tickets: " + js.ticket_count)
                return
              }
              let js = await res.json()
              console.log("====>", js)
              try {
                await confirmApplePayPayment(
                  js.paymentIntent,
                ).then((res1) => {
                  setLoading(false)
                  console.log("====asx>", res1)
                  if (res1.error) {
                    alert(res1.error.message)
                    setLoading(false)
                  } else {
                    console.log("88 ", res)
                    // alert(JSON.stringify(res))
                    let data = {
                      price: paymentInformation,
                      quantity: ticketQuantity,
                      "user_id": profile.id,
                      "scheduled_event_id": eventDetails.id,
                      "ticket_type_id": ticket_type_id,
                      "stripeTokenId": "applePay",
                      "base_price": base_price
                    }
                    fetch(URLB + '/events/ticket', {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(data)
                    })
                      .then(async (res) => {
                        let da = await res.json()
                        console.log("====>1", da)
                        // if (da?.message) {
                        //   alert(da.message)
                        // } else {
                        if (da.data) {
                          navigation.navigate("EventTicketSummary", { formData: { ...data, isFree: false, eventDetails: eventDetails }, });
                        } else {
                          alert(da.message)
                        }
                        // }

                      })
                  }

                })
              } catch (error) {
                // console.log(error)
                console.log("stripe error2", error)
              }

              // if (confirmError) {
              //   console.log(confirmError)
              // }
            })
        }
      } catch (error) {
        console.log(error)
        console.log("stripe error3", error)
      }
    } else {
      alert("Apple pay not supported, Please make sure to add card in your apple pay and try again")
    }
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
      <SafeAreaView style={styles.container} forceInset={{ bottom: "never" }}>
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
              >Review and Pay</Text>
              {/* <NavigationHeaderText text={'Review and Pay'} />
               */}
            </View>
          }
          showDivider={false}
        />
        <View
          style={{
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
          <View
          style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:"center"
          }}
          >
          <Text
            style={{
              fontSize: 14,
              color: 'white',
              fontFamily: FONTS.bwBold,
              marginTop: 10
            }}
          >{ticketQuantity} tickets</Text>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.bwBlack,
              fontSize: 17,
              textAlign:'right'
            }}
          >To pay {`\n\u00A3 ${paymentInformation} total`}
          </Text>
          </View>
         
        </View>
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: windowWidth - 40,
            marginTop: -15,
            marginHorizontal: 20,
            paddingBottom: 15,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: "rgba(255,255,255, 0.1)",
          }}
        >
          <Image style={{ tintColor: "white" }} source={icon.clock} />
          <Text
            style={{
              ...styles.mainText,
              marginLeft: 20,
            }}
          >
            {moment(eventDetails.start_at).format("dddd, DD MMM yyyy")}
          </Text>
          <Text
            style={{
              ...styles.minorText,
              marginLeft: 20,
            }}
          >{`${moment(eventDetails.start_at).format("h:mm a")} - ${moment(
            eventDetails.end_at
          ).format("h:mm a")}`}</Text>
        </View> */}
        {selectMethod ?
          null
          :
          <View
            style={{
              marginTop: 20
            }}
          >
            <Text
              style={{
                fontSize: 24,
                color: 'white',
                fontFamily: FONTS.bwBold
              }}
            >{Platform.OS === 'android' ? "Card Details" : "Pay with"}</Text>
            {Platform.OS === 'android' ?
              <>
                <CardField
                  postalCodeEnabled={false}
                  placeholder={{
                    number: '4242 4242 4242 4242',
                  }}
                  placeholderTextColor={'grey'}
                  cardStyle={{
                    backgroundColor: 'white',
                    textColor: 'black',
                    borderWidth: 2,
                    borderColor: COLORS.purple,
                    cursorColor: 'black'
                  }}
                  style={{
                    width: '100%',
                    height: 50,
                    marginVertical: 20,
                    color: 'white'
                  }}
                  onCardChange={(cardDetails) => {
                    console.log('cardDetails', cardDetails);
                    if (cardDetails.complete) {
                      setCardDetails(cardDetails)
                      Keyboard.dismiss()
                      // makePayment()
                    }
                  }}
                  onFocus={(focusedField) => {
                    console.log('focusField', focusedField);
                  }}
                />
              </>
              :
              <>
                {cardDetail !== "" ?
                  <View
                    style={{
                      // height: 55,
                      width: windowWidth * 0.9,
                      // backgroundColor: C,
                      borderRadius: 10,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginRight: 5,
                      borderWidth: 1,
                      borderColor: 'white',
                      marginTop: 20,
                      flexDirection: 'row',
                      padding: 10
                    }}
                    onPress={() => {
                      setShowPaymentSheet(true)
                    }}
                  >
                    <View>
                      <View
                        style={{
                          backgroundColor: 'white',
                          padding: 5,
                          borderRadius: 10
                        }}
                      >
                        <Image
                          source={cardDetail.type === "apple" ? icon.applecard : cardDetail.brand === "visa" ? icon.visa : icon.visa}
                          style={{
                            height: 20,
                            width: 50,
                            resizeMode: 'contain'
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'white',
                          fontFamily: FONTS.bwBlack,
                          marginTop: 9
                        }}
                      >{cardDetail.type === "apple" ? "Apple pay" : "****" + cardDetail.last4}</Text>
                    </View>
                    <Text
                      style={{
                        color: COLORS.purple,
                        marginLeft: 20,
                        // marginTop: 20,
                        fontSize: 15,
                        fontFamily: FONTS.bwBold
                      }}
                      onPress={() => {
                        setShowPaymentSheet(true)
                      }}
                    >Change Payment</Text>
                  </View>
                  :
                  <TouchableOpacity
                    style={{
                      height: 55,
                      width: windowWidth * 0.9,
                      // backgroundColor: C,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 5,
                      borderWidth: 1,
                      borderColor: 'white',
                      marginTop: 20
                    }}
                    onPress={() => {
                      setShowPaymentSheet(true)
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'white',
                        fontFamily: FONTS.bwBlack
                      }}
                    >Select payment method</Text>
                  </TouchableOpacity>
                }
              </>
            }
          </View>
        }
        <View style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          alignSelf: "center"
        }}>
          <LinearGradient
            style={{
              position: "absolute",
              width: "100%",
              // marginTop: -70,
              height: 50,
            }}
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
            pointerEvents="none"
          />
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
                  // justifyContent: "center",
                  // alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.bwBlack,
                    fontSize: 17,
                  }}
                >
                  {`\n\u00A3 ${paymentInformation} total`}
                </Text>
                <Text
                  style={{
                    color: '#8E8E8E',
                    fontFamily: FONTS.bwLight,
                    fontSize: 14,
                    textAlign: 'left'
                  }}
                >{ticketQuantity} tickets selected</Text>
              </View>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  width: 125,
                  height: 55,
                  borderWidth: 2,
                  backgroundColor: cardDetail ? COLORS.purple : COLORS.disableGrey,
                  borderRadius: 14,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  if (cardDetail.type === "apple") {
                    makeApplePayment()
                  } else {
                    makePayment()
                  }
                  // else {
                  //   if (cardDetail) {
                  //     if (Platform.OS === "android") {
                  //       makePayment()
                  //     }
                  //   }


                  // }
                }}
              >
                <Text
                  style={{
                    color: cardDetail ? COLORS.white : COLORS.disableText,
                    fontFamily: FONTS.bwBlack,
                    fontSize: 15,
                  }}
                >
                  Pay
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

      </SafeAreaView>
      <Modal
        visible={loading}
        transparent
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: "center"
          }}
        >
          <ActivityIndicator size={'large'} color={COLORS.purple} />
        </View>
      </Modal>
      <Modal
        transparent
        visible={showPaymentSheet}
        animationType={'slide'}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss()
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
                bottom: isKeyboardVisible ? -windowHeight / 3 : -windowHeight / 2,
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
                >Payment method</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowPaymentSheet(false)
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
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 80,
                    width: windowWidth / 2.3,
                    borderRadius: 10,
                    padding: 10,
                    borderWidth: 2,
                    borderColor: selectedPayment === "stripe" ? COLORS.purple : COLORS.disableGrey
                    // justifyContent: 'center',
                    // alignItems: 'flex-end'
                  }}
                  onPress={() => {
                    setSelectedMethod('stripe')
                  }}
                >
                  <Image
                    source={icon.confirm_tick}
                    style={{
                      height: 25,
                      width: 25
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'white',
                      fontFamily: FONTS.bwMedium,
                      marginTop: 5
                    }}
                  >Add new card</Text>
                </TouchableOpacity>
                {Platform.OS === 'ios' ?
                  <TouchableOpacity
                    style={{
                      height: 80,
                      width: windowWidth / 2.3,
                      borderRadius: 10,
                      padding: 10,
                      borderWidth: 2,
                      borderColor: selectedPayment === "apple" ? COLORS.purple : COLORS.disableGrey
                      // justifyContent: 'center',
                      // alignItems: 'flex-end'
                    }}
                    onPress={() => {
                      setSelectedMethod('apple')
                    }}
                  >
                    <Image
                      source={icon.confirm_tick}
                      style={{
                        height: 25,
                        width: 25
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'white',
                        fontFamily: FONTS.bwMedium,
                        marginTop: 5
                      }}
                    >Apple pay</Text>
                  </TouchableOpacity>
                  :
                  null
                }
              </View>
              {Platform.OS === "android" ?
                <>
                  {selectedPayment === "stripe" ?
                    <KeyboardAvoidingView
                      behavior='height'
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'white',
                          fontFamily: FONTS.bwBlack,
                          marginTop: 20
                        }}
                      >Please fill in your card details</Text>
                      <CardField
                        postalCodeEnabled={false}
                        placeholder={{
                          number: '4242 4242 4242 4242',
                        }}
                        placeholderTextColor={'red'}
                        cardStyle={{
                          backgroundColor: '#1D1E29',
                          textColor: '#FFFFFF',
                          borderWidth: 2,
                          borderColor: COLORS.disableGrey,
                          cursorColor: '#FFFFFF'
                        }}
                        style={{
                          width: '100%',
                          height: 50,
                          marginVertical: 20,
                          color: 'white'
                        }}
                        onCardChange={(cardDetails) => {
                          console.log('cardDetails', cardDetails);
                          if (cardDetails.complete) {
                            setCardDetails(cardDetails)
                            Keyboard.dismiss()
                            // makePayment()
                          }
                        }}
                        onFocus={(focusedField) => {
                          console.log('focusField', focusedField);
                        }}
                      />
                    </KeyboardAvoidingView>
                    :
                    null
                  }
                  {selectedPayment ?
                    <TouchableOpacity
                      style={{
                        height: 50,
                        // width: windowWidth,
                        backgroundColor: selectedPayment === "stripe" ? cardDetail?.complete ? COLORS.purple : COLORS.disableGrey : COLORS.purple,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: COLORS.disableGrey,
                        borderRadius: 10,
                        marginTop: 20
                      }}
                      onPress={() => {
                        // setCardDetails()
                        setShowPaymentSheet(false)
                        return
                        if (cardDetail) {
                          let temp = {
                            ...cardDetail,
                            type: selectedPayment === "stripe" ? cardDetail.brand : "apple"
                          }
                          onComplete(temp)
                        } else if (selectedPayment === "apple") {
                          let temp = {
                            ...cardDetail,
                            type: selectedPayment === "stripe" ? cardDetail.brand : "apple"
                          }
                          onComplete(temp)
                        }
                      }}
                    >
                      <Text
                        style={{
                          color: selectedPayment === "stripe" ? cardDetail?.complete ? "white" : COLORS.disableText : "white",
                          fontFamily: FONTS.bwBold
                        }}
                      >{selectedPayment === "stripe" ? "Use this card" : "Proceed"}</Text>
                    </TouchableOpacity>
                    :
                    null
                  }
                </>
                :
                <PaymentView
                  onCheckStatus={onCheckStatus}
                  paymentInformation={paymentInformation}
                  navigation={navigation}
                  ticketQuantity={ticketQuantity}
                  eventDetails={eventDetails}
                  profile={profile}
                  ticket_type_id={ticket_type_id}
                  base_price={base_price}
                  selectMethod={selectMethod}
                  onSelect={() => {
                    setSelectedmaethod(true)
                  }}
                  selectedPayment={selectedPayment}
                  onComplete={(card) => {
                    console.log(card)
                    setCardDetails(card)
                    setShowPaymentSheet(false)
                  }}
                />
              }
            </View>

          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, },
  navigation: { flex: 2, backgroundColor: "red" },
  body: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  footer: { flex: 1, backgroundColor: "cyan" },
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
export default EventTicketPurchase;
