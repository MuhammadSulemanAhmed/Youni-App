import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, FlatList } from "react-native";
import { COLORS } from "../../helpers/colors";
import { FONTS } from "../../helpers/fonts";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaView from "react-native-safe-area-view";
import InterestItem from "../../components/CategoryFeedItem";
import { icon } from "../../helpers/assets";
import PhotoFeedItem from "../../components/PhotoFeedItem";
import EventCardFeedItem from "../../components/EventCardFeedItem";
import SocietyCardFeedItem from "../../components/SocietyCardFeedItem";
import { tempProfileImage } from "../../helpers/tempData";
import { FeedSections } from "../../components/FeedSection";
import {
  cardHeight,
  cardWidth,
  contentWidth,
  windowWidth,
} from "../../helpers/dimensions";
import ScreenHeader from "../../components/ScreenHeader";
import NavigationBarButton from "../../components/NavigationBarButton";
import {
  fnGetPopularEvents,
  fnGetSuggestedSocieties,
  fnSearchEvents,
} from "../../helpers/api";
import { errorAlert } from "../../helpers/alerts";
import { useSelector } from "react-redux";
import { selectMySocieties } from "../../slices/mySocietiesSlice";

const BrowseByCategory = ({ route, navigation }) => {
  const mySocieties = useSelector(selectMySocieties);
  const [category, setCategory] = useState(route.params.category);
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [performPaginate, setPerformPaginate] = useState(true);

  useEffect(async () => {
    let params = {};
    params.categories = [category];
    params.page = page;
    // return
    try {
      const response = await fnSearchEvents(params);
      if (response) {
        const data = await response.json();
        if (data?.data <= 0 && data?.societies_data.length <= 0) {
          setPerformPaginate(false);
        }

        setSocieties([...societies, ...data?.societies_data]);
        setEvents([...events, ...data?.data]);
      }
    } catch (error) {
      console.log(error);
      errorAlert("Error", "We’ve encountered a problem, try again later");
    }

    // let startDate = new Date();
    // let endDate = new Date();
    // endDate.setFullYear(endDate.getFullYear() + 100);
    // fnGetPopularEvents(1000, 0, startDate, endDate, category, 0, "")
    //   .then((response) => {
    //     let data = response.data.data || [];
    //     setEvents(data);
    //   })
    //   .catch((error) => {
    //     errorAlert("Error", "We’ve encountered a problem, try again later");
    //   });

    // fnGetSuggestedSocieties(1000, 0, startDate, endDate, category, 0, "")
    //   .then((response) => {
    //     let data = response.data.data || [];
    //     setSocieties(data);
    //   })
    //   .catch((error) => {
    //     errorAlert("Error", "We’ve encountered a problem, try again later");
    //   });
  }, [page]);

  const renderSocietyCardFeedItem = ({ item, index }) => {
    return (
      <SocietyCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight }}
        index={index}
        onItemPress={() => onSocietyItemPress({ item, index })}
      />
    );
  };

  const renderEventCardFeedItem = ({ item, index }) => {
    return (
      <EventCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight }}
        index={index}
        onItemPress={() => onEventItemPress({ item, index })}
      />
    );
  };

  const renderPhotoFeedItem = ({ item, index }) => {
    return (
      <PhotoFeedItem
        item={item}
        width={140}
        height={140}
        index={index}
        onItemPress={() => onPhotoFeedItemPress({ item, index })}
      />
    );
  };

  const onEventItemPress = ({ item, index }) => {
    navigation.navigate("EventStack", {
      screen: "EventDetails",
      params: { event: item },
    });
  };

  const onSocietyItemPress = ({ item, index }) => {
    const tempId = item.id ? item.id : item.society_id;
    navigation.navigate("SocietyDetails", {
      societyId: tempId,
      societyName: item.name,
      societyDescription: item?.description,
      societyAvatarId: item.avatar_url,
      isFollowing:
        mySocieties.filter((society) => {
          return society.id === tempId;
        }).length > 0,
    });
  };

  const onPhotoFeedItemPress = ({ item, index }) => { };

  const [photos, updatePhotos] = useState(tempProfileImage);

  return (
    <LinearGradient
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
      colors={["#122624", "#081515", "#020d0d"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: "never" }}>
        <ScreenHeader
          leftButton={
            <NavigationBarButton
              icon={icon.back}
              onPress={() => {
                navigation.goBack();
              }}
            />
          }
          centerView={
            <InterestItem
              style={{ height: 50 }}
              icon={icon.basketball}
              title={category || ""}
            />
          }
        />
        <ScrollView
          style={{ flex: 1, borderColor: "blue" }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: windowWidth,
              flex: 1,
              justifyContent: "center",
              alignItem: "center",
              paddingBottom: 40,
            }}
          >
            <View>
              <View
                style={{
                  ...styles.feedSectionHeader,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor: "rgba(255, 255, 255, .1)",
                  // ...titleStyle,
                }}
              >
                <Text style={styles.feedSectionTitle}>
                  {"POPULAR SOCIETIES"}
                </Text>
              </View>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                snapToInterval={cardWidth + 10}
                decelerationRate={"fast"}
                snapToAlignment={"start"}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  // ...listContentContainerStyle,
                }}
                style={{ ...styles.list, height: cardHeight }}
                data={societies}
                renderItem={renderSocietyCardFeedItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.4}
                onEndReached={() => performPaginate && setPage(page + 1)}
              />
            </View>

            <View>
              <View
                style={{
                  ...styles.feedSectionHeader,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor: "rgba(255, 255, 255, .1)",
                  // ...titleStyle,
                }}
              >
                <Text style={styles.feedSectionTitle}>{"POPULAR EVENTS"}</Text>
              </View>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                snapToInterval={cardWidth + 10}
                decelerationRate={"fast"}
                snapToAlignment={"start"}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  // ...listContentContainerStyle,
                }}
                style={{ ...styles.list, height: cardHeight }}
                data={events}
                renderItem={renderEventCardFeedItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.4}
                onEndReached={() => setPage(page + 1)}
              />
            </View>

            {/*<FeedSections title={'PHOTOS & UPDATES'} data={photos} renderItem={renderPhotoFeedItem}*/}
            {/*              snapWidth={300} listStyle={{ height: 140 }}/>*/}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  debugBox: {
    borderWidth: 1,
    borderColor: "red",
  },
  container: {
    flex: 1,
    width: windowWidth,
  },
  headerButtonIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 3,
    color: "red",
    width: contentWidth,
  },
  feedSectionHeader: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "center",
    alignSelf: "center",
    width: contentWidth,
  },
  feedSectionTitle: {
    fontFamily: FONTS.bwBlack,
    fontSize: 21,
    color: COLORS.white,
    alignSelf: "center",
  },
  feedSectionCaption: {
    fontFamily: FONTS.bwMedium,
    fontSize: 13,
    color: "#b0b0b0",
    alignSelf: "center",
  },
  list: {
    flex: 1,
    flexDirection: "row",
    marginTop: 14,
  },
});
export default BrowseByCategory;
