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
            placeholder={t('chatPage.labels.forMessages')}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="btn btn-group-vertical"
            type="submit"
            disabled={!text.trim() || !currentChannelId}
          >
            {t('buttons.send')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;