import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../../helpers/colors";
import { FONTS } from "../../helpers/fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

/** Component used for user's signup
 *
 * @param style
 * @param placeholderText
 * @param titleText
 * @param keyboardType
 * @param value
 * @param onChangeText
 * @param secureTextEntry
 * @param maxLength
 */

const SignupInput = ({
  style,
  placeholderText,
  titleText,
  keyboardType = "default",
  value,
  onChangeText,
  secureTextEntry = false,
  editable,
  maxLength,
}) => {
  const HORIZONTAL_PADDING = 15;
  const styles = StyleSheet.create({
    wrapper: {
      marginTop: 20,
    },
    input: {
      color: COLORS.white,
      backgroundColor: "#0b1918",
      width: wp("84%"),
      height: 60,
      borderRadius: 13,
      fontFamily: FONTS.bwRegular,
      fontSize: 15,
      paddingHorizontal: HORIZONTAL_PADDING,
    },
    title: {
      color: COLORS.white,
      fontFamily: FONTS.bwBold,
      fontSize: 12.5,
      paddingVertical: 10,
      paddingHorizontal: HORIZONTAL_PADDING,
    },
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{titleText}</Text>
      <TextInput
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        placeholder={placeholderText}
        placeholderTextColor="#ffffff80"
        value={value}
        onChangeText={onChangeText}
        style={{ ...styles.input, ...style }}
        textContentType={"oneTimeCode"}
        secureTextEntry={secureTextEntry}
        editable={editable}
        maxLength={maxLength}
      />
    </View>
  );
};

export default SignupInput;
