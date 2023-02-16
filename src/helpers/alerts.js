import {Alert} from 'react-native';

export const errorAlert = (title = 'Error', message) => {
  Alert.alert(title, message, [{text: 'OK'}], {cancelable: false});
};

export const okAlert = (title, message) => {
  Alert.alert(title, message, [{text: 'OK'}], {cancelable: false});
};
