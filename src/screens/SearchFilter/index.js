import React, { useCallback, useEffect, useState } from "react";
import {  
  FlatList,
  Image,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  cardHeight,
  cardWidth,
  contentWidth,
  windowWidth,
} from "../../helpers/dimensions";
import { icon, searchImages } from "../../helpers/assets";
import { FONTS } from "../../helpers/fonts";
import { COLORS } from "../../helpers/colors";
import HollowButton from "../../components/HollowButton";
import SocietyCardFeedItem from "../../components/SocietyCardFeedItem";
import EventCardFeedItem from "../../components/EventCardFeedItem";
import InterestItem from "../../components/CategoryFeedItem";
import {
  fnGetCategories,
  fnGetPopularEvents,
  fnGetSuggestedSocieties,
  fnSearchEvents,
  fnAddViewToSociety
} from "../../helpers/api";
import { errorAlert } from "../../helpers/alerts";
import { useSelector } from "react-redux";
import { selectMySocieties } from "../../slices/mySocietiesSlice";
import { Calendar } from "react-native-calendars";
import _ from "lodash";
import moment from "moment";
import { selectProfile } from "../../slices/profileSlice";
import FilledButton from "../../components/FilledButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ItemCard from "../../components/ItemCard";

const categoryWidth = windowWidth * 0.45;

const SearchFilter = ({ route, navigation }) => {
  const profile = useSelector(selectProfile);
  const mySocieties = useSelector(selectMySocieties);
  const [categories, setCategories] = useState([]);
  const [twoRowCategories, setTwoRowCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    route.params.selectedCategoriesArray || []
  );
  const [startFilter, setStartFilter] = useState(null);
  const [endFilter, setEndFilter] = useState(null);
  const [useStartDateFilter, setUseStartDateFilter] = useState(route.params.startDate ? moment(route.params.startDate) : undefined);
  const [useEndDateFilter, setUseEndDateFilter] = useState(
    route.params.endDate ? moment(route.params.endDate) : undefined
  );
  const [search, setSearch] = useState("");
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [events, setEvents] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [allSocietiesCount, setAllSocietiesCount] = useState(0);
  const [allEventCount, setAllEventCount] = useState(0);
  const [data, updateData] = useState([]);
  const [showStartCalendar, setStartShowCalendar] = useState(false);
  const [showEndCalendar, setEndShowCalendar] = useState(false);
  let categoryFilter = [];

  useEffect(() => {
    let startDate = moment(route.params.startDate).toDate();
    let endDate = route.params.endDate
      ? moment(route.params.endDate).toDate()
      : undefined;
    if (startDate) {
      setStartFilter(startDate);
    } else {
      let sDate = new Date();
      setStartFilter(sDate);
    }
    if (endDate) {
      setEndFilter(endDate);
    } else {
      let eDate = new Date();
      eDate.setFullYear(eDate.getFullYear() + 100);
      setEndFilter(eDate);
    }
    fnGetCategories()
      .then((response) => {
        let data = response.data.data;
        setCategories(data);
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again later");
      });
  }, []);

  useEffect(() => {
    splitCategoryData();
  }, [categories]);

  useEffect(() => {
    let tSocieties = [...societies],
      tEvents = [...events];
    updateData([
      {
        title: "SOCIETIES",
        data: [tSocieties.splice(0, 3)],
        footer: "Society",
        count: allSocietiesCount,
      },
      {
        title: "EVENTS",
        data: [tEvents.splice(0, 3)],
        footer: "Event",
        count: allEventCount,
      },
    ]);
  }, [societies, events, allSocietiesCount, allEventCount]);

  const debounceCallback = useCallback(
    _.debounce((start, end, categories, societyId, text) => {
      apiCall(start, end, categories, societyId, text);
    }, 500),
    []
  );

  const onSearchChange = (search) => {
    setSearch(search);
    debounceCallback(startFilter, endFilter, categoryFilter, 0, search);
  };

  useEffect(() => {
    // ONLY UPDATE FEED AFTER CATEGORY SELECTION IS OVER
    if (showCategoryFilter || startFilter === null || endFilter === null) {
      return;
    }

    categoryFilter = categories?.filter((item) => {
        return selectedCategories.includes(item.id);
      })
      .map((item) => {
        return item.category;
      });
    apiCall(startFilter, endFilter, categoryFilter, 0, search);
  }, [startFilter, endFilter, showCategoryFilter]);

  const apiCall = async (start, end, categories, societyId, text) => {
    let start_date = useStartDateFilter
      ? moment(start).format("YYYY-MM-DD")
      : "";
    let end_date = useEndDateFilter ? moment(end).format("YYYY-MM-DD") : "";

    let params = {};
    text && (params.title = text);
    start_date && (params.start_date = start_date);
    end_date && (params.end_date = end_date);
    categories?.length > 0 && (params.categories = categories);
    // alert(JSON.stringify(params))
    try {
      const response = await fnSearchEvents(params);
      // alert(JSON.stringify(data.data))
      if (response) {
        const data = await response.json();
       
        if (data?.data.length > 0) {
          setAllEventCount(data.data.length || 0);
        } else {
          setAllEventCount(0);
        }
        setEvents(data?.data);

        if (data?.societies_data.length > 0) {
          setAllSocietiesCount(data.societies_data.length || 0);
        } else {
          setAllSocietiesCount(0);
        }
        setSocieties(data?.societies_data);
      }
    } catch (error) {
      errorAlert("Error", "We’ve encountered a problem, try again later");
    }
  };

  const splitCategoryData = () => {
    let categoryData = _.cloneDeep(categories);
    let arrays = [],
      size = 3;
    while (categoryData?.length > 0) {
      arrays.push(categoryData.splice(0, size));
    }
    return setTwoRowCategories(arrays);
  };

  const renderHorizontalList = ({ item, index, section }) => {       
    if (item.length === 0) {
      return (
        <View style={{ height: cardHeight, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            style={{height: 50, width: 50, marginBottom: 10}}
            source={searchImages.search}
          />
          <Text style={{color: 'white', fontWeight: 'bold'}}>No {section.footer}s found</Text>
        </View>
      )
    }
    return (
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 10}
        decelerationRate={"fast"}
        snapToAlignment={"start"}
        style={{ height: cardHeight }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={item}
        renderItem={
          section.title === "SOCIETIES" ? renderSocietyItem : renderEventItem
        }
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const renderSocietyItem = ({ item, index }) => {    
    return (
      <SocietyCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight }}
        index={index}
        onItemPress={() => onSocietyItemPress({ item, index })}
      />
    );
  };

  const renderEventItem = ({ item, index }) => {
    return (
      <EventCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight }}
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
    // alert(JSON.stringify(item))
    // return
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

  const renderSectionHeader = ({ section }) => {
    console.log('Here, ', section)
    return (
      <SafeAreaView style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20}}>
        <Text style={styles.feedSectionTitle}>{section.title} <Text style={{color: '#8E8E8E'}}>{" " + section.count + " "}</Text></Text>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            section.title === "SOCIETIES"
              ? navigateToSocietySearchResult()
              : navigateToEventSearchResult();
          }}
        >
          <Text
            style={{
              color: COLORS.purple,
              fontFamily: FONTS.bwMedium,
              fontSize: 13,
            }}
          >
            View all
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  const renderSectionFooter = ({ section }) => {    
    if (section.count !== 0) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 15,
          }}
          onPress={() => {
            section.title === "SOCIETIES"
              ? navigateToSocietySearchResult()
              : navigateToEventSearchResult();
          }}
        >
          <Text
            style={{
              color: COLORS.appYellow,
              fontFamily: FONTS.bwMedium,
              fontSize: 13,
            }}
          >
            View
          </Text>
          <Text
            style={{
              color: COLORS.appYellow,
              fontFamily: FONTS.bwExtraBold,
              fontSize: 13,
            }}
          >
            {" " + section.count + " "}
          </Text>
          <Text
            style={{
              color: COLORS.appYellow,
              fontFamily: FONTS.bwMedium,
              fontSize: 13,
            }}
          >
            {section.footer + " Results"}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const navigateToSocietySearchResult = () => {
    // console.log(useStartDateFilter
    //   ? moment(startFilter).format("YYYY-MM-DD")
    //   : "")
    // return
    navigation.navigate("SearchFilterResults", {
      isEventResult: false,
      categories: categoryFilter,
      startDate: useStartDateFilter
        ? moment(startFilter).format("YYYY-MM-DD")
        : "",
      endDate: useStartDateFilter ? moment(endFilter).format("YYYY-MM-DD") : "",
      search: search,
      events: null,
      societies,
    });
  };

  const navigateToEventSearchResult = () => {

    // return
    navigation.navigate("SearchFilterResults", {
      isEventResult: true,
      categories: categoryFilter,
      startDate: useStartDateFilter
        ? moment(startFilter).format("YYYY-MM-DD")
        : "",
      endDate: useStartDateFilter ? moment(endFilter).format("YYYY-MM-DD") : "",
      search: search,
      societies: null,
      events,
    });
  };

  const categorySelection = () => {
    return (
      <SafeAreaView
        style={{
          width: windowWidth,
          backgroundColor: "#030e0e",
          alignItems: "center",
          position: "absolute",
          bottom: 0,
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: FONTS.bwBlack,
            color: COLORS.white,
            textTransform: "uppercase",
            paddingVertical: 20,
          }}
        >
          Filter By Category
        </Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          snapToInterval={categoryWidth + 10}
          decelerationRate={"fast"}
          snapToAlignment={"start"}
          style={{ flex: 1, height: 180, width: windowWidth }}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={twoRowCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <FilledButton
          width={wp("95%")}
          text={"Apply"}
          onPress={onCategorySelectionComplete}              
        />
      </SafeAreaView>
    );
  };

  const onCategorySelectionComplete = () => {
    setShowCategoryFilter(false);
  };

  const renderCategoryItem = ({ item, index }) => {
    return (
      <View style={{ width: categoryWidth, marginHorizontal: 5 }}>
        <TouchableOpacity
          onPress={() => {
            onFeedCategoryItemPress(item[0], index);
          }}
        >
          <InterestItem
            title={item[0].category}
            icon={item[0].icon}
            isSelected={selectedCategories.includes(item[0].id)}  
          />
        </TouchableOpacity>
        {item.length > 1 ? (
          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => {
              onFeedCategoryItemPress(item[1], index);
            }}
          >
            <InterestItem
              title={item[1].category}
              icon={item[1].icon}
              isSelected={selectedCategories.includes(item[1].id)}      
            />
          </TouchableOpacity>
        ) : null}
        {item.length > 2 ? (
          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => {
              onFeedCategoryItemPress(item[2], index);
            }}
          >
            <InterestItem
              title={item[2].category}
              icon={item[2].icon}
              isSelected={selectedCategories.includes(item[2].id)}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const onFeedCategoryItemPress = (item, index) => {
    if (selectedCategories.includes(item.id)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== item.id));
    } else {
      setSelectedCategories((selectedCategories) => [
        ...selectedCategories,
        item.id,
      ]);
    }
  };

  const onCategoryFilterPress = () => {
    setShowCategoryFilter(!showCategoryFilter);
  };

  const calendarView = (type) => {
    let onCalendarDayPress;
    let minDate;
    let maxDate;
    if (type === "start") {
      onCalendarDayPress = onStartCalendarDayPress;
      minDate = new Date();
      maxDate = endFilter;
    } else if (type === "end") {
      let mDate = new Date();
      onCalendarDayPress = onEndCalendarDayPress;
      minDate = new Date(startFilter);
      const timezoneOffset = new Date().getTimezoneOffset();
      minDate.setMinutes(timezoneOffset);

      mDate.setFullYear(mDate.getFullYear() + 100);
      maxDate = mDate;
    }
    return (
      <View
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.8)",
          width: "100%",
          height: "100%",
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setEndShowCalendar(false);
            setStartShowCalendar(false);
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "gray",
              overflow: "hidden",
            }}
          >
            <Calendar
              minDate={minDate}
              maxDate={maxDate}
              onDayPress={onCalendarDayPress}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const onStartDateFilterPress = () => {
    if (useStartDateFilter) {
      let sDate = new Date();
      setStartFilter(sDate);
      setUseStartDateFilter(false);
    } else {
      setStartShowCalendar(true);
    }
  };

  const onEndDateFilterPress = () => {
    if (useEndDateFilter) {
      let eDate = new Date();
      eDate.setFullYear(eDate.getFullYear() + 100);
      setEndFilter(eDate);
      setUseEndDateFilter(false);
    } else {
      setEndShowCalendar(true);
    }
  };

  const onStartCalendarDayPress = (day) => {
    // let startDate = new Date(day.dateString);
    let startDate = new Date(day.dateString);
    startDate.setUTCHours(0, 0, 0);
    // setStartFilter(startDate);
    setStartFilter(startDate);
    setStartShowCalendar(false);
    setUseStartDateFilter(true);
  };

  const onEndCalendarDayPress = (day) => {
    // let startDate = new Date(day.dateString);
    let endDate = new Date(day.dateString);
    endDate.setUTCHours(23, 59, 59);
    // setStartFilter(startDate);
    setEndFilter(endDate);
    setEndShowCalendar(false);
    setUseEndDateFilter(true);
  };

  return (
      <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{
        width: windowWidth,
        height: "100%",        
        }}>
        <SafeAreaView
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: windowWidth,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                marginLeft: 10,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: !showCategoryFilter
                  ? "rgba(1,4,4,0.56)"
                  : "rgba(1,4,4,0.1)",
                flexGrow: 1,
                borderRadius: 10,
                opacity: !showCategoryFilter ? 1 : 0.1,
              }}
            >
              <Image
                style={{ width: 15, height: 15, marginLeft: 15 }}
                source={icon.search}
              />
              <TextInput
                style={{
                  paddingVertical: 10,
                  fontFamily: FONTS.bwMedium,
                  fontSize: 16,
                  marginLeft: 15,
                  color: "#cfd0d0",
                  flexGrow: 1,
                }}
                editable={!showCategoryFilter}
                placeholder="Search"
                placeholderTextColor="#ffffff80"
                value={search}
                onChangeText={onSearchChange}
              />
              {search.length > 0 ? (
                <TouchableOpacity
                  style={{ padding: 10, position: "absolute", right: 0 }}
                  onPress={() => {
                    onSearchChange("");
                  }}
                >
                  <Image
                    style={{ width: 15, height: 15, marginLeft: 15 }}
                    source={icon.clear_text}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity
              disabled={showCategoryFilter}
              style={{ padding: 10, opacity: !showCategoryFilter ? 1 : 0.1 }}
              onPress={() => {                
                navigation.goBack();
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.bwMedium,
                  fontSize: 16,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: windowWidth,
              marginLeft: 30,
            }}
          >
            <TouchableOpacity
              style={[styles.filterButton, {
                backgroundColor: showCategoryFilter || selectedCategories.length > 0
                  ? COLORS.white
                  : "transparent",
                
              }]}
              onPress={onCategoryFilterPress}
            >
              <Text style={{color: showCategoryFilter || selectedCategories.length > 0 ? "#102221" : COLORS.white, fontFamily: FONTS.bwMedium, fontSize: 11}}>{selectedCategories.length === 0
                  ? "Category"
                  : "Category (" + selectedCategories.length + ")"}</Text>
              {/* <TouchableOpacity style={{marginHorizontal: 5, display: showCategoryFilter || selectedCategories.length > 0 ? 'flex' : 'none' }} onPress={onCategoryFilterPress}>          
                <Text style={{...styles.feedSectionPillText}}>X</Text>
              </TouchableOpacity> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, {
                backgroundColor: useStartDateFilter
                  ? COLORS.white
                  : "transparent",
                
              }]}
              onPress={onStartDateFilterPress}
            >
              <Text style={{color: useStartDateFilter ? "#102221" : COLORS.white, fontFamily: FONTS.bwMedium, fontSize: 11}}>From Date</Text>
              <TouchableOpacity style={{marginHorizontal: 5, display: useStartDateFilter ? 'flex' : 'none' }} onPress={onStartDateFilterPress}>          
                <Text style={{...styles.feedSectionPillText}}>X</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, {
                backgroundColor: useEndDateFilter
                  ? COLORS.white
                  : "transparent",
                
              }]}
              onPress={onEndDateFilterPress}
            >
              <Text style={{color: useEndDateFilter ? "#102221" : COLORS.white, fontFamily: FONTS.bwMedium, fontSize: 11}}>To Date</Text>
              <TouchableOpacity style={{marginHorizontal: 5, display: useEndDateFilter ? 'flex' : 'none' }} onPress={onEndDateFilterPress}>          
                <Text style={{...styles.feedSectionPillText}}>X</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      <View style={{ flexGrow: 1 }}>
        <SectionList
          style={{ flex: 1 }}
          sections={data}
          keyExtractor={(item, index) => item + index}
          contentContainerStyle={{ paddingBottom: 80 }}
          stickySectionHeadersEnabled={false}
          renderItem={renderHorizontalList}
          renderSectionHeader={renderSectionHeader}
          /* renderSectionFooter={renderSectionFooter} */
        />
        {!showCategoryFilter ? null : (
          <View
            style={{
              position: "absolute",
              width: windowWidth,
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.9)",
            }}
          />
        )}
      </View>
      {showCategoryFilter ? categorySelection() : null}
      {showStartCalendar ? calendarView("start") : null}
      {showEndCalendar ? calendarView("end") : null}
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  feedSectionTitle: {
    fontFamily: FONTS.bwBlack,
    paddingVertical: 15,
    fontSize: 14,
    color: COLORS.white,
    alignSelf: "center",  
    textTransform: 'capitalize'  
  },
  filterButton: {
    marginHorizontal: 5,
    paddingHorizontal: 5,
    marginVertical: 14,
    borderColor: COLORS.white,
    borderRadius: 9,   
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",                  
    width: 'auto',
    height: 27,                             
    flexDirection: 'row',
  },
  feedSectionClearPill: {
    borderColor: COLORS.black,
    borderRadius: 50,
    borderWidth: 1,    
    height: 20,
    width: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',            
  },
  feedSectionPillText: {
    color: COLORS.black,
    fontFamily: FONTS.bwBold,
    fontSize: 10,
  },
});

export default SearchFilter;
