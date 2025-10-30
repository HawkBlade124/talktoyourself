import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import EditModal from "../components/modals/Edit.jsx";
import DeleteModal from "../components/modals/Delete.jsx";
import AddModal from "../components/modals/Add.jsx";
import InfoModal from "../components/modals/Info.jsx";
function Dashboard() {
  
  const { user, folders, setFolders } = useAuth();  
  const [error, setError] = useState("");  
  const [folderName, setFolderName] = useState("");
  const [folderDescr, setFolderDescr] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  
  const folderCount = folders.length;
  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchFolders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFolders(Array.isArray(data) ? data : data.folders || data.data || []);
      console.log("Fetched folders:", data);
    } catch (err) {
      console.error("Error fetching folders:", err);
      setError("Failed to load folders");
    }
  };

  fetchFolders();
}, [token]);


const editFolder = async (folderId, newName, newDescr) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/folders/${folderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        FolderName: newName.trim(),
        FolderDescr: newDescr.trim(),
      }),
    });

    const data = await res.json();
    if (res.ok) {  
      setFolders((prev) =>
        prev.map((f) =>
          f.FolderID === folderId
            ? { ...f, FolderName: newName, FolderDescr: newDescr }
            : f
        )
      );
    } else {
      setError(data.error || "Failed to update folder");
    }
  } catch (err) {
    console.error("Edit error:", err);
    setError("An error occurred while editing.");
  }
};

const deleteFolder = async (folderId) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/folders/${folderId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
      setFolders((prev) => prev.filter((f) => f.FolderID !== folderId));
    } else {
      setError(data.error || "Failed to delete folder");
    }
  } catch (err) {
    console.error("Delete error:", err);
    setError("An error occurred while deleting.");
  }
};

const addFolder = async (folderName, folderDescr) => {

  if (!folderName.trim()) {
    setError("Folder Name Required");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        FolderName: folderName.trim(),
        FolderDescr: folderDescr.trim(),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setFolders((prev) => [...prev, data.newFolder]);
      setShowForm(false);
      setFolderName("");
      setFolderDescr("");
      setError("");
    } else {
      setError(data.message || data.error || "Unauthorized or invalid entry.");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setError("An error occurred. Please try again.");
  }
};

const editSingleFolder = (folder) => {
  console.log(folder)
  setSelectedFolder(folder);
  setFolderName(folder.FolderName);
  setFolderDescr(folder.FolderDescr);
  setShowModal(true);
};

const deleteFolderModal = (folder)=>{
    console.log(folder)
  setSelectedFolder(folder);
  setFolderName(folder.FolderName);
  setFolderDescr(folder.FolderDescr);
  setShowDeleteModal(true);
}

const addFolderModal = () => {
  setFolderName("");
  setFolderDescr("");
  setSelectedFolder(null);
  setShowAddModal(true);
};

const infoModal = () =>{

}


if (!user) return null;
        
  return (    
    <div id="dashboard" className="w-full">
      <EditModal  isOpen={showModal}  onClose={() => setShowModal(false)}  folder={selectedFolder}  onSave={editFolder}/>
      <DeleteModal  isOpen={showDeleteModal}  onClose={() => setShowDeleteModal(false)}  folder={selectedFolder}  onConfirm={() => deleteFolder(selectedFolder.FolderID)}/>
     <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onConfirm={(folderName, folderDescr) => addFolder(folderName, folderDescr)}/>
    <InfoModal />
      <h1>Welcome, {user.Username}!</h1>
      <h2 className=""></h2>
      <div className="flex justify-between items-center">        
      <h2 className="mt-5 text-4xl">Thought Bubbles</h2>   
        <div className="addFolderButton flex flex-col">          
          <i className="fa-kit text-7xl fa-regular-thought-bubble-circle-plus cursor-pointer" onClick={() => addFolderModal()}></i>          
        </div>
      </div>
      <div className="flex">              
      <ul id="folderList" className="grid grid-cols-3 gap-15 w-full text-3xl mb-5 mt-5">
        {folders.map((f, i) => (
          <li key={i} className="folderItem w-full flex flex-col items-center justify-between">
            <div className="flex justify-between w-full">              
              <i className="fa-solid fa-thought-bubble"></i>
              <i class="text-xl fa-regular fa-circle-info"></i>
            </div>
            <div>{f.FolderName}</div>
            <div className="text-lg">{f.FolderDescr}</div>
            <div className="folderFoot flex items-center justify-between w-full mt-5">
              <Link to={`/thought/${encodeURIComponent(f.FolderName)}`} className="contThoughtButton text-base text-nowrap"><i className="text-blue-800 fa-regular fa-arrow-right"></i></Link>
              <div className="folderFunctions flex items-center justify-end w-full gap-1">
                <i
                  className="text-xl fa-solid fa-pencil cursor-pointer"
                  onClick={() => editSingleFolder(f)}
                ></i>
                <i onClick={() => deleteFolderModal(f)} className="text-xl fa-solid fa-trash cursor-pointer text-red-700"></i>
                
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div> 
      

      {folderCount > 0 && <p>Total Folders: {folderCount}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* <h2 className="mt-5 text-2xl">Tags</h2> */}
      {/* <h2 className="mt-5 text-2xl">Categories</h2> */}
    </div>    
  );
}

export default Dashboard;
