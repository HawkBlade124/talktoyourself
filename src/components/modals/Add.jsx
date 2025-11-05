import ReactModal from 'react-modal';
import { useState } from 'react';

function AddModal({ isOpen, onClose, onConfirm }) {
  const [thoughtName, setthoughtName] = useState("");
  const [thoughtDescr, setthoughtDescr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(thoughtName, thoughtDescr);
    setthoughtName("");
    setthoughtDescr("");
    onClose();
  };

  return (
    <ReactModal id="addModal" className="modal w-200 m-auto bg-white radius-50 text-black" isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}>
      <i className="fa-solid fa-xmark" onClick={onClose}></i>
      <div className="confirmation flex flex-col items-center gap-4 p-5">
        <h2>New Thought Group</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-start gap-5 mt-5">
          <input className="thoughtFormInput bg-white rounded-md h-8 pl-5 w-full border-gray-500" type="text" value={thoughtName} onChange={(e) => setthoughtName(e.target.value)} placeholder="thought Name" />
          <textarea className="thoughtFormInput bg-white rounded-md pl-5 h-15 w-full border-gray-500" value={thoughtDescr} onChange={(e) => setthoughtDescr(e.target.value)} placeholder="thought Description" />
          <div className="flex justify-between w-full">
            <button id="addthoughtBtn" className="modalButtons bg-green-500 hover:bg-green-400 cursor-pointer" type="submit">
              Add thought
            </button>
            <button id="cancelAction" className="modalButtons bg-gray-500 hover:bg-gray-400 cursor-pointer" onClick={onClose} type="button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}

export default AddModal;
