import axios from 'axios'
import { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Modal, FormGroup, FormControl } from 'react-bootstrap'
import { useDispatch } from 'react-redux'

import routes from '../../routes.js'
import { addChannel } from '../../store/slices/chatSlice.js'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'))

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` }
  }

  return {}
}

const AddChannel = ({ channels, onHide }) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .min(3, 'errors.minMax')
      .max(20, 'errors.minMax')
      .notOneOf(channels.map((channel) => channel.name), 'errors.unique')
      .required('errors.required'),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async ({ name }) => {
      try {
        const response = await axios.post(
          routes.channelsPath(),
          { name },
          { headers: getAuthHeader() },
        )
  
        dispatch(addChannel(response.data))
        toast.success(t('notifications.add'))
        onHide()
      }
      catch (e) {
        toast.error(t('errors.network'))
        formik.setSubmitting(false)
      }
    },
  })

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.modal.add.header')}</Modal.Title>
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

          <input
            className="btn btn-primary"
            type="submit"
            value={t('buttons.submit')}
            disabled={formik.isSubmitting}
          />
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default AddChannel