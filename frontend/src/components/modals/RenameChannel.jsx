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
import { renameChannel } from '../../store/slices/chatSlice.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId?.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const RenameChannel = ({ channel, channels, onHide }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

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
        'errors.unique',
      )
      .required('errors.required'),
  });

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
        );
        dispatch(renameChannel(response.data));
        toast.success(t('notifications.rename'));
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
        <Modal.Title>{t('chatPage.channel.rename')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
          <FormLabel className="visually-hidden" htmlFor="name">
              {t('chatPage.modal.add.header')}
            </FormLabel>
            <FormControl
              ref={inputRef}
              name="name"
              className="mb-2"
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

          <div className="d-flex justify-content-end">
            <button type="button" className="me-2 btn btn-secondary">
              Отменить
            </button>
            <button type="submit" className="btn btn-primary">
              {t('buttons.submit')}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
