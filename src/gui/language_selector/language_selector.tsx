import { t } from 'i18next';
import { changeLang, toggleDropdown } from '../../utils';
import Dropdown from '../dropdown/dropdown';
import IconButton from '../icon_button/icon_button';
import './language_selector.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarth } from '@fortawesome/free-solid-svg-icons';

function LanguageSelector() {
    return (
        <div className='LanguageSelector'>
            <IconButton onClick={(e) => toggleDropdown('lang', e.currentTarget)}/>
            <Dropdown name='lang'>
                <div className="noanim"><FontAwesomeIcon icon={faEarth}/>{t('select_language')}</div>
                <div onClick={() => changeLang("")}>
                    <p>{t('auto_lang')}</p>
                </div>
                <div onClick={() => changeLang("en")}>
                    <p>English</p>
                </div>
                <div onClick={() => changeLang("ru")}>
                    <p>Русский</p>
                </div>
                <div onClick={() => changeLang("uk")}>
                    <p>Українська</p>
                </div>
            </Dropdown>
        </div>
    )
}

export default LanguageSelector;