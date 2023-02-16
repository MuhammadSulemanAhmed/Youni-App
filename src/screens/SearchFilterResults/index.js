import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaView from "react-native-safe-area-view";
import { icon } from "../../helpers/assets";
import EventCardFeedItem from "../../components/EventCardFeedItem";
import SocietyCardFeedItem from "../../components/SocietyCardFeedItem";
import {
  cardHeight,
  cardWidth,
  contentWidth,
  windowWidth,
} from "../../helpers/dimensions";
import ScreenHeader from "../../components/ScreenHeader";
import { NavigationHeaderText } from "../../components/NavigationHeaderText";
import NavigationBarButton from "../../components/NavigationBarButton";
import {
  fnGetPopularEvents,
  fnGetSuggestedSocieties,
  fnSearchEvents,
  fnAddViewToSociety
} from "../../helpers/api";
import { errorAlert } from "../../helpers/alerts";
import { useSelector } from "react-redux";
import { selectMySocieties } from "../../slices/mySocietiesSlice";
import moment from "moment";
import { selectProfile } from "../../slices/profileSlice";
const SearchFilterResults = ({ route, navigation }) => {
  const profile = useSelector(selectProfile);
  const mySocieties = useSelector(selectMySocieties);
  const {
    isEventResult,
    categories,
    search,
    events,
    societies,
    startDate,
    endDate,
  } = route.params;
  const [data, setData] = useState(
    isEventResult ? [...events] : [...societies]
  );

  const [page, setPage] = useState(1);
  const [performPaginate, setPerformPaginate] = useState(true);

  useEffect(async () => {
    if (page > 1) {
      let params = {};
      search && (params.title = search);
      startDate && (params.start_date = startDate);
      endDate && (params.end_date = endDate);
      categories.length > 0 && (params.categories = categories);
      params.page = page;
      console.log(params)
      const response = await fnSearchEvents(params);

      try {
        if (response) {
          const json = await response.json();
          if (isEventResult) {
            json?.data.length <= 0 && setPerformPaginate(false);
            // setData([...data, ...json?.data]);
            let temp = [...data, ...json?.data]
            let set = Array.from(new Set(temp))
            setData(set);
            console.log(response.url);
          } else {
            json?.societies_data.length <= 0 && setPerformPaginate(false);
            console.log(response.url);
            let temp = [...data, ...json?.societies_data]
            let set = Array.from(new Set(temp))
            const namesArr = set.filter(function (elem, pos) {
              return temp.indexOf(elem) == pos;
            });
            let temp2=[]
              namesArr.forEach(obj => {
              if (!temp2.some(o => o.id === obj.id)) {
                temp2.push({...obj});
              }
            })
            // let set = Array.from(new Set(namesArr))
            setData(temp2);
          }
        }
      } catch (error) {
        console.log(error) &&
          errorAlert("Error", "We’ve encountered a problem, try again later");
      }
    }
  }, [page]);

  const renderItem = ({ item, index }) => {
    return isEventResult
      ? renderEventCardFeedItem(item, index)
      : renderSocietyCardFeedItem(item, index);
  };

  const renderSocietyCardFeedItem = (item, index) => {
    console.log(item.id)
    return (
      <SocietyCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight, marginTop: 15 }}
        index={index}
        onItemPress={() => onSocietyItemPress({ item, index })}
      />
    );
  };

  const renderEventCardFeedItem = (item, index) => {
    return (
      <EventCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight, marginTop: 15 }}
        index={index}
        onItemPress={() => onEventItemPress({ item, index })}
      />
    );
  };

  const onEventItemPress = ({ item, index }) => {
    navigation.navigate("EventStack", {
      screen: "EventDetails",
      params: { eventId: item.id },
    });
  };

  const onSocietyItemPress = ({ item, index }) => {
    const tempId = item.id ? item.id : item.society_id;
    let dat = {
      society_id: parseInt(tempId),
      user_id: parseInt(profile.id)
    }
    // alert(JSON.stringify(dat))
    fnAddViewToSociety(dat)
    navigation.navigate("SocietyDetails", {
      societyId: tempId,
      societyName: item.name,
      societyDescription: item?.description,
      societyAvatarId: item.banner_url,
      isFollowing:
        mySocieties.filter((society) => {
          return society.id === tempId;
        }).length > 0,
    });
  };

  return (
      <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: "never" }}>
        <ScreenHeader
          leftButton={
            <NavigationBarButton
              icon={icon.back_block}
              onPress={() => {
                navigation.goBack();
              }}
          
        />
          }
          centerView={<NavigationHeaderText text={`${data.length} results`} />}
        />
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 10,
            paddingBottom: 40,
          }}
          style={{ ...styles.list }}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id?.toString()}
          onEndReachedThreshold={0.3}
          onEndReached={() => performPaginate && setPage(page + 1)}
        />
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
  divider: {
    height: 3,
    color: "red",
    width: contentWidth,
  },
  list: {
    flex: 1,
    marginTop: 14,
  },
});
export default SearchFilterResults;
