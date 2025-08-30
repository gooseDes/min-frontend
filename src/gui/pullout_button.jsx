import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './pullout_button.css'

function PulloutButton({ text='Text', icon=faMessage, onClick }) {
    return (
        <div className="PulloutButton" onClick={onClick}>
            <FontAwesomeIcon icon={icon} className="icon"/>
            <p id="pullout_text">{text}</p>
        </div>
    )
}

export default PulloutButton;