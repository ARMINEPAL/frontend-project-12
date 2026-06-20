import { useFormik } from 'formik'
import * as yup from 'yup'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import routes from '../routes.js'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/index.jsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const SignupPage = () => {
    const { t, i18n } = useTranslation()
    const [signupFailed, setSignupFailed] = useState(false)

    const navigate = useNavigate()
    const auth = useAuth()

    const validationSchema = yup.object({
        username: yup.string().min(3, 'errors.minMax').max(20, 'errors.minMax').required('errors.required'),
        password: yup.string().min(6, 'errors.minMax').required('errors.minMax').required('errors.required'),
        confirmPassword: yup.string().required('errors.minMax').required('errors.required').oneOf(
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
                    setSignupFailed(true)
                  }
                else {
                  toast.error(t('errors.network'))
                }
            }
          },
    })

    return (
        <Row className="justify-content-center align-content-center h-100">
          <Col xs={12} md={8} xxl={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="username">{t('fields.username')}</Form.Label>
                    <Form.Control
                      id="username"
                      name="username"
                      autoComplete="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={(formik.touched.username && formik.errors.username) || signupFailed}
                    />
                    <Form.Control.Feedback type="invalid">
                    {formik.errors.username ? t(formik.errors.username) : t('errors.userExists')}
                  </Form.Control.Feedback>
                  </Form.Group>
    
                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="password">{t('fields.password')}</Form.Label>
                    <Form.Control
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.password && formik.errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                    {formik.errors.password
                    && t(formik.errors.password)}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="confirmPassword">{t('fields.confirmPassword')}</Form.Label>
                    <Form.Control
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="current-password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                    {formik.errors.confirmPassword
                    && t(formik.errors.confirmPassword)}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant="outline-primary" className="w-100">
                  {t('buttons.registration')}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
)}

export default SignupPage