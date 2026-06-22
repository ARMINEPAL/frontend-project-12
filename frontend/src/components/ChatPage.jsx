import axios from 'axios';
import filter from 'leo-profanity';
import { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import routes from '../routes.js';
import {
  addChannelFromSocket,
  addMessage,
  removeChannel,
  renameChannel,
  setCurrentChannelId,
  setData,
} from '../store/slices/chatSlice.js';
import AddChannel from './modals/AddChannel.jsx';
import RemoveChannel from './modals/RemoveChannel.jsx';
import RenameChannel from './modals/RenameChannel.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId?.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const ChatPage = () => {
  const { t } = useTranslation();
  const [modalInfo, setModalInfo] = useState({ type: null });
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelsResponse = await axios.get(routes.channelsPath(), {
          headers: getAuthHeader(),
        });
        const messagesResponse = await axios.get(routes.messagesPath(), {
          headers: getAuthHeader(),
        });
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

  const [text, setText] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!text.trim() || !currentChannelId) {
        return;
      }

      const user = JSON.parse(localStorage.getItem('userId'));
      await axios.post(
        routes.messagesPath(),
        {
          body: filter.clean(text),
          channelId: currentChannelId,
          username: user.username,
        },
        {
          headers: getAuthHeader(),
        },
      );
      dispatch(addMessage(response.data))
      setText('');
    } catch {
      toast.error(t('errors.network'));
    }
  };
  const currentChannel = channels.find(
    (channel) => channel.id === currentChannelId,
  );
  const messagesCount = messages.filter(
    (message) => message.channelId === currentChannelId,
  ).length;
  return (
    <>
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('chatPage.header')}</b>
            <button
              type="button"
              className="p-0 text-primary btn btn-group-vertical "
              onClick={() => setModalInfo({ type: 'addingChannel' })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-plus-square"
                role="img"
                aria-label={t('buttons.add')}
              >
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
              </svg>
              <span className="visually-hidden">{t('buttons.add')}</span>
            </button>
          </div>

          <ul
            id="channels-box"
            className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
          >
            {channels.map((channel) => {
              const variant =
                channel.id === currentChannelId ? 'secondary' : 'light';

              if (!channel.removable) {
                return (
                  <li key={channel.id} className="nav-item w-100">
                    <button
                      type="button"
                      onClick={() => dispatch(setCurrentChannelId(channel.id))}
                      className={`w-100 rounded-0 text-start btn btn-${variant}`}
                    >
                      <span className="me-1">#</span>
                      {channel.name}
                    </button>
                  </li>
                );
              }

              return (
                <li key={channel.id} className="nav-item w-100">
                  <Dropdown as={ButtonGroup} className="d-flex">
                    <button
                      type="button"
                      onClick={() => dispatch(setCurrentChannelId(channel.id))}
                      className={`w-100 rounded-0 text-start text-truncate btn btn-${variant}`}
                    >
                      <span className="me-1">#</span>
                      {channel.name}
                    </button>

                    <Dropdown.Toggle
                      split
                      variant={variant}
                      className="flex-grow-0"
                    >
                      <span className="visually-hidden">
                        {t('chatPage.labels.manageToChannel')}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          setModalInfo({ type: 'removingChannel', channel })
                        }
                      >
                        {t('buttons.remove')}
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() =>
                          setModalInfo({ type: 'renamingChannel', channel })
                        }
                      >
                        {t('buttons.rename')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b># {currentChannel?.name}</b>
              </p>
              <span className="text-muted">
                {' '}
                {t('chatPage.messagesCount.count', { count: messagesCount })}
              </span>
            </div>
            <div
              id="messages-box"
              className="chat-messages overflow-auto px-5 "
            >
              {messages
                .filter((message) => message.channelId === currentChannelId)
                .map((message) => (
                  <div key={message.id} className="text-break mb-2">
                    <b>{message.username}</b>: {message.body}
                  </div>
                ))}
            </div>
            <div className="mt-auto px-5 py-3">
              <form className="py-1 border rounded-2" onSubmit={handleSubmit}>
                <div className="input-group has-validation">
                  <input
                    className="border-0 p-0 ps-2 form-control"
                    name="body"
                    aria-label="Новое сообщение"
                    placeholder={t('chatPage.labels.forMessages')}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    className=" btn btn-group-vertical"
                    type="submit"
                    disabled={!text.trim() || !currentChannelId}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-arrow-right-square"
                      role="img"
                      aria-label={t('buttons.add')}
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
                      ></path>
                    </svg>
                    <span className="visually-hidden">{t('buttons.send')}</span>
                  </button>
                </div>
              </form>
            </div>
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
