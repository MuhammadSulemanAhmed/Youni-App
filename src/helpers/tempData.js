import { icon, placeholderImages } from "./assets";

export const STRIPE_TEST_API_KEY =
  "pk_test_51Hc7A3CtcrhGM8ReLG3Sh91R91YgFTcD8b2iyC0kDX2ceMEYTesZ0uIsDvVfTg5KA4YciCcmjDZs7cI9IRnLu2Mj00amBH4X4s";

export const STRIPE_LIVE_API_KEY =
  "pk_live_51Hc7A3CtcrhGM8ReraxljL0kM8rqQHzKYtUhrG0Vlt3MWl426TRHbmgvWxMzqU25CBu0E7EIQsnRH0pBbszdkc5200tmwpSees";

export const tempClubData = () => {
  let numData = 10;
  const newArray = [];
  for (let i = 0; i < numData; i++) {
    const item = {
      id: i,
      name: "Football Club",
      title: "Lorem ipsum",
      description:
        "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit. Morbi in  dapibus risus. eu lacinia ac",
      background: placeholderImages.club_placeholder,
      memberImages: ["red", "blue", "yellow", "green"],
      memberCount: 5,
      date: "02/04/20",
      time: "7:30 PM",
    };
    newArray.push(item);
  }
  return newArray;
};

export const tempProfileImage = () => {
  return [
    {
      id: 1,
      image: "red",
    },
    {
      id: 2,
      image: "blue",
    },
    {
      id: 3,
      image: "green",
    },
    {
      id: 4,
      image: "purple",
    },
    {
      id: 5,
      image: "pink",
    },
    {
      id: 6,
      image: "black",
    },
    {
      id: 7,
      image: "yellow",
    },
    {
      id: 8,
      image: "orange",
    },
    {
      id: 9,
      image: "cyan",
    },
    {
      id: 10,
      image: "magenta",
    },
    {
      id: 11,
      image: "teal",
    },
    {
      id: 12,
      image: "violet",
    },
  ];
};

export const tempTicketData = () => {
  let numData = 10;
  const newArray = [];
  for (let i = 0; i < numData; i++) {
    const item = {
      id: i,
      section: "101",
      seat: "1A",
    };
    newArray.push(item);
  }
  return newArray;
};

export const tempCategoryData = () => {
  let numData = 10;
  const newArray = [];
  for (let i = 0; i < numData; i++) {
    const item = {
      id: i,
      category: "active",
      icon: icon.basketball,
      isSelected: false,
    };
    newArray.push(item);
  }
  return newArray;
};

export const tempMessages = [
  // {
  //     _id: 1,
  //     text: 'This is a system message',
  //     createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
  //     system: true,
  // },
  {
    _id: 2,
    text: "Hello developer",
    createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
    user: {
      _id: 2,
      name: "React Native",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 3,
    text: "Hi! I work from home today!",
    createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
    user: {
      _id: 1,
      name: "React Native",
      avatar: "https://placeimg.com/140/140/any",
    },
    image: "https://placeimg.com/960/540/any",
  },
  {
    _id: 4,
    text: "This is a quick reply. Do you love Gifted Chat? KEEP IT",
    createdAt: new Date(Date.UTC(2016, 5, 14, 17, 20, 0)),
    user: {
      _id: 2,
      name: "React Native",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 5,
    text: "This is a quick reply. Do you love Gifted Chat? ",
    createdAt: new Date(Date.UTC(2016, 5, 15, 17, 20, 0)),
    user: {
      _id: 2,
      name: "React Native",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 6,
    text: "Come on!",
    createdAt: new Date(Date.UTC(2016, 5, 15, 18, 20, 0)),
    user: {
      _id: 2,
      name: "React Native",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
  {
    _id: 7,
    text: `Hello this is an example of the ParsedText, links like http://www.google.com or http://www.facebook.com are clickable and phone number 444-555-6666 can call too.
        But you can also do more with this package, for example Bob will change style and David too. foo@gmail.com
        And the magic number is 42!
        #react #react-native`,
    createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
    user: {
      _id: 1,
      name: "React Native",
      avatar: "https://placeimg.com/140/140/any",
    },
  },
];
