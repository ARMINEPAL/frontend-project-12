import { Formik, Form, Field, ErrorMessage } from 'formik';

const LoginPage = ()=> {
return (
<>
<h1>Login</h1>
<Formik
  initialValues={{ email: "", password: "" }}
  onSubmit={() => {}}
>
  {({touched, errors}) => (
    <Form>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <Field
          id='email'
          type="email"
          name="email"
          className={`form-control ${
    touched.email && errors.email ? "is-invalid" : ""
  }`}
        />
        <ErrorMessage
           component="div"
           name="email"
           className="invalid-feedback"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <Field
          id='password'
          type="password"
          name="password"
          className={`form-control ${
    touched.password && errors.password ? "is-invalid" : ""
  }`}
        />
        <ErrorMessage
           component="div"
           name="password"
           className="invalid-feedback"
        />
      </div>
      <button type="submit">Войти</button>
    </Form>
  )}
</Formik>
</>
)}

export default LoginPage