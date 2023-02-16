import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS} from '../../helpers/colors';
import {FONTS} from '../../helpers/fonts';

/**
 * Center text component used to display screen title
 *
 * @param style
 * @param text
 */

export const NavigationHeaderText = ({style, text}) => {
  return <Text adjustsFontSizeToFit numberOfLines={1} style={{...styles.headerTitle, ...style}}>{text}</Text>;
};

const styles = StyleSheet.create({
  headerTitle: {
    width: '100%',
    color: COLORS.white,
    fontFamily: FONTS.bwBold,
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
