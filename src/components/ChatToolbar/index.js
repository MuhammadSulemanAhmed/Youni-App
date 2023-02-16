/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {Image} from 'react-native';
import {Actions, Composer, InputToolbar, Send} from 'react-native-gifted-chat';
import {icon} from '../../helpers/assets';

/** Function properties to create chat toolbar component from 'react-native-gifted-chat' library
 * https://github.com/FaridSafi/react-native-gifted-chat
 */

export const renderInputToolbar = props => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: '#071010',
      paddingTop: 12,
      // marginTop: 15,
      paddingHorizontal: 15,
    }}
    primaryStyle={{alignItems: 'center'}}
  />
);

export const renderActions = props => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Image style={{width: 32, height: 32}} source={icon.add_message_photo} />
    )}
    options={{
      'Choose From Library': () => {
      },
      Cancel: () => {
      },
    }}
    optionTintColor="#222B45"
  />
);

export const renderComposer = props => (
  <Composer
    {...props}
    textInputStyle={{
      color: '#ffffff',
      backgroundColor: 'transparent',
      borderRadius: 5,
      borderColor: '#E4E9F2',
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
    }}
  />
);

export const renderSend = props => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}>
    <Image style={{width: 32, height: 32}} source={icon.message_send} />
  </Send>
);
