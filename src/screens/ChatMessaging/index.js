import React, { useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { renderComposer, renderInputToolbar, renderSend, } from '../../components/ChatToolbar';
import {
  renderAvatar,
  renderBubble,
  renderMessage,
  renderMessageText,
  renderSystemMessage,
} from '../../components/Chat';
import LinearGradient from 'react-native-linear-gradient';
import SafeAreaView from 'react-native-safe-area-view';
import ScreenHeader from '../../components/ScreenHeader';
import { NavigationHeaderText } from '../../components/NavigationHeaderText';
import NavigationBarButton from '../../components/NavigationBarButton';
import { icon } from '../../helpers/assets';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { fnGetChatMessages, fnSendChatMessages } from '../../helpers/api';
import { errorAlert } from '../../helpers/alerts';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile } from '../../slices/profileSlice';
import { updateMessages } from '../../slices/myChatRoomSlice';
import io from "socket.io-client";
/**
 * ChatScreen built using react-native-gifted-chat
 */

const ChatMessaging = ({ route, navigation }) => {
  const { chatId, societyName, item } = route.params;
  const profile = useSelector(selectProfile);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    fnGetChatMessages(chatId)      
      .then(async response => {
        let dat = await response.json()
        console.log(dat)
        let data = dat.data || [];
        let formattedData = data.map(message => {
          if (message.sender_type === "user") {
            return {
              _id: message.id,
              text: message.message || ' ',
              createdAt: message?.created_at,
              user: {
                _id: profile.id,
                avatar: 'https://placeimg.com/140/140/any',
              },
            };
          } else {
            return {
              _id: message.id,
              text: message.message || ' ',
              createdAt: message?.created_at,
              user: {
                _id: message.id,
                // avatar: item.society_avatar_url
              },
            };
          }

        });
        setMessages(formattedData.reverse());
      })
      .catch(error => {
        errorAlert('Error111', "We’ve encountered a problem, try again later");
      });
    console.log(chatId)
    // try {
    this.socket = io("https://api.myscroll.co.uk").emit('joinRoom', { room: chatId })
    // this.socket.emit('joinRoom', chatId);

    this.socket.on("message", msg => {
      // alert(JSON.stringify(msg))
      console.log(msg.data)
      let mes = msg.data.chat_id
      if (mes.sender_type !== "user") {
        let da = {
          _id: mes.id,
          text: mes.message || ' ',
          createdAt: mes?.created_at,
          user: {
            _id: mes.id,
            // avatar: item.society_avatar_url
          },
        };
        setMessages(prevMessages => GiftedChat.append(prevMessages, da));
      }
    });
    // } catch (error) {

    // }

    // this.setState({
    //   chatMessages: [...this.state.chatMessages, msg]
    // });

  }, []);

  const onSend = (newMessages = []) => {
    const text = newMessages[0].text;
    this.socket.emit('chatMessage', { room: chatId, message: text, userType: "user", userID: profile.id });
    // this.socket.on("message", msg => {
    //   alert(msg)
    //   setMessages(prevMessages => GiftedChat.append(prevMessages, msg));
    //   // this.setState({
    //   //   chatMessages: [...this.state.chatMessages, msg]
    //   // });
    // });
    // fnSendChatMessages(chatId, text)
    //   .then(response => {
    //     dispatch(updateMessages({ chatId: chatId, message: text }));
    //   })
    //   .catch(error => {
    //     errorAlert('Error', "We’ve encountered a problem, try again later");
    //   });
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
  };

  const onAvatarPress = data => {
  };

  const onBack = () => {
    navigation.goBack();
  };
  return (
    <LinearGradient colors={['rgb(0,0,0)', 'rgba(2,0,36,1)', 'rgba(188,97,245,1)']} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} locations={[0, 0.8, 1]} style={{ flex: 1, width: '100%', height: '100%' }}>
      <SafeAreaView>
        <ScreenHeader
          leftButton={<NavigationBarButton icon={icon.back_block} onPress={onBack} />}
          centerView={<NavigationHeaderText text={societyName} />}
        />
      </SafeAreaView>
      <GiftedChat
        messages={messages}
        text={text}
        onInputTextChanged={setText}
        onSend={onSend}
        user={{
          _id: profile.id,
        }}
        alwaysShowSend
        // scrollToBottom
        // showUserAvatar={true}
        // renderUsernameOnMessage
        bottomOffset={isIphoneX() ? 12 : -12}
        wrapInSafeArea={false}
        onPressAvatar={onAvatarPress}
        listViewProps={{ contentContainerStyle: { paddingVertical: 15 } }}
        renderInputToolbar={renderInputToolbar}
        // renderActions={renderActions}
        renderComposer={renderComposer}
        renderSend={renderSend}
        renderAvatar={renderAvatar}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        renderMessage={renderMessage}
        renderMessageText={renderMessageText}
        showUserAvatar={false}
        showAvatarForEveryMessage={false}

      // renderMessageImage
      // renderCustomView={renderCustomView}
      // isCustomViewBottom
      />
      <SafeAreaView style={{ backgroundColor: '#071010' }} />
    </LinearGradient>
  );
};

export default ChatMessaging;
