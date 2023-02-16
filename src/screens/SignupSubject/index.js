import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Keyboard, SafeAreaView, StyleSheet, View,TouchableWithoutFeedback, Text, TextInput } from 'react-native';
import SignupInput from '../../components/SignupInput';
import { COLORS } from '../../helpers/colors';
import LinearGradient from 'react-native-linear-gradient';
import HollowButton from '../../components/HollowButton';
import { logo } from '../../helpers/assets';
import { useDispatch, useSelector } from 'react-redux';
import { errorAlert } from '../../helpers/alerts';
import { fnSetMyProfile } from "../../helpers/api";
import { selectProfile, setJCR } from "../../slices/profileSlice";
import HeaderSignup from '../../components/HeaderSignup';
import FilledButton from '../../components/FilledButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import MaskInput, { Masks } from 'react-native-mask-input';
import { FONTS } from '../../helpers/fonts';

const SignupSubject = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const [profileCollege, setProfileCollege] = React.useState('');
  const [profileSubject, setProfileSubject] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const refSlideContainerY = useRef(new Animated.Value(0.0)).current;
  const [remainingHeight, setRemainingHeight] = useState(0)
  const [statusTitle, setStatusTitle] = useState('Your College')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
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
    if (profileCollege === '' || profileSubject === '') {
      errorAlert(
        'Empty Fields',
        'Please complete all field before proceeding.',
      );
      return;
    }
    setLoading(true);
    let newProfile = { ...profile }
    newProfile.jcr = profileCollege;
    fnSetMyProfile(newProfile)
      .then(() => {
        navigation.navigate('SignupProfilePic');
        dispatch(setJCR(profileCollege));
      })
      .catch(error => {
        errorAlert('Error', "We’ve encountered a problem, try again later");
      })
      .finally(() => {
        setLoading(false);
      });
    // dispatch(setProfile(profile));
  };

  const handleBackPress = () => {
    navigation.navigate("SignupName");
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
            width: '100%'
          }}>
          <HeaderSignup title={statusTitle} handleBackPress={handleBackPress} canGoBack={false} percentage={20} />
          <View style={{ alignItems: 'center' }}>
              <Text
                style={styles.headerText}
                numberOfLines={2}
              >Enter your college information</Text>
            <SignupInput
              titleText="College"
              placeholderText="Enter Your College"
              value={profileCollege}
              onChangeText={setProfileCollege}
            />
            <SignupInput
              titleText="Subject"
              placeholderText="Your College Subject"
              value={profileSubject}
              onChangeText={setProfileSubject}
            />
            <View style={styles.dateWrapper}>
              <View style={styles.dateSection}>
                <SignupInput
                  keyboardType="number-pad"
                  style={{width: wp('40%')}}
                  titleText="Start Year"
                  placeholderText="Year"
                  value={startYear}
                  onChangeText={setStartYear}
                  maxLength={4}
                />
              </View>
              <View style={styles.dateSection}>
                <View style={styles.dateSection}>
                  <SignupInput
                    keyboardType="number-pad"
                    style={{width: wp('40%')}}
                    titleText="Grad Year"
                    placeholderText="Year"
                    value={endYear}
                    onChangeText={setEndYear}
                    maxLength={4}
                  />
                </View>
              </View>
            </View>
            
          </View>
          <FilledButton
              width={wp("84%")}
              text={"Next"}
              onPress={onNextPress}
              disabled={isLoading}
            />
        </Animated.View>
        <View
          style={{ flex: 1 }}
          onLayout={event => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setRemainingHeight(height)
          }}
        />
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
  progressBar: {
    backgroundColor: '#0c1b1a',
    width: 330,
    height: 12,
    marginBottom: 40,
    marginTop: 16,
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressFill: {
    flex: 1,
    width: '20%',
    backgroundColor: '#528d89',
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
  },
  dateInput: {
    color: COLORS.white,
    backgroundColor: "#0b1918",
    width: wp("40%"),
    height: 60,
    borderRadius: 13,
    fontFamily: FONTS.bwRegular,
    fontSize: 15,
    paddingHorizontal: 10,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.bwBold,
    fontSize: 12.5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dateWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: wp("84%")
  },
  dateSection: {
    flex: 1
  }
});

export default SignupSubject;
