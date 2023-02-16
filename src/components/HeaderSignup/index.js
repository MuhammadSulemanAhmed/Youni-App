import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { logo, icon } from "../../helpers/assets";
import HeaderProgressBar from "../HeaderProgressBar";
import NavigationBarButton from "../NavigationBarButton";

const HeaderSignup = ({title, handleBackPress, canGoBack, percentage}) => {


  return (
    <View style={styles.headerWrapper}>
      <View style={{...styles.header}}>
        <View>
          <NavigationBarButton
            icon={canGoBack && icon.back_chevron}
            style={{ height: "100%" }}
            onPress={handleBackPress}
          />
        </View>
        <View>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <View>
        {/* Using empty button as a spacer to keep title centered */}
        <NavigationBarButton
          icon={undefined}
          style={{ height: "100%" }}
          onPress={() => {
            // Back button actions
          }}
        />
        </View>
      </View>
      {percentage !== 0 && (
        <HeaderProgressBar percentage={percentage} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    height:75,
    marginBottom: 40,
    marginTop: 20,
  },
  header: {
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  }
});

export default HeaderSignup;
