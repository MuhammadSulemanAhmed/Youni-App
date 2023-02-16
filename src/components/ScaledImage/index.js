import React, { useEffect, useState } from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';

/**
 * Used to create a re-scale image to fit component while maintain aspect ratio
 *
 */

export const ScaledImage = (props) => {
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)

  useEffect(()=>{
    if (props.source.uri){
      Image.getSize(props.source.uri, (width, height) => {
        if (props.width && !props.height) {
          setWidth(props.width)
          setHeight(height * (props.width / width))
        } else if (!props.width && props.height) {
          setWidth(width * (props.height / height))
          setHeight(props.height)
        } else {
          setWidth(width)
          setHeight(height)
        }
      });
    }
  }, [props])

  return (
      <Image
        source={props.source}
        style={{height: height, width: width}}
      />
    );
}

ScaledImage.propTypes = {
  source:  PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object
  ]),
  width: PropTypes.number,
  height: PropTypes.number,
};
