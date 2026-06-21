import axios from 'axios'
import { useState } from 'react'
import { useFormik } from 'formik'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/index.jsx'
import routes from '../routes.js'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
const LoginPage = () => {
  const { t} = useTranslation()
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [authFailed, setAuthFailed] = useState(false)



  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false)

      try {
        const response = await axios.post(routes.loginPath(), values)
        localStorage.setItem('userId', JSON.stringify(response.data))
        auth.logIn()

        const from = location.state?.from?.pathname || '/'
navigate(from)
      } catch (error) {
        if (error.response?.status === 401) {
          setAuthFailed(true)
        } else {
          toast.error(t('errors.network'))
        }
      
        formik.setSubmitting(false)
      }
    },
  })

  return (
    <Row className="justify-content-center align-content-center h-1000">
      <Col xs={12} md={8} xxl={6}>
        <Card className="shadow-sm">
          <Card.Body className='d-flex flex-column flex-md-row justify-content-around align-items-center p-5'>
          <div className='class="col-12 col-md-6 d-flex align-items-center justify-content-center'>
          <img src="../assets/avatar.jpg" className="rounded-circle" alt="Войти"/>
          </div>
            <Form className= 'col-12 col-md-6 mt-3 mt-md-0' onSubmit={formik.handleSubmit}>
            <h1 className="text-center mb-4">{t('buttons.login')}</h1>
              <Form.Group className="form-floating mb-3">
                <Form.Control
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                  placeholder={t('fields.name')}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  isInvalid={authFailed}
                />
                <Form.Label htmlFor="username">{t('fields.name')}</Form.Label>
              </Form.Group>

              <Form.Group className="form-floating mb-4">
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Пароль"
                  autoComplete="current-password"
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  isInvalid={authFailed}
                />
                <Form.Label htmlFor="password">{t('fields.password')}</Form.Label>
                <Form.Control.Feedback type="invalid" className='invalid-tooltip'>
                    {t('errors.incorrectFields')}
                  </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="outline-primary" className="w-100 mb-3 btn btn-outline-primary">
              {t('buttons.login')}
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className='p-4'>
          <div className='text-center'>
          <span>{t('loginPage.noAccount')} </span>
              <Link to="/signup">{t('buttons.registration')}</Link>
          </div>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginPage