import axios from 'axios'
import { useEffect} from 'react'

import routes from '../routes.js'
import { useDispatch, useSelector} from 'react-redux'

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` }
  }

  return {}
}

const ChatPage = () => {
  const dispatch = useDispatch()
  useEffect(() => { 
    const fetchData = async () => {
        const channelsResponse = await axios.get( routes.channelsPath(), { headers: getAuthHeader(), }, )
       const messagesResponse = await axios.get( routes.messagesPath(), { headers: getAuthHeader(), }, )
      dispatch(setData({channels: channelsResponse.data, messages: messagesResponse.data})) 
       }; 
       fetchData(); 
       }, [dispatch]); 
       const channels = useSelector((state) => state.chat.channels)
       const messages = useSelector((state) => state.chat.messages)
       return (
        <div className="row h-100">
          <div className="col-4 col-md-2 border-end">
            <h5>Каналы</h5>
            <ul>
              {channels.map((channel) => (
                <li key={channel.id}>{channel.name}</li>
              ))}
            </ul>
          </div>
      
          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
      
              <div className="flex-grow-1 overflow-auto p-3">
                {messages.map((message) => (
                  <div key={message.id}>{message.body}</div>
                ))}
              </div>
      
              <form className="p-3 border-top">
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Введите сообщение..."
                  />
                  <button className="btn btn-primary" type="submit">
                    Отправить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
}
export default ChatPage;