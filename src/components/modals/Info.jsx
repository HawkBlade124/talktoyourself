import ReactModal from "react-modal";
import { useState, useEffect } from "react";

function InfoModal({ isOpen, onClose, thought, onSave }) {
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
      <div class="flex flex-col">
        <h2>{thoughtName}</h2>
        <p>{thoughtDescr}</p>
      </div>
    </ReactModal>
  );
}

export default InfoModal;
