import React from "react";

import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, } from "../../helpers/colors";


import { background, logo } from "../../helpers/assets";
import LinearGradient from "react-native-linear-gradient";
import FilledButton from "../../components/FilledButton";

const CONTENT_WIDTH = "84%";
const MainScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{ flex: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: 30,
            display: 'flex'
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: 'flex',
              flex: 4
            }}
          >
            <Image source={logo.youni_white} style={styles.logo} />
          </View>
          <View style={{ flexDirection: "column", width: CONTENT_WIDTH, flex: 1 }}>
            <FilledButton
              text="Sign up"
              onPress={() => {
                navigation.navigate("Signup");
              }}
            />
            <TouchableOpacity
              style={styles.hollowButton}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  hollowButton: {
    height: 60,
    marginHorizontal: 5,
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  filledButton: {
    height: 60,
    marginHorizontal: 5,
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: COLORS.purple,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 12.5,
    fontFamily: "BwModelica-Medium",
    fontWeight: '100'
  },

  logo: {
    // marginBottom: 200,
    resizeMode: "center",
    height:150,
    width:150,
    height:150,
    resizeMode:'contain',
    borderRadius:10
  },
});

export default MainScreen;
