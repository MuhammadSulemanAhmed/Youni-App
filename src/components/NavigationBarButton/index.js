import {Image, TouchableOpacity} from 'react-native';
import React from 'react';

/**
 * Component used in left and right component in navigation
 *
 * @param style
 * @param icon
 * @param onPress
 */
const NavigationBarButton = ({style, icon, onPress, large}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={{
        ...style,
        width: 20,
        height: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',        
      }}>
      <Image source={icon} style={{height: large ? 30 : 20, width: large ? 30 : 20}} />
    </TouchableOpacity>
  );
};
export default NavigationBarButton;
