import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { background, logo } from "../../helpers/assets";

const Splash = ({navigation}) => {
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
          }}
        >
          <View
            style={{
              flex: 1,
              position: "absolute",
              top: 250,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={logo.youni_white} style={styles.logo} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 175,
    resizeMode: 'contain',
    borderRadius:10

  },
});
export default Splash;
