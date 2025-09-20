import { JSX, ReactNode } from "react";
import "./dropdown.css";

type DropdownProps = {
    children?: ReactNode;
    direction?: string;
    name?: string;
};

function Dropdown({ children, direction = "up", name = "dropdown" }: DropdownProps): JSX.Element {
    return (
        <div className={`DropDownDiv ${direction}`} id={`${name}-dropdown`}>
            {children}
        </div>
    );
}

export default Dropdown;
