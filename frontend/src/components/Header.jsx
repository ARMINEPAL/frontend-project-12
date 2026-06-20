import useAuth from "../hooks"
import { Link } from "react-router-dom"
import { Button } from "react-bootstrap"
import { useTranslation } from 'react-i18next'

const Header = () => {
    const { t, i18n } = useTranslation()
    const auth = useAuth()

    return (<header className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <Link to = '/'>Hexlet Chat</Link>
        {auth.loggedIn ? 
        <Button onClick= {auth.logOut} variant="outline-primary" >
        {t('buttons.logout')}
        </Button>: '' }
        </header>)
}

export default Header