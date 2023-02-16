import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../helpers/colors";

const DateCardIcon = ({month, day}) => {


  return (
    <View style={styles.dateCard}>
      <View style={styles.dateTopSection}>
        <Text style={styles.dateMonthText}>{month}</Text>
      </View>
      <View style={styles.dateBottomSection}>
        <Text style={styles.dateDayText}>{day}</Text>
      </View>          
    </View>
  );
};

const styles = StyleSheet.create({
  dateCard: {
    zIndex: 999,
    height: 40,
    width: 40,
    backgroundColor: COLORS.white,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 10,
    margin: 5,
    display: 'flex',
  },
  dateTopSection: {
    flex: 2, 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.purple,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,    
  },
  dateBottomSection: {
    flex: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateMonthText: {
    fontWeight: 'bold',
    fontSize: 11,
    color: COLORS.white
  },
  dateDayText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default DateCardIcon;
