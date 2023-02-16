import axios from "axios";
import { add } from "lodash";
import moment from "moment";
import { AsyncStorage } from "react-native";
import { setProfile } from "../slices/profileSlice";
// export const URLB="http://192.168.10.16:3000"
// export const BASEURL="http://192.168.10.16:3000"

export const URLB = "https://api.myscroll.co.uk"
const BASEURL = "https://api.myscroll.co.uk"


// export function getBaseUrl() {
//   return "https://goapi.myscroll.co.uk";

// }

const ax = axios.create({
  baseURL: BASEURL,
  timeout: 60000,
  withCredentials: true,
});

// ax.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     if (__DEV__) {
//       // fnLogAPIResponse(response)
//     }
//     if (response.config.url === "/users/me/") {
//       setProfile(response.data.data);
//     }

//     return response;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     if (__DEV__) {
//       fnLogAPIError(error);
//     }

//     return Promise.reject(error);
//   }
// );

// ax.interceptors.request.use((request)=>{
//     console.log('Intercept Request Header', request.headers)
//     return request
// })

export function fnLogAPIResponse(response) {
  console.log(
    "---------------------------------------- API Response ------------------------------------------"
  );
  console.log("URL", response.config.baseURL + response.config.url);
  console.log("Method", response.config.method);
  console.log("Response Header", response.headers);
  console.log("Request", response.config.data);
  console.log("Data", JSON.stringify(response.data, null, 4));
  console.log(
    "---------------------------------------------------------------------------------------------\n"
  );
}

export function fnLogAPIError(error) {
  console.log(
    "---------------------------------------- API ERROR ------------------------------------------"
  );

  if (error.response) {
    console.log(
      "Error URL",
      error.response.config.baseURL + error.response.config.url
    );
    console.log("Method", error.response.config.method);
    console.log("Response Header", error.response.headers);
    console.log("Error Request", error.response.config.data);
    console.log("Error Code", error);
    console.log("Error Data", error.response.data);
  } else {
    console.log("error", error.message);
  }
  console.log(
    "---------------------------------------------------------------------------------------------\n"
  );
}

function getHeaderConfig(contentType = "application/json") {
  return {
    headers: {
      "Content-Type": contentType,
    },
  };
}

export function fnTestConnection() {
  return ax.get("/v1/groups", getHeaderConfig());
}

/**
 Endpoint: /v1/signup
 Method: POST
 Request:{
    username: string,
  email: string,
  password: string,
  name: string,
  school: string,
}
 Response:{
    id: string,
    username: string,
  email: string,
  password: string,
  name: string,
  school: string,
}
 */

export function fnCreateAccount(
  email = "",
  password = "",
  firstName = "",
  lastName = "",
  school,
  college
) {
  const data = {
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    school: "University of Oxford",
    jcr: college,
  };
  return ax.post(BASEURL+"/users/signup", data, getHeaderConfig());
}

/**
 Endpoint: /v1/login
 Method: POST
 Request:{
    email: "",
    password: "",
}
 Response:{}
 */

export function fnLogin(email, password) {
  const data = {
    email: email,
    password: password,
  };
  return ax.post("/users/login", data, getHeaderConfig());
}

/**
 Endpoint: /v1/categories
 Method: GET
 Request:{}
 Response:
 {
  "data": [
    {
      "id": 1,
      "created_at": "2020-10-17T07:42:24.143696Z",
      "updated_at": "2020-10-17T07:42:24.143696Z",
      "category": "Sport"
    },
  ],
  "message": "success",
  "error": ""
}
 */

export function fnGetCategories() {
  return ax.get("/events/categories", getHeaderConfig());
}

/**
 Endpoint: /v1/societies
 Method: GET
 Request:{}
 Response:{
  "data": [
    {
      "id": 5,
      "created_at": "2020-10-16T18:40:27.933191Z",
      "updated_at": "2020-10-16T18:40:27.933191Z",
      "name": "UCL",
      "description": ""
    }
  ],
  "message": "success",
  "error": ""
}
 */

export function fnGetSocieties() {
  return fetch(BASEURL + "/society/featured_society", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  // return ax.get("/v1/societies", getHeaderConfig());
}
export async function fnAddViewToSociety(data) {
  // await AsyncStorage.removeItem("viewlist")
  // return
  let list = await AsyncStorage.getItem("viewlist", null)
  let addData = true
  let temp = []
  if (list !== null) {
    temp = await JSON.parse(list)
  }
  console.log(temp)
  if (temp === null) {
    // alert('2')
    // let da1 = []
    // da1.push({
    //   society_id: data.society_id,
    //   user_id: data.user_id,
    //   date: moment(new Date()).format("DD-MM-YYYY")
    // })
    // await AsyncStorage.setItem("viewlist", JSON.stringify(da1))
    addData = true
  } else {
    temp.forEach((ele) => {
      if (ele.society_id === data.society_id) {
        if (ele.date === moment(new Date()).format("DD-MM-YYYY")) {
          // alert(moment(new Date()).format("DD-MM-YYYY"))
          addData = false
        }
      }
    })

  }
  if (addData) {
    let call = await fetch(BASEURL + "/users/add_view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then(async (re) => {
        let json = await re.json()
        console.log("===>add view",json)
      })

    temp.push({
      society_id: data.society_id,
      user_id: data.user_id,
      date: moment(new Date()).format("DD-MM-YYYY")
    })
    await AsyncStorage.setItem("viewlist", JSON.stringify(temp))
  } else {
    console.log("not added")
  }
  return
  if (list == null) {
    addData = true
  } else {
    temp = await JSON.parse(list)
    for (var i = 0; i < temp?.length; i++) {
      if (temp[i].society_id === data.society_id) {
        if (temp[i].date === moment(new Date()).format("DD-MM-YYYY")) {
          addData = false
        } else {

          temp.push({
            societyId: data.society_id,
            user_id: data.user_id,
            date: moment(new Date()).format("DD-MM-YYYY")
          })
          await AsyncStorage.setItem("viewlist", JSON.stringify(list))
          // addData = true
        }
      }
    }
  }
  console.log("=========>", temp)
  if (addData) {
    alert('as')
    temp.push({
      society_id: data.society_id,
      user_id: data.user_id,
      date: moment(new Date()).format("DD-MM-YYYY")
    })
    await AsyncStorage.setItem("viewlist", JSON.stringify(list))
  }

  if (addData) {
    fetch(BASEURL + "/users/add_view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then(async (res) => {
        let da = await res.json()
        let list = await AsyncStorage.getItem("viewlist", null)
        let temp = []
        temp = await JSON.parse(list)
        let da1 = []

        if (list === null) {
          console.log('1')
          da1.push({
            societyId: data.society_id,
            user_id: data.user_id,
            date: new Date()
          })
          await AsyncStorage.setItem("viewlist", JSON.stringify(da1))
        } else {
          let list = await AsyncStorage.getItem("viewlist", null)
          let temp = []
          temp = await JSON.parse(list)
          temp.push({
            societyId: data.society_id,
            user_id: data.user_id,
            date: new Date()
          })
          console.log('added', temp)
          await AsyncStorage.setItem("viewlist", JSON.stringify(list))
        }
      })
  }
  // return ax.get("/v1/societies", getHeaderConfig());
}

/**
 Endpoint: /v1/logout
 Method: GET
 Request:{}
 Response:{
  "data": null,
  "message": "success",
  "error": ""
}
 */
export function fnLogout() {
  return ax.get("/users/logout", getHeaderConfig());
}

export function fnDeleteUser(email) {
  const data = {
    email: email    
  };
  return ax.post("/users/delete_user", data, getHeaderConfig());
}

/**
 Endpoint: /v1/users/me/
 Method: GET
 Request:{}
 Response:{
  data: {
    "id": 19,
    "created_at": "2020-10-21T12:37:05.625894Z",
    "updated_at": "2020-10-21T12:37:05.625894Z",
    "first_name": "Samuel",
    "last_name": "Virgo",
    "email": "samuelvirgoadmin@gmail.com",
    "password": "$2a$10$XLhaRnPcwdbXFke.TGRoou5VI1RdRCc1MKFJVSjyVH9TeRJu3diom",
    "school": "UCL",
    "society": 14,
    "phone": "+447749473045"
  },
  "message": "success",
  "error": ""
}
 */

export function fnGetMyProfile(token) {
  return ax.get(BASEURL + "/users/me", {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token

    }
  });
}

/**
 Endpoint: /v1/users
 Method: PUT
 Request:
 {
    "first_name": "Samuel",
    "last_name": "Virgo",
    "email": "samuelvirgo5@gmail.com",
    "school": "UCL",
    "phone": "",
    “jcr”:””,
 }
 Response:{
  data: null,
  "message": "success",
  "error": ""
 }
 */

export function fnSetMyProfile(profile) {
  return ax.put(BASEURL+"/users/", profile, getHeaderConfig());
}

/**
 Endpoint: /v1/users/password
 Method: PUT
 Request:
 {
    "password": "password",
 }
 Response:{
  data: null,
  "message": "success",
  "error": ""
 }
 */

export async function fnSetPassword(newpassword, oldpassword) {
  let jwtTOken = await AsyncStorage.getItem('token', null)
  const data = {
    "new_password": newpassword,
    "password": oldpassword
  };
  return ax.post(BASEURL + "/users/edit_password", data, {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": jwtTOken
    }
  });
}

/**
 Endpoint: /v1/users/profile_picture
 Method: File
 Request:{
    uploadfile: FILE
 }
 Response:{
  data: null,
  "message": "success",
  "error": ""
 }
 */
 export function fnUpdateProfilePictureURL(jwtoken,picture) {
  return fetch(BASEURL+`/users/profile_image`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'accept': 'application/json',
      "x-auth-token":jwtoken
    },
    body: JSON.stringify(picture)
  })
}
export function fnSetProfilePicture(picture) {
  return fetch(`https://api.myscroll.co.uk/media`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      'accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
     
      // "Content-Type": "application/json",
    },
    body: picture
  })
  return axios.post(`https://api.myscroll.co.uk/media`, picture, {
    headers: {
      "Content-Type": "multipart/form-data",
      'accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
      // "Content-Type": "application/json",
    },
  });
  return ax.put(
    BASEURL + "/users/image",
    picture,
    getHeaderConfig("application/json")
  );
}

/**
 Endpoint: /v1/user_categories
 Method: POST
 Request:
 {
  [
    {
      category_id: 1
    },
    {
      category_id: 2
    }
  ]

 }
 Response:{
  data: null,
  "message": "success",
  "error": ""
 }
 */

export async function fnSetProfileCategories(categories) {
  let jwtTOken = await AsyncStorage.getItem('token', null)
  console.log(categories)
  return ax.post(BASEURL+"/events/user_categories", categories,{
    headers:{
      "Content-Type": "application/json",
      "x-auth-token": jwtTOken
    }
  });
}

/**
 Endpoint: /v1/user_categories
 Method: GET
 Request:
 {}
 Response:{
  data: null,
  "message": "success",
  "error": ""
 }
 */
export async function fnGetProfileCategories() {
  let jwtTOken = await AsyncStorage.getItem('token', null)
  return ax.get(BASEURL + "/events/user_categories", {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": jwtTOken
    }
  });
}

/**
 Endpoint: /v1/societies/suggested
 Method: POST
 Request:
 {
   "limit": 3,
   "offset": 0
 }

 Response:{
  "data": [
    {
      "name": "UCL Update Name",
      "description": "New description   ",
      "member_count": 2,
      "members": [
        {
          "first_name": "Samuel",
          "last_name": "Virgo"
        },
        {
          "first_name": "James",
          "last_name": "Virgo"
        }
      ],
      "id": 14
    },
  ],
  "message": "success",
  "error": ""
}
 }
 */

export function fnGetSuggestedSocieties(
  limit,
  offset,
  startAt = null,
  endAt = null,
  category = "",
  societyId = 0,
  text = ""
) {
  let data = {
    limit: limit,
    offset: offset,
    start_at: startAt,
    end_at: endAt,
    category: category,
    society_id: societyId,
    text: text,
  };
  return fetch(BASEURL + "/society/featured_society", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  // return ax.post("/v1/societies/suggested", data, getHeaderConfig());
}

/**
 Endpoint: /v1/society_members/bulk
 Method: POST
 Request:
 {
[
  {
    society_id: 1
  },
  {
    society_id: 2
  }
]

 }

 Response:{
  "data": null,
  "message": "success",
  "error": ""
}
 */
export function fnVerifyPromoCode(eventId,code) {
  // return fetch(`http://18.134.155.19:3000/events/tickets/${eventId}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // })
  return ax.get(`/events/verify_coupon?event_id=${eventId}&coupon=${code}`, getHeaderConfig());
}
export function fnVerifySecretCode(eventId,code) {
  // return fetch(`http://18.134.155.19:3000/events/tickets/${eventId}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // })
  return ax.get(`/events/verify_secret?event_id=${eventId}&code=${code}`, getHeaderConfig());
}
export function fnSetProfileSocieties(societies) {
  return ax.post("/v1/society_members/bulk", societies, getHeaderConfig());
}

/**
 Endpoint: /v1/society_members/{society_id}/
 Method: POST
 Request:{}
 Response:{
  "data": null,
  "message": "success",
  "error": ""
}
 */

export function fnFollowSociety(societyId) {
  return ax.post(`/v1/society_members/${societyId}/`, getHeaderConfig());
}

export function fnFollowSocietyNode(user_id, society_id) {
  console.log({ user_id, society_id });
  const url = BASEURL + "/users/follow";
  return fetch(url, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      user_id,
      society_id,
    }),
  });
}
/**
 Endpoint: /v1/society_members/{society_id}/
 Method: POST
 Request:{}
 Response:{
  "data": null,
  "message": "success",
  "error": ""
}
 */

export function fnUnfollowSociety(societyId) {
  return ax.delete(`/v1/society_members/${societyId}/`, getHeaderConfig());
}

export function fnUnfollowSocietyNode(user_id, society_id) {
  console.log({ user_id, society_id });
  const url = BASEURL + "/users/unfollow";
  return fetch(url, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      user_id,
      society_id,
    }),
  });
}

/**
 Endpoint: /v1/societies/user
 Method: GET
 Request:{}
 Response:{
  "data": [
    {
      "id": 14,
      "name": "UCL Update Name",
      "description": "New description   ",
      "events": [
        {
          "title": "Football Match  Update....         ",
          "start_at": "2020-10-08T11:15:00Z",
          "end_at": "2020-10-28T12:18:00Z"
        }
      ]
    }
  ],
  "message": "success",
  "error": ""
}
 */

// nav index
// tabMyLyf
// society details
export function fnGetProfileSocieties() {
  return ax.get("/v1/societies/user", getHeaderConfig());
}

export function fnGetProfileSocietiesNode(userId) {
  return fetch(BASEURL + `/users/followed/${userId}`);
}

/**
 Endpoint: /v1/scheduled_events/popular
 Method: POST
 Request:{
   "limit": 3,
   "offset": 0,
   “start_at”: date_time,
   “end_at”: date_time,
   “category”:”” (can leave as empty string to ignore this filter),
   “society_id”: 5 (can set to 0 to ignore this filter)
   "Text": ""
}

 Response:{
  "data": [
    {
      "event_id": 18,
      "start_at": "2020-11-05T23:00:00Z",
      "end_at": "2020-11-06T23:00:00Z",
      "sold_ticket_count": 1,
      "id": 1,
      "title": "Football Match  Update....         ",
      "category": "Sport          ",
      "location": "Downs                   ",
      "description": "Updating description. ",
      "members": [
        {
          "first_name": "...",
          "last_name": "..."
        }
      ]
    }
  ],
  "message": "success",
  "error": ""
}
 */

export function fnGetPopularEvents(
  limit,
  offset,
  startDate = null,
  endDate = null,
  category = "",
  societyId = 0,
  text = ""
) {
  let startAt =
    startDate === null ? null : startDate.toISOString().split(".")[0] + "Z";
  let endAt =
    endDate === null ? null : endDate.toISOString().split(".")[0] + "Z";
  let data = {
    limit: limit,
    offset: offset,
    start_at: startAt,
    end_at: endAt,
    category: category,
    society_id: societyId,
    text: text,
  };
  return fetch(BASEURL + "/events/popular", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // body:data
  })
  // return ax.post("/v1/scheduled_events/popular", data, getHeaderConfig());
}

/**
 Endpoint: /v1/scheduled_events/user
 Method: POST
 Request:{
   "limit": 3,
   "offset": 0,
   “start_at”: date_time,
   “end_at”: date_time,
   “category”:”” (can leave as empty string to ignore this filter),
   “society_id”: 5 (can set to 0 to ignore this filter)
}

 Response:{
  "data": [
    {
      "start_at": "2020-10-21T23:00:00Z",
      "end_at": "2020-10-22T23:00:00Z",
      "event_id": 12,
      "num_tickets": 1,
      "title": "Football",
      "description": "",
      "category": "Sport",
      "tickets": [
        {
          "name": "VIP"
        }
      ]
    }
  ],
  "message": "success",
  "error": ""
}
 */

export function fnGetScheduleEventDetails(eventId) {
  return ax.get(`/v1/scheduled_event_detail/${eventId}/`, getHeaderConfig());
}

/**
 Endpoint: /v1/scheduled_events/user
 Method: POST
 Request:{
   "limit": 3,
   "offset": 0,
   “start_at”: date_time,
   “end_at”: date_time,
   “category”:”” (can leave as empty string to ignore this filter),
   “society_id”: 5 (can set to 0 to ignore this filter)
}

 Response:{
  "data": [
    {
      "start_at": "2020-10-21T23:00:00Z",
      "end_at": "2020-10-22T23:00:00Z",
      "event_id": 12,
      "num_tickets": 1,
      "title": "Football",
      "description": "",
      "category": "Sport",
      "tickets": [
        {
          "name": "VIP"
        }
      ]
    }
  ],
  "message": "success",
  "error": ""
}
 */

export function fnGetUserEvents(
  userId,
  limit,
  offset,
  startDate = null,
  endDate = null,
  category = "",
  societyId = 0,
  text = "",

) {
  let startAt =
    startDate === null ? null : startDate.toISOString().split(".")[0] + "Z";
  let endAt =
    endDate === null ? null : endDate.toISOString().split(".")[0] + "Z";
  let data = {
    limit: limit,
    offset: offset,
    start_at: startAt,
    end_at: endAt,
    category: category,
  };
  // return fetch(BASEURL + `/events/tickets/${userId}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // })
  return ax.get(BASEURL + `/events/tickets/${userId}`,  {
     headers: {
        "Content-Type": "application/json",
      }})
}

export function fnGetUserPastEvents(
  userId,
  limit,
  offset,
  startDate = null,
  endDate = null,
  category = "",
  societyId = 0,
  text = "",

) {
  let startAt =
    startDate === null ? null : startDate.toISOString().split(".")[0] + "Z";
  let endAt =
    endDate === null ? null : endDate.toISOString().split(".")[0] + "Z";
  let data = {
    limit: limit,
    offset: offset,
    start_at: startAt,
    end_at: endAt,
    category: category,
  };
  return fetch(BASEURL + `/events/past_events/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  // return ax.post("/v1/scheduled_events/user", data, getHeaderConfig());
}

export function fnAddUserFCMTOKEN(
  userId,
  token
) {
  let data = {
    "token": token,
    "user_id": userId
  };
  return fetch(BASEURL + `/users/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
  // return ax.post("/v1/scheduled_events/user", data, getHeaderConfig());
}

/**
 Endpoint: /v1/society_updates/{society_id}/
 Method: GET
 Request:{}

 Response:{
  "data": [
    {
      "id": 11,
      "created_at": "2020-10-19T15:18:21.197052Z",
      "updated_at": "2020-10-19T15:18:21.197052Z",
      "post": "Posting my first update",
      "society_id": 5,
      "user_id": 10
    },
  ]
}
 */
export function fnGetSocietyUpdates(societyId) {
  // return ax.get(`/v1/society_updates/${societyId}`, getHeaderConfig());
  // return fetch(`https://goapi.myscroll.co.uk/v1/society_updates/${societyId}/`);
  return fetch(BASEURL + `/society/posts?post_id=${societyId}`);

}

/**
 Endpoint: /v1/society_updates/{society_id}/
 Method: GET
 Request:{}

 Response:{
  "data": [
    {
      "first_name": "Samuel",
      "last_name": "Virgo",
      "email": "samuelvirgo5@gmail.com",
      "school": "UCL",
      "id": 10,
      "phone": "+447749473045",
      "admin": true
    }
  ]
}
 */
export function fnGetSocietyMembers(societyId) {
  return ax.get(`/v1/society_members/${societyId}/`, getHeaderConfig());
}

export function fnGetSocietyFollowersNode(societyId) {
  // https://api.myscroll.co.uk/society/
  // const url = `https://api.myscroll.co.uk/users/followers/${societyId}`;

  const url = BASEURL + `/users/followers/${societyId}`;
  return fetch(url);
}
export function fnGetSocietyMembersNode(societyId) {
  // https://api.myscroll.co.uk/society/
  // const url = `https://api.myscroll.co.uk/users/followers/${societyId}`;

  const url = BASEURL + `/users/team_member?society_id=${societyId}`;
  return fetch(url);
}

/**
 Endpoint: /v1/chat
 Method: POST
 Request:{
    users: [{user_id: 1}],
    societies: [{society_id: 1}]
 }
 Response:{
  "data": [
    {
        "data": null,
        "message": "success",
        "error": ""
    }
  ]
}
 */
export function fnCreateChatRoom(societyId, userId) {
  let data = {
    users: [{ user_id: userId }],
    societies: [{ society_id: societyId }],
  };
  return fetch(BASEURL + `/users/chat?user_id=${userId}&society_id=${societyId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  // return ax.post("/v1/chats", data, getHeaderConfig());
}

/**
 Endpoint: /v1/existing_chat/{society_id}/
 Method: GET
 Request:{}
 Response:{
  "data": [
    {
        "data": null,
        "message": "success",
        "error": ""
    }
  ]
}
 */
export function fnCheckExistingChatRoom(societyId) {
  return fetch(BASEURL + '/users/chat_list/user?user_id=' + societyId, {
    method: "GET",
    headers: {
      "Content-Type": "application.json"
    }
  })
  return fetch(BASEURL + `/existing_chat/${societyId}/`, getHeaderConfig());
}

/**
 Endpoint: /v1/chats
 Method: GET
 Request:{}
 Response:{
  "data": [
    {
      "id": 1,
      "last_message": "New Message",
      "user_participants": [
        {
          "first_name": "Samuel",
          "last_name": "Virgo"
        }
      ],
      "society_participants": [

      ]
    }
  ],
  "message": "success",
  "error": ""
  ]
}
 */
export function fnGetChatRooms(id) {
  return fetch(BASEURL + `/users/chat_list/user?user_id=${id}`, {
    method: "GET",
  })
  // return ax.get("/v1/chats", getHeaderConfig());
}

/**
 Endpoint: /v1/chat_messages/{chat_id}/
 Method: GET
 Request:{}
 Response:{
  "data": [
    {
      "id": 4,
      "created_at": "2020-10-28T17:04:57.631071Z",
      "updated_at": "2020-10-28T17:04:57.631071Z",
      "sender_id": 19,
      "chat_id": 1,
      "message": "New Message"
    }
  ],
  "message": "success",
  "error": ""
}

 */
export function fnGetChatMessages(chatId) {
  return fetch(BASEURL + `/users/chat/${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  // return ax.get(`/v1/chat_messages/${chatId}/`, getHeaderConfig());
}

/**
 Endpoint: /v1/chat_message
 Method: POST
 Request:{
    message: "New Message",
    chat_id: 1
 }

 Response
 {
  "data": {
    "message": "New Message",
    "chat_id": 1
  },
  "message": "success",
  "error": ""
}


 */
export function fnSendChatMessages(chatId, message) {
  let data = {
    chat_id: chatId,
    message: message,
  };
  return ax.post("/v1/chat_message", data, getHeaderConfig());
}

/**
 Endpoint: /v1/ticket_purchases/{eventId}/
 Method: GET
 Request:{}

 Response
 {
  "data": [
    {
      "name": "VIP",
      "ticket_price": 2
    }
  ],
  "message": "success",
  "error": ""
}



 */
export function fnGetEventAvailableTickets(eventId) {
  // return fetch(`http://18.134.155.19:3000/events/tickets/${eventId}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // })
  return ax.get(`/events/tickets_list?event_id=${eventId}`, getHeaderConfig());
}

/**
 Endpoint: /v1/ticket_purchases
 Method: POST
 Request:{
    scheduled_event_id: 2,
    ticket_type_id: 2
 }

 Response
 {
  "data": {
    "id": "pi_1HhIDRGEOHJOShot3hFtNuAo",
    "object": "payment_intent",
    "amount": 200,
    "client_secret": "pi_1HhIDRGEOHJOShot3hFtNuAo_secret_2GbfcdOyia2PbPbSJat52jSlP"
  },
  "message": "success",
  "error": ""

}


 */
export function fnTicketPurchase(scheduledEventId, tickets) {
  let data = {
    scheduled_event_id: scheduledEventId,
    tickets: tickets,
  };
  return ax.post(BASEURL+"/v1/ticket_purchases", data, getHeaderConfig());
}

export function fnGetImageURL(id) {
  if (!id) {
    return;
  }
  return `${BASEURL}/image/${id}/`;
}

export async function fnGetUserImages(user_id) {
  let url = BASEURL + `/users/image?user_id=${user_id}`;
  return fetch(url);
}

export async function addToImages(image_url, user_id) {
  const url = image_url;

  return fetch(BASEURL + `/users/image`, {
    headers: { "Content-Type": "application/json" },
    method: "PUT",
    body: JSON.stringify({
      url,
      user_id,
    }),
  });
}

export function fnSearchEvents(parms) {
  let url = new URL(BASEURL + "/events"),
    params = parms;
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  return fetch(url);
}

export function fnGetEventDetails(eventId) {
  let url = BASEURL + `/events/${eventId}`;
  return fetch(url);
}

export function fnGetPublishedEvents(societyId) {
  const url = BASEURL + `/events/published/${societyId}`;
  return fetch(url);
}
