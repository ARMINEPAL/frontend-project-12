import axios from 'axios'
import { useEffect, useState} from 'react'
import RemoveChannel from './modals/RemoveChannel.jsx'
import RenameChannel from './modals/RenameChannel.jsx'
import routes from '../routes.js'
import { useDispatch, useSelector} from 'react-redux'
import  { setData, addMessage, setCurrentChannelId, addChannelFromSocket, removeChannel,renameChannel } from '../store/slices/chatSlice.js'
import { io } from 'socket.io-client'
import AddChannel from './modals/AddChannel.jsx'
import { Dropdown, ButtonGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` }
  }

  return {}
}

const ChatPage = () => {
    const { t} = useTranslation()
    const [modalInfo, setModalInfo] = useState({ type: null })
  const dispatch = useDispatch()
  useEffect(() => { 
    const fetchData = async () => {
      try {
      const channelsResponse = await axios.get( routes.channelsPath(), { headers: getAuthHeader(), }, )
       const messagesResponse = await axios.get( routes.messagesPath(), { headers: getAuthHeader(), }, )
       const generalChannel = channelsResponse.data.find(
        (channel) => channel.name === 'general',
      )
      dispatch(setData({channels: channelsResponse.data, messages: messagesResponse.data, currentChannelId:generalChannel?.id})) 
      }
       catch (e) {
        toast.error(t('errors.network'))
       }
      
    }
       fetchData();
       const socket = io('http://localhost:5002')
       socket.on('newMessage', (message) => {
        dispatch(addMessage(message))
    })
    socket.on('newChannel', (channel) => {
        dispatch(addChannelFromSocket(channel))
      })
    
      socket.on('removeChannel', (data) => {
        dispatch(removeChannel(data))
      })

      socket.on('renameChannel', (channel) => {
        dispatch(renameChannel(channel))
      })

    return () => {
    socket.disconnect()
}
       }, [dispatch, t]); 
       const channels = useSelector((state) => state.chat.channels)
       const messages = useSelector((state) => state.chat.messages)
       const currentChannelId = useSelector((state) => state.chat.currentChannelId)

       const [text, setText] = useState('')
       const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          if (!text.trim() || !currentChannelId) {
            return
          } 

        const user = JSON.parse(localStorage.getItem('userId'))
        await axios.post(
          routes.messagesPath(),
          {
            body: text,
            channelId: currentChannelId,
            username: user.username,
          },
          {
            headers: getAuthHeader(),
          },
        )
      
        setText('')
        }
        catch (e) {
          toast.error(t('errors.network'))
        }
        
      }
      return (
        <>
          <div className="row h-100">
            <div className="col-4 col-md-2 border-end">
              <h5>{t('chatPage.header')}</h5>
      
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setModalInfo({ type: 'addingChannel' })}
              >
                {t('buttons.add')}
              </button>
      
              <ul>
              {channels.map((channel) => {
  const variant = channel.id === currentChannelId ? 'secondary' : 'light'

  if (!channel.removable) {
    return (
      <button
        key={channel.id}
        type="button"
        onClick={() => dispatch(setCurrentChannelId(channel.id))}
        className={`w-100 rounded-0 text-start btn btn-${variant}`}
      >
        # {channel.name}
      </button>
    )
  }

  return (
    <div key={channel.id} className="btn-group w-100">
      <button
        type="button"
        onClick={() => dispatch(setCurrentChannelId(channel.id))}
        className={`w-100 rounded-0 text-start btn btn-${variant}`}
      >
        # {channel.name}
      </button>


      <Dropdown as={ButtonGroup}>
  <Dropdown.Toggle
    split
    variant={variant}
  >
    <span className="visually-hidden">
      Управление каналом
    </span>
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Dropdown.Item
      onClick={() => setModalInfo({ type: 'renamingChannel', channel })}
    >
      {t('chatPage.modal.rename.header')}
    </Dropdown.Item>

    <Dropdown.Item
      onClick={() => setModalInfo({ type: 'removingChannel', channel })}
    >
      {t('chatPage.modal.remove.header')}
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
    </div>
  )
})}
              </ul>
            </div>
      
            <div className="col p-0 h-100">
              <div className="d-flex flex-column h-100">
                <div className="flex-grow-1 overflow-auto p-3">
                  {messages
                    .filter((message) => message.channelId === currentChannelId)
                    .map((message) => (
                      <div key={message.id}>
                        <b>{message.username}</b>: {message.body}
                      </div>
                    ))}
                </div>
      
                <form className="p-3 border-top" onSubmit={handleSubmit}>
                  <div className="input-group">
                    <input
                      className="form-control"
                      placeholder={t('chatPage.labels.forMessages')}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={!text.trim() || !currentChannelId}
                    >
                      {t('buttons.send')}
                    </button>
                  </div>
                </form>
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
      )
}
export default ChatPage;