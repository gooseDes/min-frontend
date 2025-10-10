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
