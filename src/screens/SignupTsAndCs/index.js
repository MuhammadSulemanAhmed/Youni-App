import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Keyboard, SafeAreaView, StyleSheet, Text, View, TouchableWithoutFeedback, Linking, Alert} from 'react-native';
import SignupInput from '../../components/SignupInput';
import { COLORS } from '../../helpers/colors';
import LinearGradient from 'react-native-linear-gradient';
import HollowButton from '../../components/HollowButton';
import { icon, logo } from '../../helpers/assets';
import { fnCreateAccount } from '../../helpers/api';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile, setProfile } from '../../slices/profileSlice';
import { errorAlert } from '../../helpers/alerts';
import HeaderSignup from '../../components/HeaderSignup';
import FilledButton from '../../components/FilledButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import HeaderProgressBar from '../../components/HeaderProgressBar';


const OpenURLButton = ({ url, children, ic, }) => {

  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <HollowButton
      width={wp("84%")}
      text={"You can read them here"}
      onPress={handlePress}      
    />
  );
};

const SignupTsAndCs = ({ navigation }) => {
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const refSlideContainerY = useRef(new Animated.Value(0.0)).current;
  const [remainingHeight, setRemainingHeight] = useState(0)
  const [statusTitle, setStatusTitle] = useState('Terms & Conditions')
  const translateView = (ref, value) => {
    return Animated.timing(ref, {
      toValue: value,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  });

  const _keyboardDidShow = e => {
    const keyboardHeight = e.endCoordinates.height;
    let adjustedOffset = remainingHeight - keyboardHeight;
    translateView(refSlideContainerY, Math.min(0, adjustedOffset));
  };

  const _keyboardDidHide = e => {
    const keyboardHeight = 0;
    translateView(refSlideContainerY, keyboardHeight);
  };

  const onNextPress = () => {
    navigation.navigate("SignupCompleted");
  };

  const handleBackPress = () => {

  }
  return (
    <TouchableWithoutFeedback
    style={{
      flex:1
    }}
    onPress={()=>{
      Keyboard.dismiss()
    }}
    >
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{ flex: 1}}>
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: refSlideContainerY,
              },
            ],
            width: '100%',
          }}>
          <HeaderSignup title={statusTitle} handleBackPress={handleBackPress} canGoBack={false} percentage={100} />
          <View style={{ alignItems: 'center' }}>
              <Text
                style={styles.headerText}
                numberOfLines={2}
              >Youni's Terms & Conditions.</Text>
              <Text
                style={styles.bodyText}
                numberOfLines={3}
              >Before you proceed you must read and agree to Youni's Terms & Conditions</Text>
          </View>
          <OpenURLButton
            useBottomRadius
            ic={icon.setting_website}
            url={"https://www.thisisyouni.co.uk/general-4-1"}
          >
            You can read those here...
          </OpenURLButton>
        </Animated.View>
        <View
          style={{ flex: 1 }}
          onLayout={event => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setRemainingHeight(height)
          }}
        />
        <View style={{ justifyContent: 'flex-end', alignSelf: 'center' }}>
          <FilledButton
              width={wp("84%")}
              text={"Next"}
              onPress={onNextPress}
              disabled={isLoading}
            />
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
    marginTop: '2%',
    marginBottom: '2%',
    width: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
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

export default SignupTsAndCs;
