import React, { forwardRef } from "react";
import numbersign from '../../assets/images/numbersign.png';
import "./DragItem.css";

export default forwardRef(({ data, classValue }, ref) => {
  return (
    <div className={`item ${classValue}`} ref={ref}>
      <span><img src={numbersign} alt="channel" height={16} width={16} /><span>{data.text}</span></span>
    </div>
  );
});
