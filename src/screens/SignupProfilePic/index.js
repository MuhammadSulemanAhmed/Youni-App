import React, { useRef, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableHighlight, View,AsyncStorage } from 'react-native';
import { COLORS } from '../../helpers/colors';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../../helpers/fonts';
import ImagePicker from 'react-native-image-crop-picker';
import HollowButton from '../../components/HollowButton';
import { icon, logo, placeholderImages } from '../../helpers/assets';
import { fnGetImageURL, fnSetProfilePicture ,fnUpdateProfilePictureURL} from '../../helpers/api';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile, setPicture } from '../../slices/profileSlice';
import { errorAlert } from '../../helpers/alerts';
import ActionSheet from "@alessiocancian/react-native-actionsheet";
import HeaderSignup from '../../components/HeaderSignup';
import FilledButton from '../../components/FilledButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SignupProfilePic = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const [profileImage, setImage] = React.useState(null);
  const dispatch = useDispatch();
  const [statusTitle, setStatusTitle] = useState('Your Photo')
  const actionSheet = useRef(null);

  const onEditPhotoPress = () => {
    actionSheet.current.show()
  };

  const onGalleryPress = () => {
    ImagePicker.openPicker({
      width: 700,
      height: 700,
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
      includeExif: true,
    }).then(uploadGalleryImage);
  };

  const onCameraPress = () => {
    ImagePicker.openCamera({
      width: 700,
      height: 700,
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
      includeExif: true,
    }).then(uploadGalleryImage);
  };

  const uploadGalleryImage = image => {
    // setImage(image)
    // console.log('uri', image.path);
    // console.log('mime', image.mime);
    // console.log('name', image.name);
    const photo = {
      uri: image.path,
      type: image.mime,
      name: 'profile.jpeg',
    };
    const imageData = new FormData();
    imageData.append('file', {
      uri: image.path,
      type: image.mime,
      name: image.filename,
    });
    fnSetProfilePicture(imageData)
      .then(async response => {
        let json = await response.json()        
        // return
        let jwtTOken = await AsyncStorage.getItem('token', null)
        fnUpdateProfilePictureURL(jwtTOken, {
          "url": json.data[0]
        })
          .then(async (res) => {
            let json = await res.json()
            let profileImageId = json.data[0].avatar_url;
            // console.log(json.data[0].avatar_url)
            // let profileImageId = response.data.data.file_path;
            setImage(profileImageId);
            dispatch(setPicture(profileImageId));
            // setLoading(false)
          })
       
      })
      .catch(error => {
        errorAlert('Error', "We’ve encountered a problem, try again later");
      });
  };

  const uploadCameraImage = image => {
    // console.log('uri', image.path);
    // console.log('mime', image.mime);
    // console.log('name', image.name);
    const photo = {
      uri: image.path,
      type: image.mime,
      name: 'profile.jpeg',
    };
    const imageData = new FormData();
    imageData.append('uploadfile', photo);
    fnSetProfilePicture(imageData)
      .then(response => {
        let profileImageId = response.data.data.file_path;
        setImage(fnGetImageURL(profileImageId));
        dispatch(setPicture(profileImageId));
      })
      .catch(error => {
        errorAlert('Error', "We’ve encountered a problem, try again later");
      });
  };

  const handleBackPress = () => {
    navigation.navigate('SignupSubject');
  }

  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{ flex: 1}}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
      <HeaderSignup title={statusTitle} handleBackPress={handleBackPress} canGoBack={false} percentage={40} />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.titleText}>ADD PHOTO</Text>
          <TouchableHighlight onPress={onEditPhotoPress}>
            <View>
              <Image
                source={
                  profileImage === null
                    ? placeholderImages.profile_pic_placeholder
                    : { uri: profileImage }
                }
                style={styles.profilePic}
              />
              <Image
                source={icon.profile_image_plus}
                style={{
                  display: profileImage === null ? 'flex' : 'none',
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  borderRadius: 24,
                  resizeMode: 'contain',
                  top: 10,
                  right: 0,
                }}
              />
            </View>
          </TouchableHighlight>
        </View>
        <View
          style={{ flex: 1, justifyContent: 'flex-end', alignSelf: 'center' }}>
            <FilledButton
              width={wp("84%")}
              text={"Next"}
              onPress={() => {
                navigation.navigate('SignupInterest');
              }}
            />
        </View>
      </SafeAreaView>
      <ActionSheet
        ref={actionSheet}
        title={'Upload Image'}
        options={['Gallery', 'Camera', 'Cancel']}
        cancelButtonIndex={2}
        onPress={index => {
          if (index === 0) {
            onGalleryPress();
          } else if (index === 1) {
            onCameraPress();
          }
        }}
      />
    </LinearGradient>
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
  titleText: {
    marginBottom: 15,
    fontFamily: FONTS.bwBold,
    fontSize: 13,
    color: COLORS.white,
    textAlign: 'left',
    width: '80%'
  },
  profilePic: {
    width: 220,
    height: 220,
    borderRadius: 110,
    resizeMode: 'cover',
    backgroundColor: '#1a3130',
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
    width: '40%',
    backgroundColor: '#528d89',
  },
});
export default SignupProfilePic;
