import React from 'react';
import {Image} from 'react-native';

/**
 * Icons used for tab bar
 *
 * @param icon
 * @param size
 * @param color
 * @returns {JSX.Element}
 * @constructor
 */
export const TabIcon = ({icon, size, color}) => (
  <Image style={{width: size, height: size, tintColor: color}} source={icon} />
);
