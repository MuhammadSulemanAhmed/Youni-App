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
const TicketFeedItem = ({ index, title, eventDate,onPressDetail, numTickets, eventImageID, showArrow, onPress, ticket_type_id, titcketClass, showBottom }) => {
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
    <TouchableOpacity style={{ ...styles.item, marginTop: index === 0 ? 10 : 5 }}
      onPress={() => {
        onPressDetail()
      }}
      activeOpacity={1}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View
          style={{
            marginTop: 10,
            width:'65%',
            // backgroundColor:"red" 
          }}
        >
          <Text
            style={{ color: "white", fontFamily: FONTS.bwBold, fontSize: 16,}}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text
            style={{
              marginTop: 3,
              color: "#8E8E8E",
              fontFamily: FONTS.bwMedium,
              fontSize: 14,
            }}
          >
            {moment(eventDate).format("ddd, DD MMM  .  hh:mm ")}
          </Text>
        </View>
        <Image
          style={{
            width: 104,
            height: 104,
            resizeMode: "cover",
            borderRadius: 14,
            overflow: "hidden",
          }}
          source={eventImageID === null
            ? placeholderImages.profile_banner_placeholder
            : { uri: eventImageID }}
        />
      </View>
      {showBottom ?
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'space-between'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.purple,
                height: 40,
                width: '55%',
                justifyContent: 'center',
                alignItems: "center",
                borderRadius: 15,
               
              }}
              onPress={()=>{
                onPress()
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: FONTS.bwMedium,
                  // marginHorizontal:10
                }}
              >See tickets</Text>
            </TouchableOpacity>
            {/* <View
              style={{
                flexDirection: 'row',
                marginLeft: 15,
                alignItems: 'center'
              }}
            >
              <Image
              source={icon.account_p}
                style={{
                  height: 26,
                  width: 26,
                  tintColor:COLORS.purple,
                  marginRight:5
                }}
              />
              <Text
                style={{
                  color: COLORS.purple,
                  fontSize: 14,
                  fontFamily: FONTS.bwMedium
                }}
              >{numTickets} going</Text>
            </View> */}
          </View>
          {/* <TouchableOpacity

          >
            <Image
            source={icon.upload}
              style={{
                height: 30,
                width: 30,
                tintColor:COLORS.purple
              }}
            />
          </TouchableOpacity> */}
        </View>
        :
        null
      }
      {/* <View style={{ marginLeft: 25 }}>
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

      {/* <Text
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
        : null} */}

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#1D1E29",
    padding: 10,
    borderRadius: 15,
    marginBottom: 10
    // flexDirection: "row",
    // backgroundColor: "rgba(0,0,0,0.3)",
    // paddingHorizontal: 30,
    // height: 90,
    // alignItems: "center",
  },
});
export default TicketFeedItem;
