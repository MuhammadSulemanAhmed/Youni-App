import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { icon, placeholderImages } from "../../helpers/assets";
import { FONTS } from "../../helpers/fonts";
import { COLORS } from "../../helpers/colors";
import React, { useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectEmail, } from "../../slices/profileSlice";
import axios from "axios";
import { fnGetImageURL } from "../../helpers/api";

/**
 * Component used to display purchased ticket in feed
 *
 * @param index
 * @param title
 * @param eventDate
 * @param numTickets
 */
const TicketFeedItem = ({ index, title, eventDate, numTickets, eventImageID, showArrow, onPress, ticket_type_id, titcketClass }) => {
  const userEmail = useSelector(selectEmail);
  const [ticketId, setTicketId] = useState();

  const api = axios.create({
    /* baseURL: "http://localhost:5000/api", // DEV */
    baseURL: "http://18.134.155.19:3000/", // PRODUCTION
  });

  async function HandleGetTicketId(data) {
    return await api.post("/ticketauth/getticketid", {
      email: userEmail,
    });
  }

  if (api != null) {
    try {
      HandleGetTicketId()
        .then((res) => {
          setTicketId(res.data.ticketid);
        })
        .catch((err) => {
          console.log("Err: ", err);
        });
    } catch (e) {
      console.log("Main Err: ", e);
    }
  }

  return (
    <TouchableOpacity style={{ ...styles.item, marginTop: index === 0 ? 0 : 5 }}
      onPress={() => {
        onPress()
      }}
    >
      <Image
        style={{
          width: 61,
          height: 58,
          resizeMode: "cover",
          borderRadius: 14,
          overflow: "hidden",
        }}
        source={eventImageID === null
          ? placeholderImages.profile_banner_placeholder
          : { uri: eventImageID }}
      />
      <View style={{ marginLeft: 25 }}>
        <Text
          style={{ color: "#cfd0d0", fontFamily: FONTS.bwBold, fontSize: 15 }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {titcketClass === null ? null :
          <Text
            style={{
              marginTop: 3,
              color: "#cfd0d0",
              fontFamily: FONTS.bwMedium,
              fontSize: 11,
            }}
          >
            Ticket Type: {titcketClass}
          </Text>
        }
        <Text
          style={{
            marginTop: 3,
            color: "#cfd0d0",
            fontFamily: FONTS.bwMedium,
            fontSize: 11,
          }}
        >
          {moment(eventDate).format("dddd, MMM D, yyyy h:mm a")}
        </Text>
        {ticket_type_id === null ? null :

          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
          >
            <Image
              style={{
                width: 6,
                height: 9,
                tintColor: COLORS.white,
                resizeMode: "contain",
              }}
              source={icon.ticket}
            />
            {/* <Text
            style={{
              color: '#cfd0d0',
              fontFamily: FONTS.bwMedium,
              fontSize: 11,
              marginLeft: 6,
            }}>{`${numTickets} Tickets`}</Text> */}

            <Text
              style={{
                color: "#cfd0d0",
                fontFamily: FONTS.bwMedium,
                fontSize: 11,
                marginLeft: 6,
              }}
            >
              Ticket ID: {ticket_type_id}
            </Text>

          </View>
        }
      </View>
      {showArrow ?
        <Image
          style={{ position: "absolute", right: 50 }}
          source={icon.right_arrow}
        />
        : null}

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 30,
    height: 90,
    alignItems: "center",
  },
});
export default TicketFeedItem;
