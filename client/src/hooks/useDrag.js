import { useState, useEffect } from "react";

const useDrag = ({ id, effect, ref, onDragStart, onDragOver, onDragEnd }) => {
  const [dragState, updateDragState] = useState("draggable");
  useEffect(() => {
    const elem = ref.current;
    const dragStartCb = ev => {
      updateDragState("dragStart");
      ev.dataTransfer.dropEffect = effect;
      ev.dataTransfer.setData("source", id);
      onDragStart && onDragStart();
    };
    const dragOverCb = ev => {
      updateDragState("dragging");
      onDragOver && onDragOver();
    };
    const dragEndCb = ev => {
      updateDragState("draggable");
      onDragEnd && onDragEnd();
    };
    if (elem) {
      elem.setAttribute("draggable", true);
      elem.addEventListener("dragstart", dragStartCb);
      elem.addEventListener("dragover", dragOverCb);
      elem.addEventListener("dragend", dragEndCb);
      return () => {
        elem.removeEventListener("dragstart", dragStartCb);
        elem.removeEventListener("dragover", dragOverCb);
        elem.removeEventListener("dragend", dragEndCb);
      };
    }
  }, [ref, effect, id, onDragEnd, onDragOver, onDragStart]);
  return {
    dragState: dragState
  };
};

export default useDrag;
