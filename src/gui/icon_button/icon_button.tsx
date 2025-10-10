import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import "./icon_button.css";
import React from "react";

type IconButtonProps = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children?: React.ReactNode;
};

function IconButton({ onClick, children }: IconButtonProps) {
    return (
        <button className="IconButton" onClick={onClick}>
            {children}
        </button>
    );
}

export default IconButton;
