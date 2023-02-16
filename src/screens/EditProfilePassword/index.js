import React from 'react';
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
import { fnSetPassword } from '../../helpers/api';
import { errorAlert, okAlert } from '../../helpers/alerts';
import FilledButton from '../../components/FilledButton';

const EditProfilePassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [rePassword, setRePassword] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);

  const onBack = () => {
    navigation.goBack();
  };

  const onEditComplete = () => {
    if (newPassword !== rePassword) {
      alert('New passwords does not match.');
      return;
    }
    fnSetPassword(newPassword.toString(),oldPassword)
      .then((res) => {
        if(res.data.success !== "false"){
          console.log(res.data)
          okAlert('Profile Updated', 'Password Updated');
        }else{
          console.log(res.data)
          okAlert('Password change error', res.data.message);
        }
       
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
          showDivider={false}
          leftButton={<NavigationBarButton icon={icon.back_chevron} onPress={onBack}/>}
          centerView={<NavigationHeaderText text="Password"/>}
        />
        <EditProfileInput
          ic={icon.setting_password}
          placeholderText={'Old Password'}
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={true}
        />
        <EditProfileInput
          ic={icon.setting_password}
          placeholderText={'New Password'}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={true}
        />
        <EditProfileInput
          ic={icon.setting_password}
          placeholderText={'Re-Enter New Password'}
          value={rePassword}
          onChangeText={setRePassword}
          secureTextEntry={true}
        />
        <FilledButton
              style={{ position: 'absolute', bottom: 0, width: contentWidth }}
              text={"Save"}
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
export default EditProfilePassword;
