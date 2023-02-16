import React, { useState, useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaView from "react-native-safe-area-view";
import ScreenHeader from "../../components/ScreenHeader";
import NavigationBarButton from "../../components/NavigationBarButton";
import { icon } from "../../helpers/assets";
import { NavigationHeaderText } from "../../components/NavigationHeaderText";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EditProfileInput from "../../components/EditProfileInput";
import { COLORS } from "../../helpers/colors";
import { FONTS } from "../../helpers/fonts";
import axios from "axios";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import {URLB} from './../../helpers/api'
const HostHelper = ({ navigation }) => {
  const onBack = () => {
    navigation.goBack();
  };
  useEffect(() => {
    Alert.alert(
      "Disclaimer",
      "Scanning the QR will invalid the ticket, this is only one time scanning,Are you sure to Scan QR code?",
      [
        {
          text: "Yes,Confirm",
          onPress: () => {
            setAllowed(true)
          }
        },
        {
          text: "Cancel",
          onPress: () => {
            setAllowed(false)
            navigation.goBack()
          }
        }
      ]
    )
  }, [])
  const [hostCode, setHostCode] = useState();
  const [hostAccepted, setHostAccepted] = useState(false);
  const [allowed, setAllowed] = useState(false);


  const [ticketId, setTicketId] = useState();
  const [ticketDetails, setTicketDetails] = useState();

  const api = axios.create({
    /* baseURL: "http://localhost:5000/api", // DEV */
    baseURL: URLB, // PRODUCTION
  });

  async function HandleCheckEventID(data) {
    return await api.patch("/ticketauth/authenticateticket", data);
  }

  function onHostCodeSubmit() {
    console.log("click test");
    if (hostCode != null) {
      if (hostCode === "REDEMXMS") {
        console.log("Setting True: ", hostAccepted);
        setHostAccepted(true);
      }
    }
  }

  function onCheckCodeSubmit() {
    HandleCheckEventID({ ticketid: ticketId })
      .then((res) => {
        setTicketDetails(res.data);
      })
      .catch((err) => {
      });
  }
  const onSuccess = e => {
    let da = JSON.parse(e.data)
    let data = {
      "id": da.id,
      "user_id": da.user_id,
      "event_id": da.event_id
    };
    console.log("hiashdiuasgd===>", data)
    fetch(URLB+`/users/qr`, {
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
        navigation.goBack()
      })
      .catch((err) => {
        alert(JSON.stringify(err))
      })
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );
  };
  return (
    <LinearGradient
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
      colors={["#122624", "#081515", "#020d0d"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader
          leftButton={<NavigationBarButton icon={icon.back} onPress={onBack} />}
          centerView={<NavigationHeaderText text="Host Code" />}
        />
        {allowed ?
        <View
          style={{
            height: 500,
            width: '100%',
            justifyContent: "center",
            // alignItems:"center"
          }}
        >
          <Text style={{
            color: "white",
            alignSelf: "center"
          }}>
            Please scan your Ticket QR Code!
          </Text>
          
            <QRCodeScanner
              onRead={onSuccess}
              cameraStyle={{
                height: 500,
                width: '80%',
                marginTop: 10,
                alignSelf: "center"
              }}
              
              flashMode={RNCamera.Constants.FlashMode.off}
              // topContent={
              //   <Text style={{
              //     color: "white"
              //   }}>
              //     Please scan your Ticket QR Code!
              //   </Text>
              // }

              bottomContent={
                <TouchableOpacity style={styles.buttonTouchable}>
                  {/* <Text style={{
                color:"white"
              }}>OK. Got it!</Text> */}
                </TouchableOpacity>
              }
            />
           
        </View>
         :
         null
       }

        {/* {!hostAccepted ? (
          <EditProfileInput
            ic={icon.setting_school}
            placeholderText={"What's your host code?"}
            value={hostCode}
            onChangeText={setHostCode}
          />
        ) : (
          <EditProfileInput
            ic={icon.setting_school}
            placeholderText={"Enter Ticket ID"}
            value={ticketId}
            onChangeText={setTicketId}
          />
        )} */}
        {/* {ticketDetails ? (
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 35,
                marginHorizontal: 20,
              }}
            >
              <Text style={{ ...styles.mainText, marginLeft: 20 }}>
                First Last
              </Text>
              <Text style={{ ...styles.mainText, marginLeft: 20 }}>
                {ticketDetails.firstlast}
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
              <Text style={{ ...styles.mainText, marginLeft: 20 }}>Email</Text>
              <Text style={{ ...styles.mainText, marginLeft: 20 }}>
                {ticketDetails.email}
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
              <Text style={{ ...styles.mainText, marginLeft: 20 }}>
                People Attending
              </Text>
              <Text style={{ ...styles.mainText, marginLeft: 20 }}>
                {ticketDetails.quantity}
              </Text>
            </View>
          </View>
        ) : (
          <></>
        )} */}
      </SafeAreaView>
      {/* <SafeAreaView style={{ width: "100%" }}>
        {!hostAccepted ? (
          <TouchableOpacity
            style={styles.hollowButton}
            onPress={onHostCodeSubmit}
          >
            <Text style={styles.buttonText}>Enter</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.hollowButton}
            onPress={onCheckCodeSubmit}
          >
            <Text style={styles.buttonText}>CHECK</Text>
          </TouchableOpacity>
        )} */}
      {/* </SafeAreaView> */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainText: {
    color: COLORS.white,
    fontFamily: FONTS.bwBold,
    fontSize: 14,
  },
  hollowButton: {
    width: "100%",
    height: 60,
    marginHorizontal: 5,
    marginVertical: 14,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: COLORS.appYellow,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: COLORS.appYellow,
    fontSize: 15,
    fontFamily: "BwModelica-Black",
  },
});
export default HostHelper;
