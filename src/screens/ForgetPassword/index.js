import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SignupInput from "../../components/SignupInput";
import { COLORS } from "../../helpers/colors";
import LinearGradient from "react-native-linear-gradient";
import HollowButton from "../../components/HollowButton";
import { FONTS } from "../../helpers/fonts";
import { AuthContext } from "../../navigation/context";
import { fnLogin } from "../../helpers/api";
import { logo } from "../../helpers/assets";
import { errorAlert } from "../../helpers/alerts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import messaging from '@react-native-firebase/messaging';
const Signup = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const refSlideContainerY = useRef(new Animated.Value(0.0)).current;
  const [remainingHeight, setRemainingHeight] = useState(0);
  const translateView = (ref, value) => {
    return Animated.timing(ref, {
      toValue: value,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  useEffect(async () => {
    //   requestUserPermission()
    //  let token=await messaging().getToken()
    //  console.log(token)
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = (e) => {
    const keyboardHeight = e.endCoordinates.height;
    translateView(
      refSlideContainerY,
      Math.min(0, remainingHeight - keyboardHeight)
    );
  };

  const _keyboardDidHide = (e) => {
    const keyboardHeight = 0;
    translateView(refSlideContainerY, keyboardHeight);
  };

  const onLoginPress = () => {
    if (profileEmail === "" || profilePassword === "") {
      errorAlert(
        "Unable to Login",
        "Unable to find matching Email and Password"
      );
      return;
    }
    setLoading(true);
    console.log(profileEmail, profilePassword)
    fnLogin(profileEmail.toLowerCase(), profilePassword)
      .then((response) => {
        signIn();
      })
      .catch((error) => {
        switch (error.response.status) {
          case 403:
            errorAlert(
              "Invalid User/Password",
              "Unable to find account with user and password provided."
            );
            break;
          default:
            errorAlert("Error", "We’ve encountered a problem, try again later");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <LinearGradient
      colors={[COLORS.black, COLORS.appBlack]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        <View>
          <Image style={styles.logo} source={logo.myscroll_logo} />
          <View style={styles.inputContainer}>
            <SignupInput
              titleText="Email"
              keyboardType="email-address"
              placeholderText="Enter Your Email"
              value={profileEmail}
              onChangeText={setProfileEmail}
            />
            <SignupInput
              titleText="Password"
              placeholderText="Enter Your Password"
              value={profilePassword}
              onChangeText={setProfilePassword}
              secureTextEntry={true}
            />
            <Text
              style={{
                color: "white",
                fontSize: 18,
                alignSelf: "flex-end",
                marginTop: 15
              }}
              onPress={()=>{
                
              }}
            >Forget Password?</Text>
          </View>
          {isLoading ?
            <View
              style={{
                marginTop: 40
              }}
            >
              <ActivityIndicator color={COLORS.purple} />
            </View>
            :
            <HollowButton
              width={wp("84%")}
              text="LOG IN"
              onPress={() => {
                onLoginPress()
              }}
              disabled={isLoading}
            />
          }
        </View>
        <View
          style={{ flex: 1 }}
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setRemainingHeight(height);
          }}
        />
       
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    marginTop: "12%",
    marginBottom: "8%",
    width: 190,
    resizeMode: "contain",
    alignSelf: "center",
  },
  inputContainer: {
    alignItems: "center",
  },
  text: {
    fontFamily: FONTS.bwRegular,
    fontSize: 14,
  },
});

export default Signup;
