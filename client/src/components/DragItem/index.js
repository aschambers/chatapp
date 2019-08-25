import React, { useState, useRef } from "react";
import useDrag from "../../hooks/useDrag";
import "./DragItem.css";
import View from "./View";

export default ({ dragEffect, data, id }) => {
  const dragRef = useRef();
  const [classValue, setClassValue] = useState("grab");
  const { dragState } = useDrag({
    id,
    effect: dragEffect,
    ref: dragRef,
    onDragStart: () => setClassValue("grabbing"),
    onDragEnd: () => {
      setClassValue("grab");
    }
  });
  return <View ref={dragRef} dragState={dragState} data={data} classValue={classValue} />;
};
