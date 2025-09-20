import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { closePopup } from "../utils";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./popup.css";

function Popup({ title = "Title", name = "default", scale = 0.9, children, disableCloseButton = false }) {
    return (
        <div className="Popup" id={`${name}-popup`} style={{ "--popup-scale": scale }}>
            <div className="PopupHeader">
                <p>{title}</p>
                {!disableCloseButton && (
                    <button
                        className="CloseButton"
                        onClick={() => {
                            closePopup(name);
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                )}
            </div>
            <div className="PopupContent">{children}</div>
        </div>
    );
}

export default Popup;
