import { useState } from 'react';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import routes from '../routes.js';
import api from '../api/api.js';

const MessageForm = ({ currentChannelId }) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!text.trim() || !currentChannelId) {
        return;
      }

      const user = JSON.parse(localStorage.getItem('userId'));

      await api.post(routes.messagesPath(), {
        body: filter.clean(text),
        channelId: currentChannelId,
        username: user.username,
      });

      setText('');
    } catch {
      toast.error(t('errors.network'));
    }
  };

  return (
    <div className="mt-auto px-5 py-3">
      <form className="py-1 border rounded-2" onSubmit={handleSubmit}>
        <div className="input-group has-validation">
          <input
            className="border-0 p-0 ps-2 form-control"
            name="body"
            aria-label={t('chatPage.labels.forMessages')} 
            placeholder={t('chatPage.labels.forMessages')}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="btn btn-group-vertical"
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
           />
           </svg>
  <span className="visually-hidden">{t('buttons.send')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;