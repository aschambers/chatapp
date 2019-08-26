import React, { useEffect, useRef } from 'react';
import './CategoryModal.css';

const CategoryModal = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShowCategoryModal(false));

  return (
    <div ref={ref} className="categorymodal-container">
      <p className="categorymodal-container-title">Create Category</p>
      <p className="categorymodal-container-name">Category Name</p>
      <input onChange={(event) => { props.setNewCategory(event); }} /><br />
      <button className="categorymodal-container-cancel" onClick={() => { props.setShowCategoryModal(false); }}>Cancel</button>
      <button className="categorymodal-container-create" onClick={() => { props.createNewCategory(); }}>Create</button>
    </div>
  );
}

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = event => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default CategoryModal;