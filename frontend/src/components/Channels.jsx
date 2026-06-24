import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { setCurrentChannelId } from '../store/slices/chatSlice.js';

const Channels = ({ channels, currentChannelId, setModalInfo }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('chatPage.header')}</b>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => setModalInfo({ type: 'addingChannel' })}
        >
          +
          <span className="visually-hidden">{t('buttons.add')}</span>
        </button>
      </div>

      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.map((channel) => {
          const variant = channel.id === currentChannelId ? 'secondary' : 'light';

          if (!channel.removable) {
            return (
              <li key={channel.id} className="nav-item w-100">
                <button
                  type="button"
                  onClick={() => dispatch(setCurrentChannelId(channel.id))}
                  className={`w-100 rounded-0 text-start btn btn-${variant}`}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </button>
              </li>
            );
          }

          return (
            <li key={channel.id} className="nav-item w-100">
              <Dropdown as={ButtonGroup} className="d-flex">
                <button
                  type="button"
                  onClick={() => dispatch(setCurrentChannelId(channel.id))}
                  className={`w-100 rounded-0 text-start text-truncate btn btn-${variant}`}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </button>

                <Dropdown.Toggle split variant={variant} className="flex-grow-0">
                  <span className="visually-hidden">
                    {t('chatPage.labels.manageOfChannel')}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setModalInfo({ type: 'removingChannel', channel })}
                  >
                    {t('buttons.remove')}
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() => setModalInfo({ type: 'renamingChannel', channel })}
                  >
                    {t('buttons.rename')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Channels;