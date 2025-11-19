import React, { useEffect, useState } from "react";
import styles from "./CtaButton.module.css";


export default function CtaButton({title, onClick}) {
 
  return (
    <div className={styles.ctaButton} onClick={onClick}>
        <p>{title}</p>
    </div>
  );
}

