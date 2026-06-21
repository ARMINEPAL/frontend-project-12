import useAuth from "../hooks"
import { Link, useLocation } from "react-router-dom"
import { Button } from "react-bootstrap"
import { useTranslation } from 'react-i18next'

const Header = () => {
    const { t } = useTranslation()
    const auth = useAuth()
    const location = useLocation() 
    const isNotFoundPage = !['/', '/login', '/signup'].includes(location.pathname)
    return (<nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
    <div class="container">
    <Link className = "navbar-brand" to = '/'>Hexlet Chat</Link>
    {auth.loggedIn && !isNotFoundPage ? 
    <Button onClick= {auth.logOut} variant="outline-primary" >
        {t('buttons.logout')}
        </Button>: '' }
    </div>
        </nav>)
}

export default Header