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
  AsyncStorage,
  TouchableWithoutFeedback
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
import HeaderSignup from "../../components/HeaderSignup";
import FilledButton from "../../components/FilledButton";
const Signup = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);
  const [profileEmail, setProfileEmail] = useState("");
  const [otp, setotp] = useState("");
  const [confirmPass, setConfirmPassword] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const refSlideContainerY = useRef(new Animated.Value(0.0)).current;
  const [remainingHeight, setRemainingHeight] = useState(0);
  const [showView, setShowView] = useState('login');
  const [currentFlow, setCurrentFlow] = useState('login');

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
        "Please enter a valid email and password."
      );
      return;
    }
    setLoading(true);
    console.log(profileEmail, profilePassword)
    fnLogin(profileEmail.toLowerCase(), profilePassword)
      .then(async (response) => {
        if (response.data.success !== "false") {
          await AsyncStorage.setItem("token", response.data?.auth_token)
          console.log("login", response.data)
          setShowView('otp')
          requestEmailOTP()
        } else {
          errorAlert(
            "Invalid User/Password",
            "Please enter a valid email and password."
          );
        }

      })
      .catch((error) => {
        switch (error?.response) {
          case 403:
            errorAlert(
              "Invalid User/Password",
              "Please enter a valid email and password."
            );
            break;
          case 500:
            errorAlert(
              "Invalid User/Password",
              "Please enter a valid email and password."
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
  const requestEmailOTP = () => {
    setLoading(true);
    fetch("https://api.myscroll.co.uk/users/requestPassword", {
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
        let json = await res.json()
        console.log(json)
        if (json.message === "user not found") {
          setLoading(false)
          alert('Please enter a valid email address')
        } else {
          setLoading(false)
          setShowView('otp')
          alert("We've sent your email a verification code.")
        }


      })
      .catch((err) => {
        setLoading(false)
        console.log("error=>".err)
      })
  }
  const verifyOtp = () => {
    if (otp === "") {
      errorAlert(
        "OTP error",
        "Please enter otp"
      );
      return;
    } else if (otp.length < 6) {
      errorAlert(
        "OTP error",
        "Please enter valid OTP"
      );
      return;
    }
    setLoading(true);
    fetch("https://api.myscroll.co.uk/users/verifyCode", {
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
        if (json.message === "Valid code") {
          setLoading(false)
          if (currentFlow === 'reset') {
            setShowView('password')
          } else {
            signIn();
          }
        } else {
          setLoading(false)
          alert("Invalid otp")
        }


      })
      .catch((err) => {
        setLoading(false)
        console.log("error=>".err)
      })
  }
  const changePassword = () => {
    if (profilePassword === "" || confirmPass === "") {
      errorAlert(
        "Password Change Error",
        "Please enter both fields"
      );
      return
    } else if (profilePassword.length < 6) {
      errorAlert(
        "Password Change Error",
        "Please enter password minimum of 6 characters"
      );
      return
    } else if (profilePassword !== confirmPass) {
      errorAlert(
        "Password Change Error",
        "Password don't match"
      );
      return
    }
    setLoading(true);
    fetch("https://api.myscroll.co.uk/users/updatePassword", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "email": profileEmail,
        "password": profilePassword
      })
    })
      .then(async (res) => {
        let json = await res.json()
        console.log(json)
        setLoading(false)
        alert("Password changed!")
        setProfileEmail("")
        setConfirmPassword("")
        setotp("")
        setProfilePassword("")
        setShowView("login")

      })
      .catch((err) => {
        setLoading(false)
        console.log("error=>".err)
      })
  }

  const [statusTitle, setStatusTitle] = useState('Log in')
  const handleBackPress = () => {
    switch (showView) {
      case "login":
        navigation.navigate("MainScreen");
        break;
      default:
        setShowView('login')
        break;
    }
  }
  return (
    <TouchableWithoutFeedback
      style={{
        flex: 1
      }}
      onPress={() => {
        Keyboard.dismiss()
      }}
    >
      <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} locations={[0, 0.8, 1]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
          <View style={{ width: '100%' }}>
            <HeaderSignup title={statusTitle} handleBackPress={handleBackPress} canGoBack percentage={0} />
            {showView === 'login' ?
              <View style={styles.inputContainer}>
                <Text
                  style={styles.headerText}
                  numberOfLines={2}
                >Enter your email.</Text>
                <Text
                  style={styles.bodyText}
                  numberOfLines={2}
                >We will send a verification code to your email</Text>
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
              </View>
              :
              <View style={styles.inputContainer}>
                {showView === 'otp' && (
                  <>
                    <Text
                      style={styles.headerText}
                      numberOfLines={2}
                    >Enter verification code we sent to your email</Text>
                    <Text
                      style={styles.bodyText}
                      numberOfLines={2}
                    >It might take a couple minutes to load into your inbox.</Text>
                    <SignupInput
                      titleText="Verification code"
                      keyboardType="email-address"
                      placeholderText="Enter Your Verification code"
                      value={otp}
                      onChangeText={setotp}
                      secureTextEntry={true}
                    />
                  </>
                )
                }
                {showView === 'passwordResetEmail' && (
                  <>
                    <Text
                      style={styles.headerText}
                      numberOfLines={3}
                    >Enter your email address and we'll send you a verification code.</Text>
                    <SignupInput
                      titleText="Email address"
                      keyboardType="email-address"
                      placeholderText="Enter your email address"
                      value={profileEmail}
                      onChangeText={setProfileEmail}
                    />
                  </>
                )}
                {showView === 'password' && (
                  <>
                    <Text
                      style={styles.headerText}
                      numberOfLines={1}
                    >Enter a new password</Text>
                    <SignupInput
                      titleText="New Password"
                      placeholderText="Enter Your Password"
                      value={profilePassword}
                      onChangeText={setProfilePassword}
                      secureTextEntry={true}
                    />
                    <SignupInput
                      titleText="Confirm New Password"
                      placeholderText="Enter Your Password"
                      value={confirmPass}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={true}
                    />
                  </>
                )}
              </View>
            }
            {isLoading ?
              <View
                style={{
                  marginTop: 40
                }}
              >
                <ActivityIndicator color={COLORS.purple} />
              </View>
              :
              <FilledButton
                width={wp("84%")}
                style={{ marginTop: 20 }}
                text={showView === 'login' && "Log in" || showView === 'otp' && "Verify" || showView === 'passwordResetEmail' && 'Send Verification Code' || showView === 'password' && 'Change Password'}
                onPress={() => {
                  if (showView === 'login') {
                    onLoginPress()
                    setCurrentFlow('login')
                  } else if (showView === 'otp') {
                    verifyOtp()
                  } else if (showView === 'passwordResetEmail') {
                    requestEmailOTP()
                    setCurrentFlow('reset')
                  } else {
                    changePassword()
                  }

                }}
                disabled={isLoading}
              />
            }
          </View>
          {showView === 'login' && (
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                fontFamily: FONTS.bwBold,
                fontSize: 12.5,
                paddingVertical: 10,
                color: COLORS.purple
              }}
              onPress={() => {
                setShowView('passwordResetEmail')
                /* if (profileEmail === "") {
                  errorAlert(
                    "Forgot Password",
                    "Please enter your email"
                  );
                } else {
                  //requestEmailOTP()
                } */
                // navigation.navigate("forgot")
              }}
            >Forgot Password?</Text>
          )}
          <View
            style={{ flex: 1 }}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              setRemainingHeight(height);
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
                Don't have an Account?{" "}
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
                Sign up
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
  logo: {
    marginTop: "2%",
    marginBottom: "2%",
    width: 190,
    height: 190,
    resizeMode: "contain",
    alignSelf: "center",
    borderRadius: 10
  },
  inputContainer: {
    alignItems: "center",
  },
  text: {
    fontFamily: FONTS.bwRegular,
    fontSize: 14,
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
