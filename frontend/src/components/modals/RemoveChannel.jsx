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
        <Modal.Title>{t('chatPage.channel.remove')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
      <p class="lead">Уверены?</p>
          <div className="d-flex justify-content-end">
          <button type="button" className="me-2 btn btn-secondary">Отменить</button>
          <button type="button" className="btn btn-danger" onClick = {handleSubmit}>{t('buttons.remove')}</button></div>
    
      </Modal.Body>
    </Modal>
  )
}

export default RemoveChannel