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
import { selectFirstName, selectLastName, selectProfile, setName, } from '../../slices/profileSlice';
import { fnSetMyProfile } from '../../helpers/api';
import { errorAlert, okAlert } from '../../helpers/alerts';
import FilledButton from '../../components/FilledButton';

const EditProfileName = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const firstName = useSelector(selectFirstName);
  const lastName = useSelector(selectLastName);
  const [profileFirstName, setProfileFirstName] = React.useState(firstName);
  const [profileLastName, setProfileLastName] = React.useState(lastName);
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setProfileFirstName(firstName);
    setProfileLastName(lastName);
  }, [firstName, lastName]);

  const onBack = () => {
    navigation.goBack();
  };

  const onEditComplete = () => {
    console.log('edit')
    let newProfile = { ...profile }
    newProfile.first_name = profileFirstName;
    newProfile.last_name = profileLastName;
    fnSetMyProfile(newProfile)
      .then(() => {
        dispatch(
          setName({ first_name: profileFirstName, last_name: profileLastName }),
        );
        okAlert('Profile Updated', 'Name Updated');
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
          centerView={<NavigationHeaderText text="Name"/>}
        />
        <EditProfileInput
          ic={icon.setting_profile}
          placeholderText={'First Name'}
          value={profileFirstName}
          onChangeText={setProfileFirstName}
        />
        <EditProfileInput
          ic={icon.setting_profile}
          placeholderText={'Last Name'}
          value={profileLastName}
          onChangeText={setProfileLastName}
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
export default EditProfileName;
