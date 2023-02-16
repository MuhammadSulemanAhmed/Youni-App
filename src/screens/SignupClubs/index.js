import React, { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { COLORS } from '../../helpers/colors';
import LinearGradient from 'react-native-linear-gradient';
import HollowButton from '../../components/HollowButton';
import { FONTS } from '../../helpers/fonts';
import { AuthContext } from '../../navigation/context';
import { logo } from '../../helpers/assets';
import { fnGetImageURL, fnGetSuggestedSocieties, fnSetProfileSocieties, } from '../../helpers/api';
import { errorAlert } from '../../helpers/alerts';
import HeaderSignup from '../../components/HeaderSignup';
import FilledButton from '../../components/FilledButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ItemCard from '../../components/ItemCard';

const SignupClubs = ({ navigation }) => {
  const [clubs, updateClubs] = useState([]);
  const [selectedClubs, updateSelectedClubs] = useState(new Set());
  const [isLoading, setLoading] = useState(false);
  const [statusTitle, setStatusTitle] = useState('Your Groups')

  useEffect(() => {
    fnGetSuggestedSocieties(3, 0)
      .then(async response => {
        let dat = await response.json()
        let data = dat.data || [];
        updateClubs(data);
        const set = new Set();
        data.map(item => {
          set.add(item.id);
        });
        updateSelectedClubs(set);
      })
      .catch(error => {
        errorAlert('Error', "We’ve encountered a problem, try again later");
      });
  }, []);

  const onItemPress = (item, index) => {
    const id = item.id;
    if (selectedClubs.has(id)) {
      let newSet = new Set(selectedClubs);
      newSet.delete(id);
      updateSelectedClubs(newSet);
    } else {
      updateSelectedClubs(new Set(selectedClubs).add(id));
    }
  };

  const onNextPress = () => {
    setLoading(true);
    console.log(selectedClubs)
    // alert("asd")
    const data = [];
    
    
    selectedClubs.forEach(item => {
      data.push({ society_id: item });
    });
    fnSetProfileSocieties(data)
      .then(() => {
        navigation.navigate("SignupTsAndCs");
      })
      .catch(error => {
        navigation.navigate("SignupTsAndCs");
        // errorAlert('Error', "We’ve encountered a problem, try again later");
      })
      .finally(() => {
        setLoading(false);
      });
   
  };

  const renderItem = ({ item, index }) => (
    <ItemCard
      clubName={item.name}
      avatar={item.avatar_url}
      background={item.banner_url}
      description={item.description}
      joined={selectedClubs.has(item.id)}
      onItemPress={() => onItemPress(item, index)}
    />
  );

  const { signIn } = React.useContext(AuthContext);

  const handleBackPress = () => {
    navigation.navigate('SignupProfilePic');
  }

  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{ flex: 1}}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <HeaderSignup title={statusTitle} handleBackPress={handleBackPress} canGoBack={false} percentage={80} />
        <Text style={styles.titleText}>Here are groups based on your interests</Text>
        <FlatList
          style={styles.list}
          data={clubs}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
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
    marginLeft: wp('5%'),
    fontFamily: FONTS.bwBold,
    fontSize: 16,
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
    width: '80%',
    backgroundColor: '#528d89',
  },
  list: {
    flex: 1,
    alignSelf: 'center',
    width: 344,
  },
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
  itemButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 52,
    height: 44,
    borderBottomLeftRadius: 10,
    backgroundColor: COLORS.appYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignupClubs;
