import { useFormik } from 'formik'
import * as yup from 'yup'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import routes from '../routes.js'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/index.jsx'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import avatar from '../assets/avatar_1.jpg'

const SignupPage = () => {
    const { t } = useTranslation()

    const navigate = useNavigate()
    const auth = useAuth()

    const validationSchema = yup.object({
        username: yup.string().min(3, 'errors.minMax').max(20, 'errors.minMax').required('errors.required'),
        password: yup.string().min(6, 'errors.passwordLength').required('errors.required'),
        confirmPassword: yup.string().required('errors.required').oneOf(
            [yup.ref('password')],
            'errors.passwordsMustMatch',
          ),
    })
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try{
                const response = await axios.post(
                    routes.signupPath(),
                    {
                        username: values.username,
                        password: values.password
                    }
                )
                localStorage.setItem('userId', JSON.stringify(response.data))
                auth.logIn()
                navigate('/')
            }
            catch (e) {
                if (e.response?.status === 409) {
                  formik.setFieldError('username', 'errors.userExists')
                  }
                else {
                  toast.error(t('errors.network'))
                }
                formik.setSubmitting(false)
            }
          },
    })

    return (
        <Row className="justify-content-center align-content-center h-100">
          <Col xs={12} md={8} xxl={6}>
            <Card className="shadow-sm">
              <Card.Body className='d-flex flex-column flex-md-row justify-content-around align-items-center p-5'>
              <div>
              <img src={avatar} className="rounded-circle" alt="Регистрация"/>
              </div>
                <Form className = 'w-50' onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">{t('buttons.registration')}</h1>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      id="username"
                      name="username"
                      placeholder={t('errors.mimmax')}
                      autoComplete="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={(formik.touched.username && formik.errors.username)}
                    />
                    <Form.Label htmlFor="username">{t('fields.username')}</Form.Label>
                    <Form.Control.Feedback placement="right" className='invalid-tooltip' type="invalid">
                    {formik.errors.username && t(formik.errors.username)}
                  </Form.Control.Feedback>
                  </Form.Group>
    
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      id="password"
                      name="password"
                      type="password"
                      placeholder={t('errors.passwordLength')}
                      autoComplete="new-password"
                      aria-describedby="passwordHelpBlock"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.password && formik.errors.password}
                    />
                    <Form.Label htmlFor="password">{t('fields.password')}</Form.Label>
                    <Form.Control.Feedback className='invalid-tooltip' type="invalid">
                    {formik.errors.password
                    && t(formik.errors.password)}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder={t('errors.passwordsMustMatch')}
                      type="password"
                      autoComplete="new-password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                    <Form.Label htmlFor="confirmPassword">{t('fields.confirmPassword')}</Form.Label>
                    <Form.Control.Feedback className='invalid-tooltip' type="invalid">
                    {formik.errors.confirmPassword
                    && t(formik.errors.confirmPassword)}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant="outline-primary" className="w-100" disabled={formik.isSubmitting}>
                  {t('buttons.signup')}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
)}

export default SignupPage