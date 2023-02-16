import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Keyboard, SafeAreaView, StyleSheet, Text, View, TouchableWithoutFeedback,AsyncStorage} from 'react-native';
import SignupInput from '../../components/SignupInput';
import { COLORS } from '../../helpers/colors';
import LinearGradient from 'react-native-linear-gradient';
import HollowButton from '../../components/HollowButton';
import { logo } from '../../helpers/assets';
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

const SignupName = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const [profileFirstName, setProfileFirstName] = React.useState('');
  const [profileLastName, setProfileLastName] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const refSlideContainerY = useRef(new Animated.Value(0.0)).current;
  const [remainingHeight, setRemainingHeight] = useState(0)
  const [statusTitle, setStatusTitle] = useState('Your name')
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

    if (profileFirstName === '' || profileLastName === '') {
      errorAlert(
        'Empty Fields',
        'Please complete all field before proceeding.',
      );
      return;
    }
    setLoading(true);
    fnCreateAccount(
      profile.email,
      profile.password,
      profileFirstName,
      profileLastName,
      '',
    )
      .then(async response => {
        console.log(response.data.success)
        if(response.data.success!=='false'){
          await AsyncStorage.setItem("token",response.data.auth_token)
          const profile = response.data.user[0];
          navigation.navigate('SignupSubject');
          dispatch(setProfile(profile));
        }else{
          alert(response.data.message)
        }
        return
       
      })
      .catch(error => {
        errorAlert('Error', "We’ve encountered a problem, try again later");
      })
      .finally(() => {
        setLoading(false);
      });
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
          <HeaderSignup title={statusTitle} handleBackPress={handleBackPress} canGoBack={false} percentage={0} />
          <View style={{ alignItems: 'center' }}>
              <Text
                style={styles.headerText}
                numberOfLines={2}
              >Enter your name..</Text>
              <Text
                style={styles.bodyText}
                numberOfLines={2}
              >Please enter your first and last name.</Text>
            <SignupInput
              titleText="First Name"
              placeholderText="Your First Name"
              value={profileFirstName}
              onChangeText={setProfileFirstName}
            />
            <SignupInput
              titleText="Last Name"
              placeholderText="Your Last Name"
              value={profileLastName}
              onChangeText={setProfileLastName}
            />
          </View>
          <FilledButton
              width={wp("84%")}
              text={"Next"}
              onPress={onNextPress}
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
    width: '0%',
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
  }
});

export default SignupName;
