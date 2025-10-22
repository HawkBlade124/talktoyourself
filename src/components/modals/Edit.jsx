import { useState, useEffect } from "react";
import ReactModal from "react-modal";

function EditModal({ isOpen, onClose, folder, onSave }) {
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Folder Name" className="bg-white rounded-md p-2 border" />
        <textarea value={folderDescr} onChange={(e) => setFolderDescr(e.target.value)} placeholder="Folder Description" className="bg-white rounded-md p-2 border" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-3">
          Save Changes
        </button>
      </form>
    </ReactModal>
  );
}

export default EditModal;
