import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../../helpers/colors';
import LinearGradient from 'react-native-linear-gradient';
import {FONTS} from '../../helpers/fonts';
import {icon} from '../../helpers/assets';
import React from 'react';
import moment from 'moment';
import {fnGetImageURL} from '../../helpers/api';

/**
 * Component used for displaying society card item on the main feed
 *
 * @param item
 * @param index
 * @param style
 * @param onItemPress
 */

const SocietyCardFeedItem = ({item, index, style, onItemPress}) => {  
  
  return (
    <TouchableOpacity
      style={{...styles.container, ...style}}
      onPress={onItemPress}>
      <View style={styles.imageContainer}>
        <ImageBackground
          borderRadius={10}
          style={styles.backgroundImage}
          source={{uri: item.banner_url || item.avatar_url}}>
        </ImageBackground>
      </View>
      <View style={{padding: 15}}>
        <View style={styles.infoContainer}>
          <Text style={styles.eventTitleText} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.eventDescriptionText} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
      {/* <View style={styles.learnMoreClickContainer}>
        <Text style={styles.learnMoreText}>LEARN MORE</Text>
      </View> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,    
    borderRadius: 15,
    backgroundColor: '#1D1E29',
    overflow: 'hidden',
    padding: 5,
  },
  imageContainer: {
    width: '100%',
    height: '65%',  
    borderRadius: 15,  
    backgroundColor: '#321F3D'
  },
  infoContainer: {
    width: '100%',
    height: '65%',    
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'flex-end',    
  },
  imageInnerShadow: {
    height: '70%',
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 15,
    justifyContent: 'flex-end',
  },
  eventTitleText: {
    fontSize: 20,
    fontFamily: FONTS.bwExtraBold,
    color: COLORS.white,
  },
  eventDescriptionText: {
    marginTop: 5,
    fontSize: 10,
    fontFamily: FONTS.bwMedium,
    color: '#8E8E8E',
  },
  eventIcon: {
    width: 14,
    height: 14,
  },
  eventText: {
    fontSize: 14,
    fontFamily: FONTS.bwBold,
    color: '#5c5c5c',
  },
  learnMoreClickContainer: {
    width: 120,
    height: 40,
    position: 'absolute',
    bottom: 6,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnMoreText: {
    color: '#d9bf71',
    fontSize: 14,
    fontFamily: FONTS.bwBlack,
  },
});

export default SocietyCardFeedItem;
