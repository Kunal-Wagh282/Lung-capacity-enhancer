import React, { useRef, useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, newChildUsername, setNewChildUsername, newChildDOB, setNewChildDOB, handleAddChildUser }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <div>
      {isOpen && (
        <div className="modal">
          <div className="modal-content" ref={modalRef}>
            <span className="close" onClick={onClose}>&times;</span>
            <div className="add-child-user-form">
              <h3>Add Child User</h3>
              <input
                type="text"
                value={newChildUsername}
                onChange={(e) => setNewChildUsername(e.target.value)}
                placeholder="Child Username"
                required
              />
              <input
                type="date"
                value={newChildDOB}
                onChange={(e) => setNewChildDOB(e.target.value)}
                placeholder="Child Date of Birth"
                required
              />
              <button onClick={handleAddChildUser}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;






 
//  {addingChildUser && (
//     <div className="add-child-user-form">
//       <h3>Add Child User</h3>
//       <input
//         type="text"
//         value={newChildUsername}
//         onChange={(e) => setNewChildUsername(e.target.value)}
//         placeholder="Child Username"
//         required
//       />
//       <input
//         type="date"
//         value={newChildDOB}
//         onChange={(e) => setNewChildDOB(e.target.value)}
//         placeholder="Child Date of Birth"
//         required
//       />
//       <button onClick={handleAddChildUser} disabled={!addingChildUser}>
//         Add
//       </button>
      
//     </div>
//   )}