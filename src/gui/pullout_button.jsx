import { faMessage } from "@fortawesome/free-solid-svg-icons";
import "./pullout_button.css";
import Icon from "./icon";

function PulloutButton({ text = "Text", icon = faMessage, onClick }) {
    return (
        <div className="PulloutButton" onClick={onClick}>
            <Icon icon={icon} className="icon" />
            <p id="pullout_text">{text}</p>
        </div>
    );
}

export default PulloutButton;
