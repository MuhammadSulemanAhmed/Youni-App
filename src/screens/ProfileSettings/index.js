import React, { useCallback, useState } from "react";
import { Alert, Image, Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaView from "react-native-safe-area-view";
import ScreenHeader from "../../components/ScreenHeader";
import { COLORS } from "../../helpers/colors";
import { FONTS } from "../../helpers/fonts";
import NavigationBarButton from "../../components/NavigationBarButton";
import { icon } from "../../helpers/assets";
import { NavigationHeaderText } from "../../components/NavigationHeaderText";
import { contentWidth, windowWidth } from "../../helpers/dimensions";
import { AuthContext } from "../../navigation/context";
import { NavBarShadow } from "../../components/NavBarShadow";
import { useSelector } from "react-redux";
import { selectProfile } from "../../slices/profileSlice";
import FilledButton from "../../components/FilledButton";
import { fnDeleteUser } from "../../helpers/api";
const SettingItem = ({ ic, text, onPress, useTopRadius, useBottomRadius }) => {
  return (
    <TouchableOpacity
      style={[styles.settingItemContainer, useTopRadius && styles.topContainerItem, useBottomRadius && styles.bottomContainerItem]}
      onPress={() => {
        onPress();
      }}
    >
      <Image style={{ marginLeft: 25, width: 20, height: 20 }} source={ic}/>
      <Text
        style={{
          marginLeft: 20,
          fontFamily: FONTS.bwBold,
          fontSize: 16,
          color: "#cfd0d0",
        }}
      >
        {text}
      </Text>
      <Image
        style={{ position: "absolute", right: 20, width: 20, height: 20 }}
        source={icon.right_arrow}
      />
    </TouchableOpacity>
  );
};

const NotificationItem = ({ text, switchValue, onSwitch, useTopRadius, useBottomRadius }) => {
  return (
    <View style={[styles.settingItemContainer, useTopRadius && styles.topContainerItem, useBottomRadius && styles.bottomContainerItem]}>
      <Text
        style={{
          marginLeft: 20,
          fontFamily: FONTS.bwBold,
          fontSize: 16,
          color: "#cfd0d0",
        }}
      >
        {text}
      </Text>
      <Switch
        value={switchValue}
        thumbColor={COLORS.white}
        ios_backgroundColor={switchValue ? "#2e4645" : "#d9bf71"}
        trackColor={{ true: COLORS.purple, false: "#33343E" }}
        style={{
          position: "absolute",
          right: 20,
          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        }}
        onValueChange={(value) => {
          console.log(value);
          onSwitch(value);
        }}
      />
    </View>
  );
};

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
    <SettingItem useBottomRadius ic={ic} text={"Youni Website"} onPress={handlePress}/>
  );
};

const ProfileSettings = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  const [newEventNotif, setNewEventNotif] = useState(true);
  const [recommendEventNotif, setRecommendEventNotif] = useState(true);
  const [ticketRunningNotif, setTicketRunningNotif] = useState(true);
  const [newMessageNotif, setNewMessageNotif] = useState(true);
  const profile = useSelector(selectProfile);
  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{ width: '100%', height: '100%'}}>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: "never" }}>
        <ScreenHeader          
          showDivider={false}
          leftButton={
            <NavigationBarButton              
              icon={icon.back_chevron} 
              onPress={() => {
                navigation.goBack();
              }}
            />
          }
          centerView={<NavigationHeaderText text="SETTINGS"/>}
        />
        <ScrollView
          style={{ flex: 1, borderColor: "blue" }}
          showsVerticalScrollIndicator={false}          
        >
          <SettingItem
            ic={icon.setting_password}
            text={"Password"}
            useTopRadius
            onPress={() => {
              navigation.navigate("EditProfilePassword");
            }}
          />
          <SettingItem
            ic={icon.setting_profile}
            text={"Name"}
            onPress={() => {
              navigation.navigate("EditProfileName");
            }}
          />
          <SettingItem
            ic={icon.setting_profile}
            text={"Profile Picture"}
            onPress={() => {
              navigation.navigate("EditProfilePicture");
            }}
          />
          {/*<SettingItem ic={icon.setting_school} text={'University'} onPress={() => {*/}
          {/*    navigation.navigate('EditProfileSchool')*/}
          {/*}}/>*/}
          <SettingItem
            ic={icon.setting_school}
            text={"College"}
            onPress={() => {
              navigation.navigate("EditProfileCollege");
            }}
          />
          <SettingItem
            ic={icon.setting_interest}
            text={"Interest"}
            onPress={() => {
              navigation.navigate("EditProfileInterest");
            }}
          />
          <OpenURLButton
            useBottomRadius
            ic={icon.setting_website}
            url={"https://www.thisisyouni.co.uk"}
          >
            Youni Website
          </OpenURLButton>
          {/* <SettingItem
            ic={icon.setting_sign_out}
            useBottomRadius
            text={"Sign Out"}
            onPress={() => {
              signOut(profile.id)
            }}
          /> */}
          {/* <SettingItem
            text={"Host Helper"}
            useBottomRadius
            onPress={() => {
              navigation.navigate("HostHelper");
            }}
          /> */}

          <Text
            style={{
              paddingVertical: 15,
              width: windowWidth,
              textAlign: "center",
              fontFamily: FONTS.bwBlack,
              fontSize: 14,
              color: COLORS.white,
            }}
          >
            NOTIFICATION
          </Text>
          <NotificationItem
            text={"New Events"}
            switchValue={newEventNotif}
            useTopRadius
            onSwitch={(value) => {
              setNewEventNotif(value);
            }}
          />
          <NotificationItem
            text={"Recommended Events"}
            switchValue={recommendEventNotif}
            onSwitch={(value) => {
              setRecommendEventNotif(value);
            }}
          />
          <NotificationItem
            text={"Ticket Running Out"}
            switchValue={ticketRunningNotif}
            onSwitch={(value) => {
              setTicketRunningNotif(value);
            }}
          />
          <NotificationItem
            text={"New Messages"}
            switchValue={newMessageNotif}
            useBottomRadius
            onSwitch={(value) => {
              setNewMessageNotif(value);
            }}
          />
          <View style={{ height: 80 }}/>
          <FilledButton
            style={{ marginTop: -70, width: contentWidth }}
            text={"Signout"}
            onPress={() => {
              signOut(profile.id)
            }}            
          />
          <FilledButton
            style={{ width: contentWidth, backgroundColor: 'red' }}
            text={"Delete Account"}
            onPress={() => {
                  Alert.alert(
                    "Delete Account",
                    "Are you sure you was to delete your account?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "Delete Account", onPress: () => {
                        fnDeleteUser(profile.email)
                        .then(async (response) => {
                          signOut(profile.id)
                        })
                        .catch((error) => {
                          signOut(profile.id)
                          errorAlert(
                            "Unable to delete user",
                            "Please contact support."
                          );
                        })
                      }}
                    ]
                  );
            }}            
          />
          <View
          style={{
            height:200,
            width:200
          }}
          ></View>
        </ScrollView>
      </SafeAreaView>
      {/* <NavBarShadow/> */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  settingItemContainer: {
    width: '95%',    
    marginHorizontal: 10,
    height: 50,
    backgroundColor: '#1D1E29',
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  topContainerItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomContainerItem: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  }
});
export default ProfileSettings;
