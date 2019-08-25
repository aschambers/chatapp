import React, { forwardRef } from "react";
import "./DropItem.css";

const setDragStyle = (event) => {
  event.preventDefault();
  event.target.style.borderTop = "3px solid green";
}

const setDragStop = (event) => {
  event.preventDefault();
  event.target.style.borderTop = "0px solid green";
}

export default forwardRef(({ children, heading }, ref) => {
  return (
    <div
      onDragEnter={(event) => { setDragStyle(event); }}
      onDragLeave={(event) => { setDragStop(event); }}
      onDragEnd={(event) => { setDragStop(event); }}
      onDragExit={(event) => { setDragStop(event); }}
      onMouseLeave={(event) => { setDragStop(event); }}
      onPointerLeave={(event) => { setDragStop(event); }}
      className="container" ref={ref}
    >
      <div className="children-drop">{children}</div>
    </div>
  );
});
