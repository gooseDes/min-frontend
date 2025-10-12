import React, { JSX, ReactNode } from "react";
import "./dropdown.css";

type DropdownProps = {
    children?: ReactNode;
    direction?: string;
    name?: string;
};

function DropdownBase({ children, direction = "up", name = "dropdown" }: DropdownProps): JSX.Element {
    return (
        <div className={`DropDownDiv ${direction}`} id={`${name}-dropdown`}>
            {children}
        </div>
    );
}

const Dropdown = React.memo(DropdownBase);

export default Dropdown;
