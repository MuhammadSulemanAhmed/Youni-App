import { Image, View } from 'react-native';
import React from 'react';
import { fnGetImageURL } from "../../helpers/api";
import { ScaledImage } from "../ScaledImage";

/**
 * Used to create photo component for feed in profile
 *
 * @param item
 * @param index
 * @param style
 * @param onItemPress
 */

const PhotoFeedItem = ({item, index, style, onItemPress}) => {
  return (
    // <TouchableOpacity
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 23,
        width: 140,
        height: 140,
        overflow: 'hidden',
        backgroundColor: 'gray',
        ...style,
      }}
      onPress={() => onItemPress()}>
      <ScaledImage
        width={140}
        source = {{uri: item.image_url }}
        />
    </View>
    // </TouchableOpacity>
  );
};
export default PhotoFeedItem;
