import {Dimensions} from 'react-native';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const contentWidth = windowWidth - 30;
export const cardWidth = windowWidth * 0.85;
export const cardHeight = 250;
export const eventTicketBottomBarHeight = 80;
