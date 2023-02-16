import { Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../helpers/colors";
import React from "react";
import { FONTS } from "../../helpers/fonts";
import { getCategoryAsset } from "../../helpers/functions";

/**
 * Component used for displaying user's interest
 *
 * @param icon
 * @param title
 * @param width
 * @param style - additional styles applying to container for InterestItem
 * @param isSelected
 *
 */

const InterestItem = ({ icon, title, width, style, isSelected }) => (
  <View
    style={{
      ...styles.item,
      borderColor: isSelected ? COLORS.purple : "#33343E",
      backgroundColor: isSelected ? COLORS.purple : "#1D1E29",
      marginHorizontal: isSelected ? -2 : 0,
      width: width,
      justifyContent: 'center',
      ...style,
    }}
  >
    <View
      style={{
        height: "100%",
        width: 47,
        justifyContent: "center",
        alignItems: "center",
        borderBottomRightRadius: 17,
        borderTopRightRadius: 17,
      }}
    >
      <Image source={getCategoryAsset(title)} style={{tintColor:'white',height:26,resizeMode:'contain'}} />
    </View>

    <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.itemText}>
      {title}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#1a3130",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    overflow: "hidden",
  },
  itemIcon: {
    resizeMode: "contain",
  },
  itemText: {
    fontSize: 13,
    marginLeft: 10,
    marginRight: 14,
    textTransform: "capitalize",
    fontFamily: FONTS.bwBold,
    color: COLORS.white,
  },
});
export default InterestItem;
