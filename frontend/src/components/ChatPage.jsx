import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

import routes from '../routes.js';
import api from '../api/api.js';

import {
  addChannelFromSocket,
  addMessage,
  removeChannel,
  renameChannel,
  setData,
} from '../store/slices/chatSlice.js';

import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';

import AddChannel from './modals/AddChannel.jsx';
import RemoveChannel from './modals/RemoveChannel.jsx';
import RenameChannel from './modals/RenameChannel.jsx';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [modalInfo, setModalInfo] = useState({ type: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelsResponse = await api.get(routes.channelsPath());
        const messagesResponse = await api.get(routes.messagesPath());

        const generalChannel = channelsResponse.data.find(
          (channel) => channel.name === 'general',
        );

        dispatch(
          setData({
            channels: channelsResponse.data,
            messages: messagesResponse.data,
            currentChannelId: generalChannel?.id,
          }),
        );
      } catch {
        toast.error(t('errors.network'));
      }
    };

    fetchData();

    const socket = io();

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      dispatch(addChannelFromSocket(channel));
    });

    socket.on('removeChannel', (data) => {
      dispatch(removeChannel(data));
    });

    socket.on('renameChannel', (channel) => {
      dispatch(renameChannel(channel));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, t]);

  const channels = useSelector((state) => state.chat.channels);
  const messages = useSelector((state) => state.chat.messages);
  const currentChannelId = useSelector((state) => state.chat.currentChannelId);

  const currentChannel = channels.find(
    (channel) => channel.id === currentChannelId,
  );

  return (
    <>
      <div className="row h-100 bg-white flex-md-row">
        <Channels
          channels={channels}
          currentChannelId={currentChannelId}
          setModalInfo={setModalInfo}
        />

        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <Messages
              messages={messages}
              currentChannelId={currentChannelId}
              currentChannel={currentChannel}
            />

            <MessageForm currentChannelId={currentChannelId} />
          </div>
        </div>
      </div>

      {modalInfo.type === 'addingChannel' && (
        <AddChannel
          channels={channels}
          onHide={() => setModalInfo({ type: null })}
        />
      )}

      {modalInfo.type === 'removingChannel' && (
        <RemoveChannel
          channel={modalInfo.channel}
          onHide={() => setModalInfo({ type: null })}
        />
      )}

      {modalInfo.type === 'renamingChannel' && (
        <RenameChannel
          channel={modalInfo.channel}
          channels={channels}
          onHide={() => setModalInfo({ type: null })}
        />
      )}
    </>
  );
};

export default ChatPage;
