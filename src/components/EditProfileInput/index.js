import React from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {FONTS} from '../../helpers/fonts';
import {windowWidth} from '../../helpers/dimensions';

/**
 * Component used in editing user's profile
 *
 * @param ic - icon for component
 * @param placeholderText
 * @param keyboardType
 * @param value
 * @param onChangeText
 * @param secureTextEntry
 */
const EditProfileInput = ({
  ic,
  placeholderText,
  keyboardType = 'default',
  value = '',
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.container}>
      <Image style={{marginLeft: 25, width: 20, height: 20}} source={ic} />
      <TextInput
        placeholder={placeholderText}
        onChangeText={onChangeText}
        placeholderTextColor="#ffffff80"
        secureTextEntry={secureTextEntry}
        style={{
          flexGrow: 1,
          height: '100%',
          marginLeft: 20,
          fontFamily: FONTS.bwBold,
          fontSize: 16,
          color: '#cfd0d0',
        }}>
        {value}
      </TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {    
    height: 50,    
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#1D1E29',
    borderBottomWidth: 1,
    marginHorizontal: 10,
    width: '95%',
    borderRadius: 10,
  },
});

export default EditProfileInput;
