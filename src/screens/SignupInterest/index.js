import React, { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableHighlight, View, } from 'react-native';
import { COLORS } from '../../helpers/colors';
import LinearGradient from 'react-native-linear-gradient';
import HollowButton from '../../components/HollowButton';
import { FONTS } from '../../helpers/fonts';
import { fnGetCategories, fnSetProfileCategories } from '../../helpers/api';
import { logo } from '../../helpers/assets';
import { errorAlert } from '../../helpers/alerts';
import InterestItem from '../../components/CategoryFeedItem';
import { contentWidth } from '../../helpers/dimensions';
import HeaderSignup from '../../components/HeaderSignup';
import FilledButton from '../../components/FilledButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SignupInterest = ({ navigation }) => {
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState(new Set());
  const [isLoading, setLoading] = React.useState(false);
  const [statusTitle, setStatusTitle] = useState('Your Interests')
  useEffect(() => {
    fnGetCategories()
      .then(response => {
        setInterests(response.data.data);
      })
      .catch(error => {
        errorAlert('Error', "We’ve encountered a problem, try again later");
      });
  }, []);

  const onItemPress = (item, index) => {
    const id = item.id;
    if (selectedInterests.has(id)) {
      let newSet = new Set(selectedInterests);
      newSet.delete(id);
      setSelectedInterests(newSet);
    } else {
      setSelectedInterests(new Set(selectedInterests).add(id));
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableHighlight
        style={{ minWidth: '45%', margin: 7 }}
        onPress={() => {
          onItemPress(item, index);
        }}>
        <InterestItem
          title={item.category}
          icon={item.image_url}
          isSelected={selectedInterests.has(item.id)}          
        />
      </TouchableHighlight>
    );
  };

  const onNextPress = () => {
    const data = [];
    selectedInterests.forEach(item => {
      data.push(item);
    });
    setLoading(true);
    let json={
      categories:data
    }
    console.log(json)
    // return
    fnSetProfileCategories(json)
      .then(() => {
        navigation.navigate('SignupClubs');
      })
      .catch(error => {
        errorAlert('Error', "We’ve encountered a problem, try again later");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBackPress = () => {
    navigation.navigate('SignupProfilePic');
  }

  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{ flex: 1}}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <HeaderSignup title={statusTitle} handleBackPress={handleBackPress} canGoBack={false} percentage={60} />
        <Text style={styles.titleText}>Pick some of your interests</Text>
        <FlatList
          contentContainerStyle={{ alignContent: 'space-between' }}
          style={styles.list}
          data={interests}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
        />

        <View style={{ justifyContent: 'flex-end', alignSelf: 'center' }}>
        <FilledButton
              width={wp("84%")}
              text={"Next"}
              onPress={onNextPress}
              disabled={isLoading}
            />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    marginTop: '2%',
    marginBottom: '2%',
    width: 190,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  titleText: {
    width: 330,
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginLeft: wp('5%'),
    fontFamily: FONTS.bwBold,
    fontSize: 20,
    color: "white",
  },

  progressBar: {
    backgroundColor: '#0c1b1a',
    width: 330,
    height: 12,
    marginBottom: 40,
    marginTop: 16,
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressFill: {
    flex: 1,
    width: '60%',
    backgroundColor: '#528d89',
  },
  list: {
    flex: 1,
    alignSelf: 'center',
    width: contentWidth,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  item: {
    backgroundColor: '#1a3130',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 17,
    overflow: 'hidden',
  },
  itemIcon: {
    resizeMode: 'contain',
    borderBottomRightRadius: 17,
    borderTopRightRadius: 17,
  },
  itemText: {
    fontSize: 13,
    marginLeft: 13,
    fontFamily: FONTS.bwRegular,
    color: COLORS.white,
  },
});
export default SignupInterest;
