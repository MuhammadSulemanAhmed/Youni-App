import "react-native-gesture-handler";
import React, { useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import ForgetPassword from "../screens/ForgetPassword";
import { AsyncStorage } from 'react-native'
import MainScreen from "../screens/MainScreen";
import Signup from "../screens/Signup";
import SignupName from "../screens/SignupName";
import SignupProfilePic from "../screens/SignupProfilePic";
import SignupInterest from "../screens/SignupInterest";
import SignupClubs from "../screens/SignupClubs";
import SignupTsAndCs from "../screens/SignupTsAndCs";
import SignupCompleted from "../screens/SignupCompleted";
import createBottomTabNavigator from "@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator";
import TabHome from "../screens/TabHome";
import TabMyLife from "../screens/TabMyLife";
import TabMessage from "../screens/TabMessage";
import TabWallet from "../screens/TabWallet";
import TabProfile from "../screens/TabProfile";
import Splash from "../screens/Splash";
import { AuthContext } from "./context";
import { TabIcon } from "../components/TabIcon";
import { COLORS } from "../helpers/colors";
import BrowseByCategory from "../screens/BrowseByCategory";
import EventDetails from "../screens/EventDetails";
import SocietyDetails from "../screens/SocietyDetails";
import ProfileSettings from "../screens/ProfileSettings";
import EditProfileCollege from "../screens/EditProfileCollege";
import EditProfileName from "../screens/EditProfileName";
import EditProfilePassword from "../screens/EditProfilePassword";
import EditProfilePicture from "../screens/EditProfilePicture";
import EditProfileSchool from "../screens/EditProfileSchool";
import SearchFilter from "../screens/SearchFilter";
import {
  fnGetChatRooms,
  fnGetMyProfile,
  fnLogout,
  fnGetUserImages,
  fnGetProfileSocietiesNode,
  fnAddUserFCMTOKEN
} from "../helpers/api";
import { useDispatch } from "react-redux";
import { setPhotos, setProfile } from "../slices/profileSlice";
import { setMySocieties } from "../slices/mySocietiesSlice";
import SearchFilterResults from "../screens/SearchFilterResults";
import ChatMessaging from "../screens/ChatMessaging";
import EditProfileInterest from "../screens/EditProfileInterest";
import { errorAlert } from "../helpers/alerts";
import { setChatrooms } from "../slices/myChatRoomSlice";
import EventTicketSelection from "../screens/EventTicketSelection";
import EventTicketPurchase from "../screens/EventTicketPurchase";
import EventTicketSummary from "../screens/EventTicketSummary";
import SignupSubject from "../screens/SignupSubject";
import { tabIcon } from "../helpers/assets";
import HostHelper from "../screens/HostHelper";
import messaging from "@react-native-firebase/messaging";

const RootStack = createStackNavigator();
const RootStackScreen = ({ isLoggedIn, initialRoute }) => (

  <RootStack.Navigator headerMode="none" >
    {isLoggedIn ? (
      <RootStack.Screen
        name="App"
        component={AppScreens}
        options={{
          animationEnabled: false,
        }}
      />
    ) : (
      <RootStack.Screen
        name="Auth"
        component={AuthScreens}
        options={{
          animationEnabled: false,
        }}
      />
    )}
  </RootStack.Navigator>
);

const AuthStack = createStackNavigator();
const AuthScreens = () => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen name="MainScreen" component={MainScreen} />
    <AuthStack.Screen name="Signup" component={Signup} />
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="forgot" component={ForgetPassword} />
    <AuthStack.Screen name="SignupName" component={SignupName} />
    <AuthStack.Screen name="SignupSubject" component={SignupSubject} />
    <AuthStack.Screen name="SignupProfilePic" component={SignupProfilePic} />
    <AuthStack.Screen name="SignupInterest" component={SignupInterest} />
    <AuthStack.Screen name="SignupClubs" component={SignupClubs} />
    <AuthStack.Screen name="SignupTsAndCs" component={SignupTsAndCs} />
    <AuthStack.Screen name="SignupCompleted" component={SignupCompleted} />
  </AuthStack.Navigator>
);

const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator
    headerMode="none"
    tabBarOptions={{
      showLabel: true,
      activeTintColor: COLORS.purple,
      inactiveTintColor: "#ffffff",
      style: {
        backgroundColor: "black",
        elevation: 0,
        borderTopWidth: 0,
        position: "absolute",
        paddingTop: 10,        
        margin: 5,
      },
    }}
  >
    <Tabs.Screen
      name="DISCOVER"
      component={HomeTabScreens}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <TabIcon icon={tabIcon.tab_home} size={23} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="MY LIFE"
      component={MyLifeTabScreens}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <TabIcon icon={tabIcon.tab_ticket} size={23} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="WALLET"
      // component={TabMessage}
      component={TabWallet}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <TabIcon icon={tabIcon.tab_wallet} size={23} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="PROFILE"
      component={ProfileTabScreens}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <TabIcon icon={tabIcon.tab_profile} size={23} style color={color} />
        ),
      }}
    />
  </Tabs.Navigator>
);

const AppStack = createStackNavigator();
const AppScreens = () => (
  <AppStack.Navigator headerMode="none" >
    <AppStack.Screen name="TabScreens" component={TabsScreen} />
    <AppStack.Screen name="BrowseByCategory" component={BrowseByCategory} />
    <AppStack.Screen name="SocietyDetails" component={SocietyDetails} />
    <AppStack.Screen name="EditProfileCollege" component={EditProfileCollege} />
    <AppStack.Screen name="HostHelper" component={HostHelper} />
    <AppStack.Screen name="EditProfileName" component={EditProfileName} />
    <AppStack.Screen name="TabMessage" component={TabMessage} />
    <AppStack.Screen
      name="EditProfilePassword"
      component={EditProfilePassword}
    />
    <AppStack.Screen name="EditProfilePicture" component={EditProfilePicture} />
    <AppStack.Screen name="EditProfileSchool" component={EditProfileSchool} />
    <AppStack.Screen
      name="EditProfileInterest"
      component={EditProfileInterest}
    />
    <AppStack.Screen name="SearchFilter" component={SearchFilter} />
    <AppStack.Screen
      name="SearchFilterResults"
      component={SearchFilterResults}
    />
    <AppStack.Screen name="ChatMessaging" component={ChatMessaging} />
    <AppStack.Screen name="EventStack" component={EventScreens} />
  </AppStack.Navigator>
);

const HomeTabStack = createStackNavigator();
const HomeTabScreens = () => (
  <HomeTabStack.Navigator headerMode="none">
    <HomeTabStack.Screen name="TabHome" component={TabHome} />
  </HomeTabStack.Navigator>
);

const MyLifeTabStack = createStackNavigator();
const MyLifeTabScreens = () => (
  <MyLifeTabStack.Navigator headerMode="none">
    <MyLifeTabStack.Screen name="TabMyLife" component={TabMyLife} />
  </MyLifeTabStack.Navigator>
);

const MessageTabStack = createStackNavigator();
const MessageTabScreens = () => (
  <MessageTabStack.Navigator headerMode="none">
    <MessageTabStack.Screen name="TabMessage" component={TabMessage} />
  </MessageTabStack.Navigator>
);

const ProfileTabStack = createStackNavigator();
const ProfileTabScreens = () => (
  <ProfileTabStack.Navigator headerMode="none">
    <ProfileTabStack.Screen name="TabProfile" component={TabProfile} />
    <ProfileTabStack.Screen
      name="ProfileSettings"
      component={ProfileSettings}
    />
  </ProfileTabStack.Navigator>
);

const EventStack = createStackNavigator();
const EventScreens = () => (
  <EventStack.Navigator headerMode={"none"}>
    <EventStack.Screen name="EventDetails" component={EventDetails} />
    <EventStack.Screen
      name="EventTicketSelection"
      component={EventTicketSelection}
    />
    <EventStack.Screen
      name="EventTicketPurchase"
      component={EventTicketPurchase}
    />
    <EventStack.Screen
      name="EventTicketSummary"
      component={EventTicketSummary}
    />
  </EventStack.Navigator>
);
const checkApplicationPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('User has notification permissions enabled.');
    return await messaging().getToken()


  } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    console.log('User has provisional notification permissions.');
    return await messaging().getToken()
  } else {
    console.log('User has notification permissions disabled');
  }
}
const Navigation = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const dispatch = useDispatch();
  // const navigation = useNavigation();

  const authContext = React.useMemo(() => {
    return {
      signIn: async () => {
        let jwtTOken = await AsyncStorage.getItem('token', null)
        if (jwtTOken !== null) {
         
         
        // On Sign in get profile information and chat information.
        fnGetMyProfile(jwtTOken)
          .then(async (response) => {
            dispatch(setProfile(response.data.user[0]));
            // console.log(response.data.user[0].id)
            fnGetProfileSocietiesNode(response.data.user[0].id)
              .then((response) => {
                response
                  .json()
                  .then((json) => dispatch(setMySocieties(json.data)));
              })
              .catch((error) => {
                errorAlert(
                  "Error",
                  "We’ve encountered a problem, try again later Socitoes Node"
                );
              });
            let token = await checkApplicationPermission()
            // try {
            //    token = await messaging().getToken()
            // } catch (error) {
            console.log(token)
            // }

            // alert(token)
            //   try {
            //     let token = await messaging().getToken()
            fnAddUserFCMTOKEN(response.data.user[0].id, jwtTOken)
              .then((response) => {
                // console.log("token", response)
              })
              .catch((error) => {
                errorAlert(
                  "Error",
                  "We’ve encountered a problem, try again later fcmtoken"
                );
              });
            fnGetChatRooms(response.data.user[0].id)
              .then(async (response) => {
                let dat = await response.json()
                // let data = dat.data.length>0 || [];
                // console.log("chat", JSON.stringify(dat.data))
                dispatch(setChatrooms(dat.data));
              })
              .catch((error) => {
                console.log(error)
                errorAlert(
                  "Errorhv",
                  "We’ve encountered a problem, try again later chat rooms"
                );
              });

            const imgsResponse = await fnGetUserImages(response.data.user[0].id);
            console.log(imgsResponse)
            // return
            try {
              if (imgsResponse) {
                const images = await imgsResponse.json();
                dispatch(
                  setPhotos(
                    images.data.length > 0
                      ? images.data.map((img) => img.image)
                      : []
                  )
                );
              }
            }
            catch (error) {
              errorAlert(
                "Error",
                "We’ve encountered a problem, try again later get user images"
              );
            }
            setIsLoading(false);
            setIsLoggedIn(true);
          })
          .catch((error) => {
            if (error?.response?.status === 401) {
              authContext.signOut();
            }
          });
        }else{
          authContext.signOut()
        }
      },
      // signUp: () => {
      //     setIsLoading(false);
      //     setIsLoggedIn(true);
      // },
      signOut: async (props) => {
        await AsyncStorage.clear()
        // alert(JSON.stringify(props))
        fnAddUserFCMTOKEN(props, "token")
          .then((response) => {
            console.log(response)
          })
          .catch((error) => {

          });
        fnLogout()
          .then(() => { })
          .catch(() => { });
        setIsLoading(false);
        setIsLoggedIn(false);
      },
    };
  }, []);

  React.useEffect(() => {
    authContext.signIn();
    // authContext.signOut()
    // setIsLoading(false);
    // setIsLoggedIn(false);
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer >
        <RootStackScreen isLoggedIn={isLoggedIn} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default Navigation;
