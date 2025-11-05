import ReactModal from "react-modal";
import { useState, useEffect } from "react";

function EditModal({ isOpen, onClose, thought, onSave }) {
  const [thoughtName, setthoughtName] = useState("");
  const [thoughtDescr, setthoughtDescr] = useState("");

  useEffect(() => {
    if (thought) {
      setthoughtName(thought.thoughtName || "");
      setthoughtDescr(thought.thoughtDescr || "");
    }
  }, [thought]);

const handleSubmit = (e) => {
  e.preventDefault();
  if (thought) onSave(thought.thoughtID, thoughtName, thoughtDescr);
  onClose();
};

  if (!thought) return null;

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose}>
      <div className="modalHead flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold uppercase">
          {thought?.thoughtName || "Edit thought"}
        </h2>
        <i
          className="fa-solid fa-xmark cursor-pointer"
          onClick={onClose}
        ></i>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" value={thoughtName} onChange={(e) => setthoughtName(e.target.value)} placeholder="thought Name" className="bg-white rounded-md p-2 border" />
        <textarea value={thoughtDescr} onChange={(e) => setthoughtDescr(e.target.value)} placeholder="thought Description" className="bg-white rounded-md p-2 border" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-3">
          Save Changes
        </button>
      </form>
    </ReactModal>
  );
}

export default EditModal;
