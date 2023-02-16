import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Avatar,
  Bubble,
  Message,
  MessageText,
  SystemMessage,
} from 'react-native-gifted-chat';
import {FONTS} from '../../helpers/fonts';

/** Function properties to create chat messages component from 'react-native-gifted-chat' library
 * https://github.com/FaridSafi/react-native-gifted-chat
 */

export const renderAvatar = props => (
  <Avatar
    {...props}
    containerStyle={{left: {marginBottom: 21}, right: {}}}
    // imageStyle={{ left: { borderWidth: 3, borderColor: 'blue' }, right: {} }}
  />
);

export const renderBubble = props => (
  <Bubble
    {...props}
    // renderTime={() => <Text>Time</Text>}
    // renderTicks={() => <Text>Ticks</Text>}
    containerStyle={
      {
        // left: { borderRadius: 21 },
        // right: { backgroundColor: 'transparent' },
      }
    }
    wrapperStyle={{
      left: {backgroundColor: 'transparent'},
      right: {backgroundColor: 'transparent'},
    }}
    bottomContainerStyle={{
      left: {marginTop: 6},
      right: {marginTop: 6},
    }}
    // tickStyle={{}}
    // usernameStyle={{ color: 'tomato', fontWeight: '100' }}
    containerToNextStyle={{
      left: {backgroundColor: 'red', marginLeft: 6},
      right: {backgroundColor: 'blue'},
    }}
    containerToPreviousStyle={{
      left: {backgroundColor: 'red'},
      right: {backgroundColor: 'blue'},
    }}
  />
);

export const renderSystemMessage = props => (
  <SystemMessage
    {...props}
    containerStyle={{backgroundColor: 'pink'}}
    wrapperStyle={{borderWidth: 10, borderColor: 'white'}}
    textStyle={{color: 'crimson', fontWeight: '900'}}
  />
);

export const renderMessage = props => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={
      {
        // left: { backgroundColor: 'lime'  },
        // right: { backgroundColor: '#2e4645' },
      }
    }
  />
);

export const renderMessageText = props => (
  <MessageText
    {...props}
    containerStyle={{
      left: {
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 21,
        borderColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 12,
      },
      right: {
        backgroundColor: '#2e4645',
        borderRadius: 21,
        paddingVertical: 5,
        paddingHorizontal: 12,
      },
    }}
    textStyle={{
      left: {color: 'white'},
      right: {color: 'white'},
    }}
    linkStyle={{
      left: {color: 'blue'},
      right: {color: 'blue'},
    }}
    customTextStyle={{fontFamily: FONTS.bwMedium, fontSize: 15, lineHeight: 24}}
  />
);
