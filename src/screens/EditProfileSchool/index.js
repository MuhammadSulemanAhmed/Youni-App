import React, { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import SafeAreaView from 'react-native-safe-area-view';
import ScreenHeader from '../../components/ScreenHeader';
import NavigationBarButton from '../../components/NavigationBarButton';
import { icon } from '../../helpers/assets';
import { NavigationHeaderText } from '../../components/NavigationHeaderText';
import { StyleSheet } from 'react-native';
import HollowButton from '../../components/HollowButton';
import { contentWidth } from '../../helpers/dimensions';
import EditProfileInput from '../../components/EditProfileInput';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile, selectSchool, setSchool, } from '../../slices/profileSlice';
import { fnSetMyProfile } from '../../helpers/api';
import { errorAlert, okAlert } from '../../helpers/alerts';

const EditProfileSchool = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const school = useSelector(selectSchool);
  const [profileSchool, setProfileSchool] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setProfileSchool(school);
  }, [school]);

  const onBack = () => {
    navigation.goBack();
  };

  const onEditComplete = () => {
    let newProfile = { ...profile }
    newProfile.school = profileSchool;
    fnSetMyProfile(newProfile)
      .then(() => {
        dispatch(setSchool(profileSchool));
        okAlert('Profile Updated', 'University Updated');
      })
      .catch(error => {
        errorAlert('Error', "We’ve encountered a problem, try again later");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <LinearGradient
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      colors={['#122624', '#081515', '#020d0d']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader
          leftButton={<NavigationBarButton icon={icon.back} onPress={onBack}/>}
          centerView={<NavigationHeaderText text="University"/>}
        />
        <EditProfileInput
          ic={icon.setting_school}
          placeholderText={'Enter Your University'}
          value={profileSchool}
          onChangeText={setProfileSchool}
        />
        <HollowButton
          style={{ position: 'absolute', bottom: 0, width: contentWidth }}
          text={'SAVE'}
          onPress={onEditComplete}
          disabled={isLoading}
        />
      </SafeAreaView>
      <SafeAreaView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({});
export default EditProfileSchool;
