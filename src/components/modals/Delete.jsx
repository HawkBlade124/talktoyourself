import ReactModal from 'react-modal';
import { useState } from 'react';

function DeleteModal({ isOpen, onClose, folder, onConfirm }) {
  return (
    <ReactModal
      id="deleteModal"
      className="modal w-200 m-auto bg-white radius-50 text-black"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <i className="fa-solid fa-xmark" onClick={onClose}></i>
      <div className="confirmation flex flex-col items-center gap-4 p-5">
        <p>
          Are you sure you want to delete <strong>{folder?.FolderName}</strong>?
        </p>
        <div className="flex gap-3">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </ReactModal>
  );
}


export default DeleteModal