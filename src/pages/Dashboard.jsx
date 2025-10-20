import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";

function Dashboard() {
  const { user } = useAuth();
  const { folder } = useAuth();
  const [error, setError] = useState("");
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [folderDescr, setFolderDescr] = useState("");
  const [flipFolder, setFlipFolder] = useState(false);
  const folderCount = folders.length;
  const content = folderCount > 0 ? "Folders Found" : "No Folders Found";
  const token = localStorage.getItem("token");
  
  if (!user) return null;

  const addFolders = async (e) => {
    e.preventDefault();

    if (!folderName.trim()) {
      setError("Folder Name Required");
      return;
    }

    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/folders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          UserID: user.id,
          FolderName: folderName.trim(),
          FolderDescr: folderDescr.trim(),
        }),
      });

      const data = await res.json();
      console.log("Params:", [user.id, folderName, folderDescr]);
      console.log("Response:", data);

      if (res.ok) {
        alert("Folder added!");
        setFolders((prev) => [...prev, data.newFolder]); // assuming API returns folder
      } else {
        setError(data.error || "Cannot add folder. Please check your entry.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred. Please try again.");
    }
    
  };
  function showAddFolder() {
    setFlipFolder((flipFolder) => !flipFolder);    
  }
  return (
    <div className="w-md">
      <h1>Welcome, {user.Username}!</h1>
      <h2 className="mt-5 text-2xl">Folders</h2>      
      <p className="mb-5">{folders.FolderName}</p>
      {folderCount > 0 && <p>Total Folders: {folderCount}</p>}
      <div className="addFolderButton">
        <button onClick={showAddFolder}><i className="text-9xl fa-regular fa-folder-plus"></i></button>
      </div>
      {flipFolder && (<form onSubmit={addFolders} className="flex flex-col items-start gap-5 mt-5">
          <input className="bg-white rounded-md h-8 pl-5 w-full" type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Folder Name" />
          <textarea className="bg-white rounded-md pl-5 h-15 w-full" type="text" value={folderDescr} onChange={(e) => setFolderDescr(e.target.value)} placeholder="Folder Description" />
          <button type="submit">Add Folder</button>
        </form>)}

      {error && <p className="text-red-500">{error}</p>}
      <h2 className="mt-5 text-2xl">Tags</h2>
      <h2 className="mt-5 text-2xl">Categories</h2>
    </div>    
  );
}

export default Dashboard;
