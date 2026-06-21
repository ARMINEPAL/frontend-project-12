import axios from 'axios'
import { useEffect, useRef} from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Modal, FormGroup, FormControl } from 'react-bootstrap'
import { renameChannel } from '../../store/slices/chatSlice.js'
import routes from '../../routes.js'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import filter from 'leo-profanity'

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` }
  }

  return {}
}

const RenameChannel = ({ channel, channels, onHide }) => {
  const { t} = useTranslation()
  const inputRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .min(3, 'errors.minMax')
      .max(20, 'errors.minMax')
      .notOneOf(
        channels
          .filter((item) => item.id !== channel.id)
          .map((item) => item.name),
          'errors.unique'
      )
      .required('errors.required'),
  })

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema,
    onSubmit: async ({ name }) => {
      try {
        const response = await axios.patch(
        routes.channelPath(channel.id),
        { name: filter.clean(name) },
        { headers: getAuthHeader() },
        )
        dispatch(renameChannel(response.data))
        toast.success(t('notifications.rename'))
        onHide()
      }
      catch(e) {
        toast.error(t('errors.network'))
        formik.setSubmitting(false)
      }
}
  })

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.modal.rename.header')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              ref={inputRef}
              name="name"
              data-testid="input-body"
              required
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && formik.errors.name}
            />
            <FormControl.Feedback type="invalid">
            {formik.errors.name && t(formik.errors.name)}
            </FormControl.Feedback>
          </FormGroup>

          <input className="btn btn-primary" type="submit" value={t('buttons.submit')} disabled={formik.isSubmitting} />
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default RenameChannel