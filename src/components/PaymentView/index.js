import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import {
  STRIPE_LIVE_API_KEY,
  STRIPE_TEST_API_KEY,
} from "../../helpers/tempData";
import EventTicketSummary from "../../screens/EventTicketSummary";
import { initStripe, CardField, useStripe, StripeProvider, createPaymentMethod, useConfirmPayment } from '@stripe/stripe-react-native';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Modal, Keyboard, KeyboardAvoidingView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../helpers/colors";
import { FONTS } from "../../helpers/fonts";
import { URLB } from './../../helpers/api'
import { windowWidth } from "../../helpers/dimensions";
// const STRIPE_PK = STRIPE_TEST_API_KEY;
const STRIPE_PK = STRIPE_LIVE_API_KEY;

/**
 * Create a Payment View component for stripe since stripe does not provide a react native library.
 * Using a webview inject javascript/HTML code to display web component and handle stripe interaction
 * Catch and handle callback using webview messaging
 *
 */

const PaymentView = (props) => {
  const {
    paymentInformation,
    onCheckStatus,
    navigation,
    ticketQuantity,
    eventDetails,
    profile,
    ticket_type_id,
    base_price,
    selectMethod,
    selectedPayment,
    onComplete
  } = props;
  const { confirmPayment } = useConfirmPayment();
  const [loading, setLoading] = useState(false)
  const [cardDetail, setCardDetails] = useState("")

  var formData = {};

  const publishableKey = "pk_live_51Hc7A3CtcrhGM8ReraxljL0kM8rqQHzKYtUhrG0Vlt3MWl426TRHbmgvWxMzqU25CBu0E7EIQsnRH0pBbszdkc5200tmwpSees";
  const statusResponse = (response) => {
    onCheckStatus(response);
  };

  // useEffect(() => {
  //   initStripe({
  //     publishableKey: STRIPE_PK
  //   });
  // }, [])
  const makePayment = () => {
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
        // console.log("====>", res)
        if (res.status === 203) {
          let js = await res.json()
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
              liveMode: true,
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
                      navigation.navigate("EventTicketSummary", { formData: { ...data, isFree: false }, });
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
  // const htmlContent = `
  //   <h1>Card Payment</h1>
  //   <script>
  //     function testMessage(){
  //         window.postMessage("Script called")
  //     }
  //   </script>
  //   <button onClick=(testMessage())> Button</button>
  // `
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Page</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    body {
      background-color: #0a1919;
      overflow: hidden;
    }

    label {
      margin: 0;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .example.example1 {
      width: 100%;
      padding: 10px 15px;
      background-color: #2e4645;
      border-radius: 5px;
      margin-top: 10px;
    }

    .example.example1 * {
      font-family: Roboto, Open Sans, Segoe UI, sans-serif;
      font-size: 16px;
      font-weight: 500;
    }

    .example.example1 fieldset {
      margin: 0 0 20px;
      border-style: none;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }

    .example.example1 fieldset.user-data {
      padding: 8px 0;
    }

    .example.example1 .row {
      display: -ms-flexbox;
      display: flex;
      flex-direction: column;
      margin-left: 15px;
      padding: 2px 0;
    }

    .example.example1 label {
      width: 15%;
      min-width: 70px;
      color: #ffffff;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .example.example1 input, .example.example1 button {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      outline: none;
      border-style: none;
    }

    .example.example1 input:-webkit-autofill {
      -webkit-text-fill-color: #fce883;
      transition: background-color 100000000s;
      -webkit-animation: 1ms void-animation-out;
    }

    .example.example1 .StripeElement--webkit-autofill {
      background: transparent !important;
    }

    .example.example1 .StripeElement {
      width: 100%;
      padding: 11px 15px 11px 0;
    }

    .example.example1 input {
      width: calc(100% - 16px);
      color: #fff;
      border-bottom: 1px solid #ffffff40;
      background-color: transparent;
      -webkit-animation: 1ms void-animation-out;
    }

    .example.example1 input::-webkit-input-placeholder {
      color: #b0b0b0;
    }

    .example.example1 input::-moz-placeholder {
      color: #b0b0b0;
    }

    .example.example1 input:-ms-input-placeholder {
      color: #b0b0b0;
    }

    .example.example1 button {
      display: block;
      width: calc(100%);
      height: 40px;
      margin: 20px 0 0;
      background-color: #d9bf71;
      box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 #d9bf71;
      border-radius: 4px;
      color: #081616;
      font-weight: 600;
      cursor: pointer;
    }

    .example.example1 button:active {
      background-color: #d8b756;
      box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 #d8b756;
    }

    .example.example1 .error {
      display: none;
      margin-top: 10px;
    }

    .example.example1 .error.show {
      display: block;
    }

    .example.example1 .error svg .base {
      fill: red;
    }

    .example.example1 .error svg .glyph {
      fill: #fff;
    }

    .example.example1 .error .message {
      color: #fff;
    }

    .example.example1 .success .reset path {
      fill: #fff;
    }

    .back-button {
      color: white;
      padding: 20px;
    }
  </style>

</head>
<body>

<!-- product info -->
<div class="container">
  <div class="cell example example1" id="example-1">
    <form>
      <fieldset class="user-data">
        <div class="row">
          <label for="example1-name" data-tid="elements_examples.form.name_label">Name</label>
          <input id="example1-name" data-tid="elements_examples.form.name_placeholder" type="text"
                 placeholder="First Last" autocomplete="name">
        </div>
        <div class="row">
          <label for="example1-email" data-tid="elements_examples.form.email_label">Email</label>
          <input id="example1-email" data-tid="elements_examples.form.email_placeholder" type="email"
                 placeholder="example@email.com" autocomplete="email">
        </div>
        <div class="row">
          <label for="example1-phone" data-tid="elements_examples.form.phone_label">Phone</label>
          <input id="example1-phone" data-tid="elements_examples.form.phone_placeholder" type="tel"
                 placeholder="444 5555 6666" autocomplete="tel">
        </div>
      </fieldset>
      <fieldset>
        <div class="row">
          <div id="example1-card"></div>
        </div>
      </fieldset>
      <button type="submit" data-tid="elements_examples.form.pay_button">Pay \u00A3${(
      paymentInformation.amount / 100.0
    ).toFixed(2)}</button>
      <div id="error" class="error" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
          <path class="base" fill="#000"
                d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"></path>
          <path class="glyph" fill="#FFF"
                d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"></path>
        </svg>
        <span id="error-message" class="message"></span>
      </div>
    </form>
  </div>
  <p id="client-secret" style="font-size: 0.1px; color: transparent; ">${paymentInformation.client_secret
    }</p>
</div>
<script>
  function messageData(type, data=null){
    return JSON.stringify({
      type: type,
      data: data
    })
  }
  var stripe = Stripe('${STRIPE_PK}');
  var elements = stripe.elements();
  var card = elements.create('card', {
    hidePostalCode: true,
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#fff',
        color: '#fff',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        ':-webkit-autofill': {
          color: '#ffffff',
        },
        '::placeholder': {
          color: '#b0b0b0',
        },
      },
      invalid: {
        iconColor: '#ff0000',
        color: '#ff0000',
      },
    },
  });
  card.mount('#example1-card');

  /**
   * Error Handling
   */
  //show card error if entered Invalid Card Number
  function showCardError(error) {
    document.getElementById('error').classList.remove('show')
    document.getElementById('error-message').innerHTML = ""
    if (error) {
      document.getElementById('error').classList.add('show')
      document.getElementById('error-message').innerHTML = "Error: " +error
    }
  }

  card.on('change', function (event) {
    if (event.complete) {
      showCardError()
      // enable payment button
    } else if (event.error) {
      const { message } = event.error
      showCardError(message)
    }
  });
  /**
   * Payment Request Element
   */
  var form = document.querySelector('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var formData = {}
    formData.firstlast = document.getElementById('example1-name').value
    formData.email = document.getElementById('example1-email').value
    window.ReactNativeWebView.postMessage(messageData('storeuserinput', formData))

    let clientSecret = document.getElementById('client-secret').innerHTML
    window.ReactNativeWebView.postMessage(messageData('submit', clientSecret))
    stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      }
    })
      .then(function (result) {
        window.ReactNativeWebView.postMessage(messageData('result',result))
        if (result.error) {
          // Show error to your customer
          window.ReactNativeWebView.postMessage(messageData('error', result.error.message))
          showCardError(result.error.message)
        } else {
          // The payment succeeded!
          
          window.ReactNativeWebView.postMessage(messageData('success',result))
        }
      });
  })
  
  function goBack() {
    window.ReactNativeWebView.postMessage(messageData('back','back'))
  }
</script>
</body>
</html>
`;
  const injectedJavaScript = `(function() {
        window.postMessage = function(data){
            window.ReactNativeWebView.postMessage(data);
        };
    })()`;

  const onMessage = (event) => {
    const { data } = event.nativeEvent;
    const parse = JSON.parse(data);
    switch (parse.type) {
      case "back":
        navigation.goBack();
        break;
      case "success":
        formData.quantity = ticketQuantity;
        navigation.navigate("EventTicketSummary", { formData: formData });
        break;
      case "storeuserinput":
        formData = parse.data;
        break;
      case "error":
        break;
      default:
        return;
    }
  };

  return (
      <View
        style={{
          // flex: 1,
          // paddingHorizontal: 10
          // backgroundColor: "red",
          // height:50,
          // width:50
        }}
      >
        {/* <Text>{JSON.stringify(paymentInformation)}</Text> */}
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
              if (cardDetail) {
                let temp = {
                  ...cardDetail,
                  type: selectedPayment === "stripe" ? cardDetail.brand : "apple"
                }
                onComplete(temp)
              }else if (selectedPayment === "apple") {
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
                fontFamily:FONTS.bwBold
              }}
            >{selectedPayment === "stripe" ? "Use this card" : "Proceed"}</Text>
          </TouchableOpacity>
          :
          null
        }
        {/* <WebView
      javaScriptEnabled={true}
      style={{ flex: 1, backgroundColor: "transparent" }}
      originWhitelist={["*"]}
      source={{
        html: htmlContent,
        baseUrl: "https://dashboard.stripe.com/login",
      }}
      injectedJavaScript={injectedJavaScript}
      onMessage={onMessage}
    /> */}
     
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
</View>
  );
};

export { PaymentView };
