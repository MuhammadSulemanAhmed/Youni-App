import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
} from "react-native";
import { COLORS } from "../../helpers/colors";
import LinearGradient from "react-native-linear-gradient";
import HollowButton from "../../components/HollowButton";
import { FONTS } from "../../helpers/fonts";
import {
  fnGetCategories,
  fnGetImageURL,
  fnGetProfileCategories,
  fnSetProfileCategories,
} from "../../helpers/api";
import { icon } from "../../helpers/assets";
import { errorAlert, okAlert } from "../../helpers/alerts";
import { contentWidth } from "../../helpers/dimensions";
import ScreenHeader from "../../components/ScreenHeader";
import NavigationBarButton from "../../components/NavigationBarButton";
import { NavigationHeaderText } from "../../components/NavigationHeaderText";
import axios from "axios";
import InterestItem from "../../components/CategoryFeedItem";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FilledButton from "../../components/FilledButton";

const EditProfileInterest = ({ navigation }) => {
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState(new Set());
  const [isLoading, setLoading] = React.useState(false);
  useEffect(() => {
    axios
      .all([fnGetCategories(), fnGetProfileCategories()])
      .then(
        axios.spread((...responses) => {
          const staticCategoriesResponse = responses[0];
          const profileCategoriesResponse = responses[1];
          setInterests(staticCategoriesResponse.data.data || []);
          let set = new Set();
          let selectedCategoryData = profileCategoriesResponse.data.data || [];
          selectedCategoryData.map((item) => {
            return set.add(item.category_id);
          });
          setSelectedInterests(set);
        })
      )
      .catch((error) => {
        // react on errors.
        errorAlert("Error", "We’ve encountered a problem, try again later");
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

  const onBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableHighlight
        style={{ minWidth: "45%", margin: 4 }}
        onPress={() => {
          onItemPress(item, index);
        }}
      >
        <InterestItem
          title={item.category}
          icon={fnGetImageURL(item.image_url)}
          isSelected={selectedInterests.has(item.id)}
        />
      </TouchableHighlight>
    );
  };

  const onEditComplete = () => {
    const data = [];
    selectedInterests.forEach((item) => {
      data.push( item );
    });
    setLoading(true);
    let json={
      categories:data
    }
    fnSetProfileCategories(json)
      .then(() => {
        okAlert("Profile Updated", "Categories Updated");
      })
      .catch((error) => {
        console.log(error)
        errorAlert("Error", "We’ve encountered a problem, try again later");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{
      flex: 1,
      width: "100%",
      height: "100%",      
      justifyContent: 'center',
      alignItems: "center",
    }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader
          showDivider={false}
          leftButton={<NavigationBarButton icon={icon.back_chevron} onPress={onBack} />}
          centerView={<NavigationHeaderText text="Interest" />}
        />
        <Text style={styles.titleText}>
          {"Edit your interests to get better recommended groups and events"}
        </Text>
        <FlatList
          contentContainerStyle={{
            flexGrow: 0.5,
            alignContent: "space-between",
          }}
          style={styles.list}
          data={interests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
        <FilledButton
          style={{ position: "absolute", bottom: 0, width: contentWidth }}
          text={"SAVE"}
          onPress={onEditComplete}
          disabled={isLoading}
        />
      </SafeAreaView>
      <SafeAreaView></SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    marginTop: "12%",
    marginBottom: "8%",
    width: 190,
    resizeMode: "contain",
    alignSelf: "center",
  },

  titleText: {
    width: wp("85%"),
    marginHorizontal: 10,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 15,
    fontFamily: FONTS.bwBold,
    fontSize: 13,
    color: COLORS.white,
  },

  progressBar: {
    backgroundColor: "#0c1b1a",
    width: 330,
    height: 12,
    marginBottom: 40,
    marginTop: 16,
    borderRadius: 6,
    overflow: "hidden",
    alignSelf: "center",
  },
  progressFill: {
    flex: 1,
    width: "75%",
    backgroundColor: "#528d89",
  },
  list: {
    flex: 1,
    alignSelf: "center",
    width: contentWidth,
    marginHorizontal: 40,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  item: {
    backgroundColor: "#1a3130",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    overflow: "hidden",
  },
  itemIcon: {
    resizeMode: "contain",
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
export default EditProfileInterest;
