import { t } from "i18next";
import { changeLang, toggleDropdown } from "../../utils";
import Dropdown from "../dropdown/dropdown";
import IconButton from "../icon_button/icon_button";
import "./language_selector.css";
import { faEarth, faLanguage } from "@fortawesome/free-solid-svg-icons";
import Icon from "../icon";

function LanguageSelector() {
    return (
        <div className="LanguageSelector">
            <IconButton onClick={(e) => toggleDropdown("lang", e.currentTarget)}>
                <Icon icon={faLanguage} />
            </IconButton>
            <Dropdown name="lang">
                <div className="noanim">
                    <Icon icon={faEarth} />
                    {t("select_language")}
                </div>
                <div onClick={() => changeLang("")}>
                    <p>{t("auto_lang")}</p>
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
    );
}

export default LanguageSelector;
