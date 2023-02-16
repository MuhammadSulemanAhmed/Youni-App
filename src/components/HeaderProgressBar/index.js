import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { logo, icon } from "../../helpers/assets";
import { COLORS } from "../../helpers/colors";
import NavigationBarButton from "../NavigationBarButton";

const HeaderProgressBar = ({percentage}) => {
  const progressAmount = percentage;
  return (
    <View style={styles.progressWrapper}>
      <View style={styles.progressBar}>
        <View style={percentage >= 1 && percentage >= 20 ? styles.progressItemActive : styles.progressItem}/>
        <View style={percentage >= 40 ? styles.progressItemActive : styles.progressItem}/>
        <View style={percentage >= 60 ? styles.progressItemActive : styles.progressItem}/>
        <View style={percentage >= 80 ? styles.progressItemActive : styles.progressItem}/>
        <View style={percentage >= 100 ? styles.progressItemActive : styles.progressItem}/>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  progressWrapper: {    
  },
  progressBar: {
    width: 330,
    height: 7,
    marginBottom: 40,
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'center',
    flexDirection: 'row'
  },
  progressItem: {
    flex: 1,
    backgroundColor: COLORS.purple,
    opacity: 0.1,
    borderRadius: 6,
    marginRight: 5
  },
  progressItemActive: {
    flex: 1,
    backgroundColor: COLORS.purple,
    borderRadius: 6,
    marginRight: 5
  }
});

export default HeaderProgressBar;
