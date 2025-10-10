import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import React from "react";

function IconBase(props: FontAwesomeIconProps) {
    return <FontAwesomeIcon {...props} />;
}

export const Icon = React.memo(IconBase);

export default Icon;
