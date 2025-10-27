import ReactModal from "react-modal";
import { useState, useEffect } from "react";

function InfoModal({ isOpen, onClose, folder, onSave }) {
  const [folderName, setFolderName] = useState("");
  const [folderDescr, setFolderDescr] = useState("");

  useEffect(() => {
    if (folder) {
      setFolderName(folder.FolderName || "");
      setFolderDescr(folder.FolderDescr || "");
    }
  }, [folder]);

const handleSubmit = (e) => {
  e.preventDefault();
  if (folder) onSave(folder.FolderID, folderName, folderDescr);
  onClose();
};

  if (!folder) return null;

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose}>
      <div className="modalHead flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold uppercase">
          {folder?.FolderName || "Edit Folder"}
        </h2>
        <i
          className="fa-solid fa-xmark cursor-pointer"
          onClick={onClose}
        ></i>
      </div>
      <div class="flex flex-col">
        <h2>{folderName}</h2>
        <p>{folderDescr}</p>
      </div>
    </ReactModal>
  );
}

export default InfoModal;
