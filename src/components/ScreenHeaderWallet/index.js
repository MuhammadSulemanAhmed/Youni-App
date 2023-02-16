import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { icon, tabIcon } from '../../helpers/assets';
import NavigationBarButton from '../NavigationBarButton';

const windowWidth = Dimensions.get('window').width;
const contentWidth = windowWidth - 30;
/**
 * Navigation Headers for screens
 *
 * @param style
 * @param leftButton
 * @param centerView
 * @param rightButton
 * @param showDivider
 */
const ScreenHeader = ({
  style,
  leftButton = null,
  centerView = null,
  rightButton ,
  showDivider = true,
  useMessages = null
}) => {
  return (
    <SafeAreaView
      style={{
        ...styles.headerContainer,
        borderBottomWidth: showDivider ? StyleSheet.hairlineWidth : 0,
        ...style,
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{marginLeft: 20, minWidth: 40}}>{leftButton}</View>
        <View
          style={{
            flex:1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}
          pointerEvents="none">
          {centerView}
        </View>
       
        <View style={{marginRight: 20, minWidth: 40}}>{rightButton()}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  debugBox: {
    borderWidth: 1,
    borderColor: 'red',
  },
  container: {
    flex: 1,
    width: windowWidth,
  },
  headerContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: contentWidth,
    height: 70,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#1e1e20',
    marginTop: 15,
    paddingBottom: 15,
  },
  headerButtonIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenHeader;
