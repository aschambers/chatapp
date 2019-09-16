import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import useOnClickOutside from '../../utils/useOnClickOutside';
import './CategoryModal.css';

const CategoryModal = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setShowCategoryModal(false));

  const categoryModelCreate = () => {
    if (props.newCategory !== "" && props.newCategory.length > 2 && props.newCategory.length < 21) {
      props.createNewCategory();
    } else {
      toast.dismiss();
      toast.error('Error, the name of the channel does not meet the requirements.', { position: 'bottom-center' });
    }
  }

  return (
    <div ref={ref} className="categorymodal-container">
      <p className="categorymodal-container-title">Create Category</p>
      <p className="categorymodal-container-name">Category Name</p>
      <input onChange={(event) => { props.setNewCategory(event); }} /><br />
      <button className="categorymodal-container-cancel" onClick={() => { props.setShowCategoryModal(false); }}>Cancel</button>
      <button className="categorymodal-container-create" onClick={categoryModelCreate}>Create</button>
    </div>
  );
}

export default CategoryModal;