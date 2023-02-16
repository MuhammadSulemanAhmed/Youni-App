import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../helpers/colors";

/** Base Re-usable button
 *
 * @param style
 * @param textStyle
 * @param width
 * @param text
 * @param onPress
 * @param disabled
 */
const HollowButton = ({
  style,
  textStyle,
  width = "100%",
  text,
  onPress,
  disabled,
}) => {
  const [value, onChangeText] = React.useState("");
  const styles = StyleSheet.create({
    hollowButton: {
      width: width,
      height: 60,
      marginHorizontal: 5,
      marginVertical: 14,
      borderWidth: 2,
      borderRadius: 16,
      borderColor: COLORS.purple,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    buttonText: {
      color: COLORS.purple,
      fontSize: 15,
      fontFamily: "BwModelica-Black",
    },
  });

  return (
    <TouchableOpacity
      style={{ ...styles.hollowButton, ...style }}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={{ ...styles.buttonText, ...textStyle }}>{text}</Text>
    </TouchableOpacity>
  );
};

export default HollowButton;
