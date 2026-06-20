import axios from 'axios'
import { Modal, FormGroup } from 'react-bootstrap'

import routes from '../../routes.js'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` }
  }

  return {}
}

const RemoveChannel = ({ channel, onHide }) => {
  const { t} = useTranslation()
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.delete(
        routes.channelPath(channel.id),
        { headers: getAuthHeader() },
      )
      toast.success(t('notifications.delete'))
      onHide()
    }
    catch {
      toast.error(t('errors.network'))
    }
  }

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.modal.remove.header')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <input
              className="btn btn-danger"
              type="submit"
              value={t('buttons.submit')}
            />
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default RemoveChannel