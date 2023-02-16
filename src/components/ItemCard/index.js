import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { COLORS } from "../../helpers/colors";
import { FONTS } from "../../helpers/fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

 const ItemCard = ({ avatar, background, description, clubName, joined, onItemPress }) => {
  
  return (
  <TouchableOpacity onPress={() => onItemPress()}>
  <View
    style={{position: 'absolute', top: 0, right: 0, zIndex: 999}}>
    {joined ? (
      <Image
        style={{ height: 25, width: 25 }}
        source={require('../../../assets/images/ic_check_tick/ic_check_tick.png')}
      />
    ) : (
      <Image
        style={{ height: 25, width: 25 }}
        source={require('../../../assets/images/ic_add_cross/ic_add_cross.png')}
      />
    )}
    </View>
    <View style={styles.item}>
      <View style={{flex: 2}}>
        <Image
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 10,
          resizeMode: 'cover',
        }}
        source={{ uri: avatar }}
      />
      </View>
      <View style={{flex: 4}}>
        <View style={{flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.titleText} numberOfLines={1}>{clubName}</Text>
        </View>
        <View style={{flex: 3}}>
          <Text style={styles.itemText} numberOfLines={4}>{description}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
)};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#1a3130',
    height: 130,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    margin: 5,
    padding: 5
  },
  itemText: {
    color: '#cfd0d0',
    fontFamily: FONTS.bwRegular,
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  titleText: {
    width: 330,
    alignSelf: 'flex-start',
    marginLeft: wp('5%'),
    fontFamily: FONTS.bwBold,
    fontSize: 16,
    color: "white",
  },

});

export default ItemCard;
