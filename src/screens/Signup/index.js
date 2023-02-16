import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import SignupInput from "../../components/SignupInput";
import { COLORS } from "../../helpers/colors";
import LinearGradient from "react-native-linear-gradient";
import HollowButton from "../../components/HollowButton";
import { useDispatch } from "react-redux";
import { logo, icon } from "../../helpers/assets";
import SafeAreaView from "react-native-safe-area-view";
import { errorAlert } from "../../helpers/alerts";
import { setProfile } from "../../slices/profileSlice";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import NavigationBarButton from "../../components/NavigationBarButton";
import HeaderSignup from "../../components/HeaderSignup";
import FilledButton from "../../components/FilledButton";

const Signup = ({ navigation }) => {
  const dispatch = useDispatch();
  const [profileEmail, setProfileEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileRePassword, setProfileRePassword] = useState("");
  const refSlideContainerY = useRef(new Animated.Value(0.0)).current;
  const [remainingHeight, setRemainingHeight] = useState(0);
  const [showView, setView] = useState("email");
  const [loading, setLoading] = useState(false);
  const [statusTitle, setStatusTitle] = useState('Sign Up')


  const translateView = (ref, value) => {
    return Animated.timing(ref, {
      toValue: value,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const onSignupPress = () => {
    console.log(showView)
    if (showView === "email") {
      if (
        profileEmail === ""
      ) {
        errorAlert(
          "Email Empty",
          "Please enter your email."
        );
        return;
      }
      setLoading(true)
      fetch("https://api.myscroll.co.uk/users/emailVerification", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "email": profileEmail
        })
      })
        .then(async (res) => {
          setLoading(false)
          let json = await res.json()
          console.log(json)
          setView('otp')
        })
        .catch((err) => {
          setLoading(false)
          console.log("error=>".err)
        })

    } else if (showView === "otp") {
      if (
        otp === "" ||
        otp.length < 6
      ) {
        errorAlert(
          "Invalid OTP",
          "Please enter valid OTP"
        );
        return;
      }
      setLoading(true)
      fetch("https://api.myscroll.co.uk/users/verifyEmailCode", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "email": profileEmail,
          "code": otp
        })
      })
        .then(async (res) => {
          let json = await res.json()
          console.log(json)
          setLoading(false)
          if (json.message === "Valid code") {
            setView('signupPassword')
          } else {
            alert("Invalid otp")
          }

        })
        .catch((err) => {
          console.log("error=>".err)
        })
    } else if (showView === 'signupPassword') {
      if (
        profileEmail === "" ||
        profilePassword === "" ||
        profileRePassword === ""
      ) {
        errorAlert(
          "Empty Fields",
          "Please complete all field before proceeding."
        );
        return;
      }
      if (profilePassword !== profileRePassword) {
        errorAlert("Invalid Passwords", "Passwords does not match.");
        return;
      }
      const profile = {
        email: profileEmail.toLowerCase(),
        password: profilePassword,
      };
      dispatch(setProfile(profile));
      navigation.navigate("SignupName");
    }
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  });

  const _keyboardDidShow = (e) => {
    console.log("on keyboard show", "remaining height", remainingHeight);
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

  const handleBackPress = () => {
    switch(showView) {
      case "email":
        navigation.navigate("MainScreen");
        break;
      case "otp": 
        setView('email')
      break;
      case "signupPassword": 
        setView('email')
      break;
      default:
        break;
    }
  }

  return (
    <TouchableWithoutFeedback
    
    style={{
      flex:1,
    }}
    onPress={()=>{
      Keyboard.dismiss()
    }}
    >
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{ flex: 1}}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            transform: [
              {
                translateY: refSlideContainerY,
              },
            ],
            width: '100%'
          }}
        >
          <HeaderSignup title={statusTitle} handleBackPress={handleBackPress} canGoBack percentage={0} />
          {showView === "email" && (
            <View
              style={{
                width: '100%',
                alignItems: "center",
                // flex:1
              }}
            >
              <Text
                style={styles.headerText}
                numberOfLines={2}
              >Enter your email.</Text>
              <Text
                style={styles.bodyText}
                numberOfLines={2}
              >Please enter your email,
                We will send a verification code to your email</Text>
              <SignupInput
                titleText="Email"
                keyboardType="email-address"
                placeholderText="Enter your email"
                value={profileEmail}
                onChangeText={setProfileEmail}
                // editable={false}
              />
            </View>
          )}
          {showView === "otp" && (
            <View
              style={{
                width: '100%',
                alignItems: "center",
                // flex:1
              }}
            >
              <Text
                style={styles.headerText}
                numberOfLines={2}
              >Enter verification code we just sent to your email</Text>
              <Text
                style={styles.bodyText}
                numberOfLines={2}
              >It might take a couple minutes to load into your inbox.</Text>
              <SignupInput
                titleText="Verification code"
                placeholderText="Enter verification code"
                value={otp}
                onChangeText={setOtp}
                secureTextEntry={true}
                // editable={false}
              />
            </View>
          )}
          {showView === 'signupPassword' && (
            <View style={{ alignItems: "center" }}>
              <Text
                style={styles.headerText}
                numberOfLines={2}
              >Enter your password</Text>
              <Text
                style={styles.bodyText}
                numberOfLines={2}
              >Enter a secure password that you'll remember.</Text>
              <SignupInput
                titleText="Password"
                placeholderText="Enter Your Password"
                value={profilePassword}
                onChangeText={setProfilePassword}
                secureTextEntry={true}
              />
              <SignupInput
                titleText="Re-Enter Password"
                placeholderText="Re-Enter Password"
                value={profileRePassword}
                onChangeText={setProfileRePassword}
                secureTextEntry={true}
              />
            </View>
          )}
          {loading ?
            <ActivityIndicator
              style={{
                marginVertical: 15,

              }}
              color={COLORS.purple}
              size={'large'}
            />
            :
            null
          }
          <FilledButton
              width={wp("84%")}
              text={showView === "email" && "Send Verification Code" || showView === "otp" && "Verify" || showView === 'signupPassword' && 'Next'}
              onPress={onSignupPress}
            />
        </Animated.View>
        <View
          style={{ flex: 1 }}
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setRemainingHeight(height);
            console.log("onlayout", "remaining height", remainingHeight);
          }}
        />
        <View style={{ flex: 1, position: "absolute", bottom: 0 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <Text style={{ ...styles.text, color: COLORS.white, fontWeight: 'bold' }}>
              Have an account?{" "}
            </Text>
            <Text
              style={{
                ...styles.text,
                color: COLORS.purple,
                padding: 20,
                marginLeft: -20,
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              Log in
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    color: "white",
    width: 300,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 20,
  },
  bodyText: {
    color: "white",
    width: 300,
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'grey'
  }
});

export default Signup;
