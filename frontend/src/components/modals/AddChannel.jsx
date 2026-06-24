import { useFormik } from 'formik';
import filter from 'leo-profanity';
import { useEffect, useRef } from 'react';
import { FormControl, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import routes from '../../routes.js';
import { addChannel } from '../../store/slices/chatSlice.js';
import { getAddChannelSchema } from '../../validationSchemas/channelSchema.js';
import api from '../../api/api.js';

const AddChannel = ({ channels, onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit =  async ({ name }) => {
    try {
      const response = await api.post(
        routes.channelsPath(),
        { name: filter.clean(name) }
      );

      dispatch(addChannel(response.data));
      toast.success(t('notifications.add'));
      onHide();
    } catch {
      toast.error(t('errors.network'));
      formik.setSubmitting(false);
    }
  }


  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getAddChannelSchema(channels),
    onSubmit: handleSubmit,
  });

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.channel.add')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
          <FormLabel htmlFor="name" className="visually-hidden">
              {t('chatPage.modal.add.header')}
            </FormLabel>
            <FormControl
              ref={inputRef}
              name="name"
              id= "name"
              className="mb-2"
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
              {t('buttons.send')}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
