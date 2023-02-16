import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,  
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../helpers/colors";
import { NavBarShadow } from "../../components/NavBarShadow";
import { FONTS } from "../../helpers/fonts";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import SafeAreaView from "react-native-safe-area-view";
import MainFeedClubItem from "../../components/MainFeedClubItem";
import { ordinal_suffix_of } from "../../helpers/functions";
import InterestItem from "../../components/CategoryFeedItem";
import { icon, logo } from "../../helpers/assets";
import { FeedSections } from "../../components/FeedSection";
import { cardWidth, contentWidth, windowWidth, cardHeight } from "../../helpers/dimensions";
import NavigationBarButton from "../../components/NavigationBarButton";
import {
  fnGetCategories,
  fnGetImageURL,
  fnGetPopularEvents,
  fnGetSocieties,
  fnGetSuggestedSocieties,
  fnAddViewToSociety
} from "../../helpers/api";
import { selectProfile } from "../../slices/profileSlice";
import { useSelector } from "react-redux";
import HollowButton from "../../components/HollowButton";
import { errorAlert } from "../../helpers/alerts";
import { selectMySocieties } from "../../slices/mySocietiesSlice";
import { Calendar } from "react-native-calendars";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import messaging from '@react-native-firebase/messaging';
import SocietyCardFeedItem from "../../components/SocietyCardFeedItem";
import EventCardFeedItem from "../../components/EventCardFeedItem";
const categoryWidth = windowWidth * 0.5;

const TabHome = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const mySocieties = useSelector(selectMySocieties);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [interest, setInterests] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [events, setEvents] = useState([]);
  const [suggestedSocieties, setSuggestedSocieties] = useState([]);
  const [startFilter, setStartFilter] = useState(null);
  const [endFilter, setEndFilter] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isRefresh, setRefresh] = useState(false);

  const refDateContainerX = useRef(new Animated.Value(0.0)).current;
  const refBackButtonOpacity = useRef(new Animated.Value(0.0)).current;
  const refCategoryHeight = useRef(new Animated.Value(0.0)).current;
  
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.data,
      );
      // alert(JSON.stringify(remoteMessage.data))
      // alert('Ne event')
      if(remoteMessage.data.type==='0'){
        navigation.navigate('TabMyLife')
        // alert('Ne event')
      }else if(remoteMessage.data.type==='1'){
        navigation.navigate('TabMyLife')
        // alert('Ne post')
      }else if(remoteMessage.data.type==='2'){
        navigation.navigate('TabMessage')
        // alert('Ne Chat')
      }else if(remoteMessage.data.type==='4'){
        navigation.navigate('TabMyLife')
        // alert('Ne sceduke')
      }else if(remoteMessage.data.type==='5'){
        navigation.navigate('TabMyLife')
        // alert('Ne cancel')
      }
      console.log(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        // alert('Ne event')
        if (remoteMessage) {
          // alert(JSON.stringify(remoteMessage.data))
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.data,
          );
          if(remoteMessage.data.type==='0'){
            navigation.navigate('TabMyLife')
            // alert('Ne event')
          }else if(remoteMessage.data.type==='1'){
            navigation.navigate('TabMyLife')
            // alert('Ne post')
          }else if(remoteMessage.data.type==='2'){
            navigation.navigate('TabMessage')
            // alert('Ne Chat')
          }else if(remoteMessage.data.type==='4'){
            navigation.navigate('TabMyLife')
            // alert('Ne sceduke')
          }else if(remoteMessage.data.type==='5'){
            navigation.navigate('TabMyLife')
            // alert('Ne cancel')
          }
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }, []);

  const translateView = (ref, value) => {
    return Animated.timing(ref, {
      toValue: value,
      duration: 500,
      useNativeDriver: true,
    });
  };

  const animateOpacity = (ref, value) => {
    return Animated.timing(ref, {
      toValue: value,
      duration: 500,
      useNativeDriver: true,
    });
  };

  const animateCategoryContainerHeight = (height) => {
    return Animated.timing(refCategoryHeight, {
      toValue: height,
      duration: 200,
      useNativeDriver: false,
    });
  };

  const animateFindThings = () => {
    Animated.sequence([
      animateCategoryContainerHeight((63 * categories.length) / 2 + 75),
      Animated.parallel([
        translateView(refDateContainerX, -windowWidth),
        animateOpacity(refBackButtonOpacity, 1),
      ]),
    ]).start();
  };

  const animateInitFindThings = () => {
    Animated.sequence([
      Animated.parallel([
        translateView(refDateContainerX, 0),
        animateOpacity(refBackButtonOpacity, 0),
      ]),
      animateCategoryContainerHeight(0),
    ]).start();
  };

  useEffect(() => {
    fnGetCategories()
      .then((response) => {
        const data = response.data.data || [];
        setCategories(JSON.parse(JSON.stringify(data)));
        splitData(data, setInterests);
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again later");
      });
    fetchFeedData();
  }, []);

  const fetchFeedData = () => {
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear());
    let endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 100);
    let category = "";
    let society_id = 0;
    // fnGetSocieties()
    //   .then(async (response) => {
    //     // console.log(response)
    //     let dat = await response.json()
    //     console.log("socities",dat.data)
    //     const data = dat.data || [];
    //     setSocieties(data);
    //   })
    //   .catch((error) => {
    //     errorAlert("Error", "We’ve encountered a problem, try again later");
    //   })
    //   .finally(() => {
    //     setRefresh(false);
    //   });
    fnGetPopularEvents(100, 0, startDate, endDate, category, society_id)
      .then(async (response) => {
        let dat = await response.json()
        // alert(JSON.stringify(dat))
        // const data = dat?.data || [];
        setEvents(dat?.data.length>0?dat.data:[]);
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again later" + JSON.stringify(error));
      })
      .finally(() => {
        setRefresh(false);
      });
    fnGetSuggestedSocieties(100, 0, startDate, endDate, category, society_id)
      .then(async (response) => {
        let dat = await response.json()
        const data = dat.data || [];
        setSuggestedSocieties(data?.reverse());
      })
      .catch((error) => {
        errorAlert("Error", "We’ve encountered a problem, try again later");
      })
      .finally(() => {
        setRefresh(false);
      });
  };

  /**
   * Splice the data into sets of 2
   * @param data
   * @param setFunction
   */
  const splitData = (data, setFunction) => {
    let categoryData = data;
    let arrays = [],
      size = 2;
    while (categoryData.length > 0) {
      arrays.push(categoryData.splice(0, size));
    }
    return setFunction(arrays);
  };

  const getFormattedDate = () => {
    const month = moment().format("MMM");
    const day = moment().format("D");
    return ordinal_suffix_of(day) + " " + month;
  };

  const tabHeaderView = () => (
    <View style={styles.container}>
      <View style={styles.tabHeaderContainer}>
        <Image source={logo.header_icon} style={{height:30,width:30,resizeMode:'contain',tintColor:'white'}}/>
        <View
          style={{
            width: "100%",
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Text style={styles.headerDate}>{getFormattedDate()}</Text> */}
        </View>
        <View style={styles.divider} />
        <NavigationBarButton
          icon={icon.search}
          style={{ position: "absolute", right: 20 }}
          onPress={() => {
            navigation.navigate("SearchFilter", {});
          }}
        />
      </View>
    </View>
  );

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedInnerCategory, setSelectedInnerCategory] = useState('');

  const findCategories = [
    {title: 'Today'},
    {title: 'Tomorrow'},
    {title: 'This week'},
    {title: 'Pick a date'},
  ]

  const handleSelectCategory = (title) => {    
    if (title === 'Pick a date') {
      setShowCalendar(true);
    }
    setSelectedCategory(title)
    setSelectedInnerCategory('')
  }

  const handleSelectInnerCategory = (item) => { 
    const id = item.id;  
    setSelectedInnerCategory(item.category)

    // Set start and end date based on selected category
    let startDate = new Date();
    selectedCategory === 'Tomorrow' && startDate.setDate(startDate.getDate())
    startDate.setHours(0, 0, 0);
    let endDate = new Date();
    endDate.setDate(selectedCategory === 'This week' ? endDate.getDate() + 6 - endDate.getDay()  : endDate.getDate() + 1);
    endDate.setHours(23, 59, 59);    

    // search based on inner category item id
    let array = Array.from(new Set(selectedCategories).add(id));    
    navigation.navigate("SearchFilter", {
      selectedCategoriesArray: array,
      startDate: selectedCategory === 'Pick a date' ? startFilter.toISOString().split(".")[0] + "Z" : startDate.toISOString().split(".")[0] + "Z",
      endDate: selectedCategory === 'Pick a date' ? endFilter.toISOString().split(".")[0] + "Z" : endDate.toISOString().split(".")[0] + "Z",
    });
  }

  const handleClearCategories = () => {
    setSelectedCategory('')
    setSelectedInnerCategory('')
    setSelectedCategories(new Set())
  }

  const setStartEndDate = () => {
    let startDate = new Date();
    startDate.setDate(startDate.getDate());
    startDate.setHours(0, 0, 0);
    let endDate = new Date();
    endDate.setDate(selectedCategory === 'This week' ? endDate.getDate() + 6 - endDate.getDay()  : endDate.getDate() + 1);
    endDate.setHours(23, 59, 59);
    setStartFilter(startDate);
    setEndFilter(endDate);

    /* let startDate = new Date();
    startDate.setDate(startDate.getDate());
    startDate.setHours(0, 0, 0);
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(23, 59, 59);
    setStartFilter(startDate);
    setEndFilter(endDate);

    let startDate = new Date();
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 6 - endDate.getDay());
    endDate.setHours(23, 59, 59);
    setStartFilter(startDate);
    setEndFilter(endDate); */
  }

  const returnCategoryPills = () => {
    return findCategories.map((item, index) => (
      <TouchableOpacity style={[{...styles.feedSectionPill}, item.title === selectedCategory ? {backgroundColor: COLORS.white} : selectedCategory.length >= 1 && {display: 'none'}]} onPress={() => {handleSelectCategory(item.title)}}>
        <Text style={[{...styles.feedSectionPillText}, item.title === selectedCategory && {color: COLORS.black}]}>{item.title}</Text>
      </TouchableOpacity>
    ))
  }

  const returnInnerCategoryPills = () => {
    return categories.map((item, index) => (
      <TouchableOpacity style={[{...styles.feedSectionPill}, item.category === selectedInnerCategory && {backgroundColor: COLORS.white}]} onPress={() => {handleSelectInnerCategory(item)}}>
        <Text style={[{...styles.feedSectionPillText}, item.category === selectedInnerCategory && {color: COLORS.black}]}>{item.category}</Text>
      </TouchableOpacity>
    ))
  }

  const findThingView = () => (
    <View>
      <View style={{ ...styles.feedSectionHeader }}>
        <Text style={{ ...styles.feedSectionTitle }}>Find Things</Text>        
      </View>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <TouchableOpacity style={{...styles.feedSectionClearPill, display: selectedCategory.length >= 1 ? 'flex' : 'none' }} onPress={handleClearCategories}>          
          <Text style={{...styles.feedSectionPillText, fontSize: 13}}>X</Text>
        </TouchableOpacity>
        <ScrollView horizontal={true} style={{ ...styles.feedSectionPillContainer}}>           
          {returnCategoryPills()}
          {selectedCategory.length >= 1 && <View style={{...styles.dot}}><Text style={{color: COLORS.purple}}>.</Text></View>}
          {selectedCategory.length >= 1 && returnInnerCategoryPills()}
        </ScrollView>
      </View>
      {/* 
      <Animated.View
        style={{
          width: windowWidth * 2,
          flexDirection: "row",
          transform: [
            {
              translateX: refDateContainerX,
            },
          ],
        }}
      >
        <View style={{ marginHorizontal: 15, marginTop: -4 }}>
          {findThingDateSelection("Today", false, () => {
            let startDate = new Date();
            startDate.setHours(0, 0, 0);
            let endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);
            endDate.setHours(23, 59, 59);
            setStartFilter(startDate);
            
            setEndFilter(endDate);
            animateFindThings();
          })}
          {findThingDateSelection("Tomorrow", true, () => {
            let startDate = new Date();
            startDate.setDate(startDate.getDate());
            startDate.setHours(0, 0, 0);
            let endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);
            endDate.setHours(23, 59, 59);
            setStartFilter(startDate);
            setEndFilter(endDate);
            animateFindThings();
          })}
          {findThingDateSelection("This Week", false, () => {
            let startDate = new Date();
            let endDate = new Date();
            endDate.setDate(endDate.getDate() + 6 - endDate.getDay());
            endDate.setHours(23, 59, 59);
            setStartFilter(startDate);
            setEndFilter(endDate);
            animateFindThings();
          })}
          {findThingDateSelection("Pick a Date", false, () => {
            setShowCalendar(true);
          })}
        </View>
        <Animated.View
          style={{
            flex: 1,
            height: refCategoryHeight,
            overflow: "scroll",
          }}
        >
          {renderCategoryList()}
          <View>
            <HollowButton
              width={contentWidth}
              text="SHOW ME WHAT YOU GOT"
              onPress={() => {
                let array = Array.from(selectedCategories);
                // console.log({startFilter,endFilter})
                navigation.navigate("SearchFilter", {
                  selectedCategoriesArray: array,
                  startDate: startFilter.toISOString().split(".")[0] + "Z",
                  endDate: endFilter.toISOString().split(".")[0] + "Z",
                });
              }}
            />
          </View>
        </Animated.View>
      </Animated.View> */}
    </View>
  );

  const onCalendarDayPress = (day) => {
    let startDate = new Date(day.dateString);
    let endDate = new Date(day.dateString);
    endDate.setHours(23, 59, 59);
    setStartFilter(startDate);
    setEndFilter(endDate);
    setShowCalendar(false);
    /* animateFindThings(); */
  };

  const renderCategoryList = () => {
    return (
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: -7,
        }}
      >
        {categories.map((item, index) => {
          return renderThingCategoryItem(item, index);
        })}
      </View>
    );
  };

  const renderThingCategoryItem = (item, index) => {
    const id = item.id;
    const margin = Math.floor(windowWidth * 0.02);
    const additionalMargin = Math.floor(windowWidth * 0.005);
    return (
      <TouchableHighlight
        key={index}
        style={{
          minWidth: Math.floor(
            windowWidth * 0.45 - (margin * 2 + additionalMargin * 2)
          ),
          marginTop: 7,
          marginLeft: index % 2 === 0 ? margin : margin + additionalMargin,
          marginRight: index % 2 === 0 ? margin + additionalMargin : margin,
        }}
        underlayColor="none"
        onPress={() => {
          // navigation.navigate()
          if (selectedCategories.has(id)) {
            let newSet = new Set(selectedCategories);
            newSet.delete(id);
            setSelectedCategories(newSet);
          } else {
            setSelectedCategories(new Set(selectedCategories).add(id));
          }
        }}
      >
        <InterestItem
          title={item.category}
          icon={fnGetImageURL(item.image_url)}
          isSelected={selectedCategories.has(item.id)}
        />
      </TouchableHighlight>
    );
  };

  const findThingDateSelection = (title, isEven, onClick) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#132625",
        width: contentWidth,
        alignSelf: "center",
        height: 60,
        marginTop: 4,
        borderRadius: 3,
        overflow: "hidden",
      }}
      onPress={() => {
        onClick(title);
      }}
    >
      <LinearGradient
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        colors={isEven ? ["#0f201f", "#132625"] : ["#132625", "#0f201f"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <Text
          style={{
            color: COLORS.appYellow,
            fontFamily: FONTS.bwExtraBold,
            fontSize: 21,
          }}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSuggestItem = ({ item, index }) => {
    return (
      <SocietyCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight }}
        index={index}
        onItemPress={() => onFeedSuggestItemPress(item, index)}
      />
    )
    /* return (
      <MainFeedClubItem
        key={index}
        index={index}
        title={item.name}
        // background={fnGetImageURL(item.banner_url)}
        background={item.banner_url}
        description={item.description}
        // memberCount={item.memberCount - item.memberImages.length}
        memberCount={item?.member_count - Math.min(4, item?.members?.length)}
        members={item?.members?.filter((item, index) => {
          return index < 4;
        })
          .map((item) => {
            return item.avatar_url;
          })}
        isLast={index === events.length - 1}
        onItemPress={() => onFeedSuggestItemPress(item, index)}
      />
    ); */
  };

  const renderEventItem = ({ item, index }) => {
    return (
      <EventCardFeedItem
        item={item}
        style={{ width: cardWidth, height: cardHeight }}
        index={index}
        onItemPress={() => onFeedEventItemPress(item, index)}
      />
    )
    /* return (
      <MainFeedClubItem
        key={index}
        index={index}
        title={item.title}
        background={{uri:item.image_url}}
        // background={item.image_url}
        description={item.description}
        memberCount={item?.members - Math.min(4, item.members?.length)}
        members={item?.members?.filter((item, index) => {
          if (index < 4) {
            return item;
          }
        })
          .map((item) => {
            return item.avatar_url;
          })}
        isLast={index === events.length - 1}
        onItemPress={() => onFeedEventItemPress(item, index)}
      />
    ); */
  };

  // const renderSocietyItem = ({ item, index }) => {
  //     return <MainFeedClubItem index={index} title={item.name} background={fnGetImageURL(item.banner_url)}
  //                              description={item.description}
  //                              memberCount={36 - ['red', 'blue', 'yellow', 'green'].length}
  //                              members={['red', 'blue', 'yellow', 'green']}
  //                              isLast={index === societies.length - 1}
  //                              onItemPress={() => onFeedSocietyItemPress(item, index)}/>
  // };

  const onFeedSuggestItemPress = (item, index) => {

    const tempId =  item.society_id;
    // let dat = {
    //   societyId: item.id,
    //   user_id: profile.id
    // }
    let dat = {
      society_id: parseInt(tempId),
      user_id: parseInt(profile.id)
    }
    // alert(JSON.stringify(dat))
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

  const onFeedEventItemPress = (item, index) => {
    navigation.navigate("EventStack", {
      screen: "EventDetails",
      params: { eventId: item.id },
    });
  };

  const onFeedSocietyItemPress = (item, index) => {
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

  /**
   * Create category horizontal feed
   */
  const feedCategorySections = (title, data) => (
    <View>
      <View
        style={{
          ...styles.feedSectionHeader,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(255, 255, 255, .1)",
        }}
      >
        <Text style={styles.feedSectionTitle}>{title}</Text>
      </View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={categoryWidth + 10}
        decelerationRate={"fast"}
        snapToAlignment={"start"}
        style={{ ...styles.list, marginTop: 14, height: 120 }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={data}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );

  /**
   * Create category column
   */
  const renderCategoryItem = ({ item, index }) => {
    return (
      <View style={{ width: categoryWidth, marginHorizontal: 5 }}>
        <TouchableOpacity
          onPress={() => {
            onFeedCategoryItemPress(item[0], index);
          }}
        >
          <InterestItem title={item[0].category} icon={icon.basketball} />
        </TouchableOpacity>
        {item.length > 1 ? (
          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => {
              onFeedCategoryItemPress(item[1], index);
            }}
          >
            <InterestItem title={item[1].category} icon={icon.basketball} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const onFeedCategoryItemPress = (item, index) => {
    navigation.navigate("BrowseByCategory", { category: item.category });
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);
    fetchFeedData();
  }, []);

  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} locations={[0,0.8,1]} style={{ flex: 1}}>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: "never" }}>
        <ScrollView
          style={{ flex: 1, borderColor: "blue" }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              enabled={true}
              color={"#ffffff"}
              tintColor={"#ffffff"}
              refreshing={isRefresh}
              onRefresh={onRefresh}
            />
          }
        >
          <View
            style={{
              width: windowWidth,
              flex: 1,
              justifyContent: "center",
              alignItem: "center",
              paddingBottom: 80,
            }}
          >
            {tabHeaderView()}
            {findThingView()}
            {/*<FeedSections title={'WE THINK YOU\'D LIKE'} data={suggestedSocieties}*/}
            {/*              renderItem={renderSuggestItem}*/}
            {/*              snapWidth={cardWidth + 10} listStyle={{ height: 150 }}/>*/}
            {events.length !== 0 ? (
              <FeedSections
                title={"Popular events"}
                data={events}
                renderItem={renderEventItem}
                snapWidth={cardWidth + 10}
                listStyle={{ height: cardHeight }}
              />
            ) : null}

            <FeedSections
              title={"Featured groups"}
              data={suggestedSocieties}
              renderItem={renderSuggestItem}
              snapWidth={cardWidth + 10}
              listStyle={{ height: cardHeight }}
            />
            {/* {feedCategorySections("BROWSE BY CATEGORY", interest)} */}
          </View>
        </ScrollView>
      </SafeAreaView>
      {/* <NavBarShadow /> */}
      {showCalendar ? (
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.8)",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
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
            <Calendar minDate={new Date()} onDayPress={onCalendarDayPress} />
          </View>
        </View>
      ) : null}
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
  tabHeaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: contentWidth,
    height: 100,
  },
  headerDate: {
    color: "#8d8d93",
    fontFamily: FONTS.bwBlack,
    fontSize: 14,
    alignContent: "center",
  },
  divider: {
    height: 3,
    color: "red",
    width: contentWidth,
  },
  feedSectionHeader: {
    flex: 1,    
    width: '100%',    
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,    
  },
  feedSectionTitle: {
    fontFamily: FONTS.bwBold,
    fontWeight: 'normal',
    fontSize: 18,
    color: COLORS.white,
    alignSelf: "flex-start",
  },
  feedSectionPillContainer: {
    width: '100%',
    flexDirection: 'row',
    overflow: 'scroll'
  },
  feedSectionClearPill: {
    borderColor: COLORS.white,
    borderRadius: 50,
    borderWidth: 1,    
    height: 30,
    width: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',        
    marginLeft: 5,
  },
  feedSectionPill: {
    borderColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,    
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',        
    marginLeft: 5,
  },
  feedSectionPillText: {
    color: COLORS.white,
    fontFamily: FONTS.bwBold,
    fontSize: 13,
  },
  feedSectionCaption: {
    fontFamily: FONTS.bwMedium,
    fontSize: 13,
    color: "#b0b0b0",
    alignSelf: "center",
  },
  dot: {
    color: COLORS.purple,
    marginLeft: 5,    
  },
  list: {
    flex: 1,
    flexDirection: "row",
  },
});
export default TabHome;
