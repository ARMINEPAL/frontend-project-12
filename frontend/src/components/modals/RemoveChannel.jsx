
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import routes from '../../routes.js';
import api from '../../api/api.js';


const RemoveChannel = ({ channel, onHide }) => {
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.delete(routes.channelPath(channel.id));
      toast.success(t('notifications.delete'));
      onHide();
    } catch {
      toast.error(t('errors.network'));
    }
  };

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.channel.remove')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p class="lead">Уверены?</p>
        <div className="d-flex justify-content-end">
          <button type="button" className="me-2 btn btn-secondary">
            Отменить
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleSubmit}
          >
            {t('buttons.remove')}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
