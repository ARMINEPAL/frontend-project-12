import { useTranslation } from 'react-i18next';

const Messages = ({ messages, currentChannelId, currentChannel }) => {
  const { t } = useTranslation();

  const currentMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  );

  return (
    <>
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b># {currentChannel?.name}</b>
        </p>
        <span className="text-muted">
          {t('chatPage.messagesCount.count', { count: currentMessages.length })}
        </span>
      </div>

      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {currentMessages.map((message) => (
          <div key={message.id} className="text-break mb-2">
            <b>{message.username}</b>
            {': '}
            {message.body}
          </div>
        ))}
      </div>
    </>
  );
};

export default Messages;