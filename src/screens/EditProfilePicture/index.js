import React, { useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SafeAreaView from 'react-native-safe-area-view';
import ScreenHeader from '../../components/ScreenHeader';
import NavigationBarButton from '../../components/NavigationBarButton';
import { icon, placeholderImages } from '../../helpers/assets';
import { Image, AsyncStorage, ActivityIndicator, View } from 'react-native';
import HollowButton from '../../components/HollowButton';
import { contentWidth } from '../../helpers/dimensions';
import { COLORS } from '../../helpers/colors';
import { useDispatch, useSelector } from 'react-redux';
import { fnGetImageURL, fnSetProfilePicture, fnGetMyProfile, fnUpdateProfilePictureURL } from '../../helpers/api';
import { errorAlert } from '../../helpers/alerts';
import ImagePicker from 'react-native-image-crop-picker/index';
import { selectPicture, setPicture, selectProfileId } from '../../slices/profileSlice';
import ActionSheet from "@alessiocancian/react-native-actionsheet";
import FilledButton from '../../components/FilledButton';
import { NavigationHeaderText } from '../../components/NavigationHeaderText';

const EditProfilePicture = ({ navigation }) => {
  const myPicture = useSelector(selectPicture);
  const profileId = useSelector(selectProfileId);


  const [profileImage, setImage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setImage(myPicture);
  }, [myPicture]);

  const onBack = () => {
    navigation.goBack();
  };

  const onEditComplete = () => {
    // dispatch(setName(password))
  };

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
    }).then((res) => uploadGalleryImage(res, false));
  };

  const onCameraPress = () => {
    ImagePicker.openCamera({
      width: 700,
      height: 700,
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
      includeExif: true,
    }).then((res) => uploadGalleryImage(res, true));
  };

  const uploadGalleryImage = async (image, fromCamera) => {
    // setImage(image)
    // console.log('uri', image);
    // return
    // console.log('mime', image.mime);
    // console.log('name', image.name);
    const photo = {
      "url": fromCamera ? image.path : image.path,
      "user_id": profileId,
      uri: image.path,
      type: image.mime,
      name: 'profile.jpeg',
    };
    console.log(photo)
    // return
    setLoading(true)
    console.log(photo)
    const imageData = new FormData();
    imageData.append('file', {
      uri: image.path,
      type: image.mime,
      name: image.filename,
    });
    console.log(imageData)
    fnSetProfilePicture(imageData)
      .then(async response => {
        let json = await response.json()
        console.log(json.data)
        // return
        let jwtTOken = await AsyncStorage.getItem('token', null)
        fnUpdateProfilePictureURL(jwtTOken, {
          "url": json.data[0]
        })
          .then(async (res) => {
            let json = await res.json()
            console.log("====>", json)
            let profileImageId = json.data[0].avatar_url;
            console.log(json.data[0].avatar_url)
            setImage(profileImageId);
            dispatch(setPicture(profileImageId));
            setLoading(false)
          })
        // On Sign in get profile information and chat information.
        // fnGetMyProfile(jwtTOken,json.data[0])
        //   .then(async (user) => {
        //     console.log(user.data.user[0].avatar_url)
        //     let profileImageId = user.data.user[0].avatar_url;
        //     console.log(user.data.user[0].avatar_url)
        //     setImage(profileImageId);
        //     dispatch(setPicture(profileImageId));
        //   })

      })
      .catch(error => {
        console.log(error)
        // errorAlert('Error', "We’ve encountered a problem, try again later");
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

  const actionSheet = useRef(null);
  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} locations={[0, 0.8, 1]} style={{
      flex: 1,
      width: "100%",
      height: "100%",
      alignItems: "center",
    }}>
      <Image style={{ height: 100, width: 100, borderRadius: 100, marginBottom: 20, marginTop: 75, backgroundColor: COLORS.purple }} source={profileImage ? { uri: profileImage } : placeholderImages.profile_banner_placeholder} />
      {loading ?
        <View
          style={{
            marginTop: 40
          }}
        >
          <ActivityIndicator color={COLORS.purple} />
        </View>
        :
        <FilledButton
          style={{ width: contentWidth }}
          textStyle={{ color: COLORS.white }}
          text={'CHANGE PROFILE PHOTO'}
          onPress={onEditPhotoPress}
        />
      }
      <ScreenHeader
        style={{ position: 'absolute', top: 0, marginTop: 0 }}
        leftButton={<NavigationBarButton icon={icon.back_chevron} onPress={onBack} />}
        centerView={<NavigationHeaderText text="Profile Picture" />}
        showDivider={false}
      />

      {/* <SafeAreaView style={{ position: 'absolute', bottom: 0 }}>
        <HollowButton
          style={{ width: contentWidth }}
          text={'SAVE'}
          onPress={onEditComplete}
        />
      </SafeAreaView> */}

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

export default EditProfilePicture;
