import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import "./icon_button.css";

type IconButtonProps = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function IconButton({ onClick }: IconButtonProps) {
    return (
        <button className="IconButton" onClick={onClick}>
            <FontAwesomeIcon icon={faLanguage} />
        </button>
    );
}

export default IconButton;
