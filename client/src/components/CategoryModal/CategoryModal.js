import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
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

export default CategoryModal;