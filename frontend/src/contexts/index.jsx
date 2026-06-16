
import { createContext } from 'react'

const AuthContext = createContext({
    loggedIn: false,
    logIn: () => {},
    logOut: () => {},
  })

export default AuthContext