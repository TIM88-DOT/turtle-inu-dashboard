import React from "react";

import styles from './Button.module.css';

const CustomButton = (props) => {
    return (
        <button className={styles.button} onClick={props.onClick} style={props.style}>
            {props.value}
        </button>
    )
}

export default CustomButton;