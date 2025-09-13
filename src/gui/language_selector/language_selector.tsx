import { t } from 'i18next';
import { toggleDropdown } from '../../utils';
import Dropdown from '../dropdown/dropdown';
import IconButton from '../icon_button/icon_button';
import './language_selector.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarth } from '@fortawesome/free-solid-svg-icons';
import i18n from '../../i18n';

function changeLang(lang: string) {
    if (lang == "") {
        localStorage.removeItem("lang");
        i18n.changeLanguage('');
        document.cookie = "lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } else localStorage.setItem("lang", lang);
    location.href = location.href;
}

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