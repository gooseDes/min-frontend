import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { closePopup } from '../utils.js';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './popup.css';

function Popup({ title="Title", name='default', children }) {
    return (
        <div className="Popup" id={`${name}-popup`}>
            <div className="PopupHeader">
                <p>{title}</p>
                <button className="CloseButton" onClick={() => {closePopup(name)}}><FontAwesomeIcon icon={faXmark}/></button>
            </div>
            <div className="PopupContent">
                {children}
            </div>
        </div>
    )
}

export default Popup;