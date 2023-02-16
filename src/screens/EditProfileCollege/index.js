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
import { selectJCR, selectProfile, setJCR } from '../../slices/profileSlice';
import { fnSetMyProfile } from '../../helpers/api';
import { errorAlert, okAlert } from '../../helpers/alerts';
import FilledButton from '../../components/FilledButton';

const EditProfileCollege = ({ navigation }) => {
  const college = useSelector(selectJCR);
  const profile = useSelector(selectProfile);
  const [profileCollege, setProfileCollege] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const onBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setProfileCollege(college);
  }, [college]);

  const onEditComplete = () => {
    let newProfile = { ...profile }
    newProfile.jcr = profileCollege;
    fnSetMyProfile(newProfile)
      .then(() => {
        dispatch(setJCR(profileCollege));
        okAlert('Profile Updated', 'College Updated');
      })
      .catch(error => {
        errorAlert('Error', "We’ve encountered a problem, try again later");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]}       style={{
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader
          leftButton={<NavigationBarButton icon={icon.back_chevron} onPress={onBack}/>}
          centerView={<NavigationHeaderText text="College"/>}
        />
        <EditProfileInput
          ic={icon.setting_school}
          placeholderText={'Your College'}
          value={profileCollege}
          onChangeText={setProfileCollege}
        />
        <FilledButton
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
export default EditProfileCollege;
