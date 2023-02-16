import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../helpers/colors";
import { FONTS } from "../../helpers/fonts";

const windowWidth = Dimensions.get("window").width;
const contentWidth = windowWidth - 30;

/**
 * Component Item used to display horizontal feed
 *
 * @param title
 * @param data
 * @param renderItem - Render component
 * @param snapWidth - Autoscroll width
 * @param listStyle - styling for the feed component
 * @param titleStyle - styling for the title component
 * @param listContentContainerStyle - style for container for the horizontal feed
 */

export const FeedSections = ({
  title,
  data,
  renderItem,
  snapWidth,
  listStyle,
  titleStyle,
  listContentContainerStyle,
}) => (
  <View>
    <View
      style={{
        ...styles.feedSectionHeader,
        /* borderBottomWidth: StyleSheet.hairlineWidth, */
        borderColor: "rgba(255, 255, 255, .1)",
        ...titleStyle,
      }}
    >
      <Text style={styles.feedSectionTitle}>{title}</Text>
    </View>
    <FlatList
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      snapToInterval={snapWidth}
      decelerationRate={"fast"}
      snapToAlignment={"start"}
      contentContainerStyle={{
        paddingHorizontal: 10,
        ...listContentContainerStyle,
      }}
      style={{ ...styles.list, ...listStyle }}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  </View>
);

const styles = StyleSheet.create({
  feedSectionHeader: {
    flex: 1,
    marginTop: 20,
    paddingTop: 20,
    justifyContent: "center",
    alignSelf: "center",
    width: contentWidth,
  },
  feedSectionTitle: {
    fontFamily: FONTS.bwBold,
    fontSize: 21,
    color: COLORS.white,
    alignSelf: "flex-start",
  },
  list: {
    flex: 1,
    flexDirection: "row",
    marginTop: 14,
  },
});
