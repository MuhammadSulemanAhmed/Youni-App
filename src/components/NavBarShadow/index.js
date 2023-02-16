import React from 'react';
import {Image} from 'react-native';

/**
 * Component used for drop shadow for main feed
 */
export const NavBarShadow = () => (
  <Image
    style={{
      width: '100%',
      height: 120,
      marginBottom: -30,
      position: 'absolute',
      bottom: 0,
      alignSelf: 'flex-end',
      resizeMode: 'cover',
    }}
    source={require('../../../assets/images/nav_bar_shadow/nav_bar_shadow.png')}
  />
);
