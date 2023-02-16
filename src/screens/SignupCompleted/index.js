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
import { AuthContext } from '../../navigation/context';

const SignupCompleted = ({ navigation }) => {
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const refSlideContainerY = useRef(new Animated.Value(0.0)).current;
  const [remainingHeight, setRemainingHeight] = useState(0)
  const [statusTitle, setStatusTitle] = useState('')
  const translateView = (ref, value) => {
    return Animated.timing(ref, {
      toValue: value,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const { signIn } = React.useContext(AuthContext);

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
    signIn()
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
      <SafeAreaView style={{ flex: 1, alignItems: 'center', height: '100%' }}>
        <HeaderSignup title={statusTitle} handleBackPress={handleBackPress} canGoBack={false} percentage={0} />
        <View style={{flex: 5}}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: refSlideContainerY,
              },
            ],
            width: '100%',
            height: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
              <Text
                style={styles.headerText}
                numberOfLines={2}
              >Welcome to</Text>
              <Text
                style={styles.headerSubText}
                numberOfLines={2}
              >Oxford's CommYounity</Text>
          </View>
        </Animated.View>
        <View
          style={{ flex: 1 }}
          onLayout={event => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setRemainingHeight(height)
          }}
        />
        </View>
        <View style={{ justifyContent: 'flex-end', alignSelf: 'center', flex: 1 }}>
          <FilledButton
              width={wp("84%")}
              text={"Finish"}
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
    textAlign: 'center',
    fontSize: 20,
  },
  headerSubText: {
    color: "white",
    width: 300,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
  },
  bodyText: {
    color: "white",
    width: 300,
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'grey'
  }
});

export default SignupCompleted;
