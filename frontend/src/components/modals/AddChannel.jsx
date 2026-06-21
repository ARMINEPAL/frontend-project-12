import axios from 'axios';
import { useFormik } from 'formik';
import filter from 'leo-profanity';
import { useEffect, useRef } from 'react';
import { FormControl, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import routes from '../../routes.js';
import { addChannel } from '../../store/slices/chatSlice.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId?.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const AddChannel = ({ channels, onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .min(3, 'errors.minMax')
      .max(20, 'errors.minMax')
      .notOneOf(
        channels.map((channel) => channel.name),
        'errors.unique',
      )
      .required('errors.required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async ({ name }) => {
      try {
        const response = await axios.post(
          routes.channelsPath(),
          { name: filter.clean(name) },
          { headers: getAuthHeader() },
        );

        dispatch(addChannel(response.data));
        toast.success(t('notifications.add'));
        onHide();
      } catch {
        toast.error(t('errors.network'));
        formik.setSubmitting(false);
      }
    },
  });

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.channel.add')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              ref={inputRef}
              name="name"
              data-testid="input-body"
              required
              className="mb-2"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && formik.errors.name}
            />
            <FormLabel className="visually-hidden">
              {t('chatPage.modal.add.header')}
            </FormLabel>
            <FormControl.Feedback type="invalid">
              {formik.errors.name && t(formik.errors.name)}
            </FormControl.Feedback>
          </FormGroup>

          <div className="d-flex justify-content-end">
            <button type="button" className="me-2 btn btn-secondary">
              Отменить
            </button>
            <button type="submit" className="btn btn-primary">
              {t('buttons.send')}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
