import icon from '../assets/404.svg';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default () => {
    const { t } = useTranslation();
  return (
    <div className="text-center">
      <img alt={t('notFound.title')} className="img-fluid h-25" src={icon} width="200"/>
      <h1 className="h4 text-muted">{t('notFound.title')}</h1>
      <p className="text-muted">
      {t('notFound.text')} 
      <Link to="/">
          {t('notFound.link')}
      </Link>
      </p>
    </div>
  );
};
