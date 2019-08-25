import React, { useRef } from "react";
import useDrop from "../../hooks/useDrop";
import "./DropItem.css";
import View from "./View";

export default ({ children, heading, onDrop }) => {
  const dropRef = useRef();
  const { dropState, droppedItem } = useDrop({
    ref: dropRef,
    onDrop
  });
  return (
    <View ref={dropRef} dropState={dropState} heading={heading} droppedItem={droppedItem}>
      {children}
    </View>
  );
};
