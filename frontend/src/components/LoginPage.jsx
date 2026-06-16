import axios from 'axios'
import { useState } from 'react'
import { useFormik } from 'formik'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/index.jsx'
import routes from '../routes.js'
import React from 'react'

const LoginPage = () => {
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
        setAuthFailed(true)
        formik.setSubmitting(false)
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
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  isInvalid={authFailed}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  isInvalid={authFailed}
                />
                <Form.Control.Feedback type="invalid">
                  the username or password is incorrect
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="outline-primary" className="w-100">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginPage