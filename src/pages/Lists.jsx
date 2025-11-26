import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import EditModal from "../components/modals/Edit.jsx";
import DeleteModal from "../components/modals/Delete.jsx";
import AddModal from "../components/modals/Add.jsx";
import InfoModal from "../components/modals/Info.jsx";

function Dashboard() {
  
  const { user, Thoughts, setThoughts, token, loading, logout } = useAuth();

  const [error, setError] = useState("");  
  const [ThoughtName, setThoughtName] = useState("");
  const [ThoughtDescr, setThoughtDescr] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedThought, setSelectedThought] = useState("");
  const [favorite, setFavorite] = useState(false);
 const [mobileMenu, setMobileMenu] = useState(true);
  const closeMobileMenu = () =>{
    setMobileMenu(prev => !prev);
  }

const editThought = async (ThoughtId, newName, newDescr) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/thoughts/${ThoughtId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ThoughtName: newName.trim(),
        ThoughtDescr: newDescr.trim(),
      }),
    });

    const data = await res.json();
    if (res.ok) {  
      setThoughts((prev) =>
        prev.map((f) =>
          f.ThoughtID === ThoughtId
            ? { ...f, ThoughtName: newName, ThoughtDescr: newDescr }
            : f
        )
      );
    } else {
      setError(data.error || "Failed to update Thought");
    }
  } catch (err) {
    console.error("Edit error:", err);
    setError("An error occurred while editing.");
  }
};

const deleteThought = async (ThoughtId) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/thoughts/${ThoughtId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (res.ok) {
      setThoughts((prev) => prev.filter((f) => f.ThoughtID !== ThoughtId));
    } else {
      setError(data.error || "Failed to delete Thought");
    }
  } catch (err) {
    console.error("Delete error:", err);
    setError("An error occurred while deleting.");
  }
};

const addThought = async (ThoughtName, ThoughtDescr) => {

  if (!ThoughtName.trim()) {
    setError("Thought Name Required");
    return;
  }

  try {

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/thoughts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ThoughtName: ThoughtName.trim(),
        ThoughtDescr: ThoughtDescr.trim(),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setThoughts((prev) => [...prev, data.newThought]);
      setShowForm(false);
      setThoughtName("");
      setThoughtDescr("");
      setError("");
    } else {
      setError(data.message || data.error || "Unauthorized or invalid entry.");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setError("An error occurred. Please try again.");
  }
};
const favoriteThought = async (ThoughtId, Favorite) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/thoughts/${ThoughtId}/favorite`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ Favorite: Favorite ? 1 : 0 }),
    });

    const data = await res.json();

    if (res.ok) {
      setThoughts((prev) =>
        prev.map((f) =>
          f.ThoughtID === ThoughtId ? { ...f, Favorite } : f
        )
      );
    } else {
      setError(data.error || "Failed to update Thought");
    }
  } catch (err) {
    console.error("Edit error:", err);
    setError("An error occurred while editing.");
  }
};

const editSingleThought = (Thought) => {
  console.log(Thought)
  setSelectedThought(Thought);
  setThoughtName(Thought.ThoughtName);
  setThoughtDescr(Thought.ThoughtDescr);
  setShowEditModal(true);
};

const deleteThoughtModal = (Thought)=>{
    console.log(Thought)
  setSelectedThought(Thought);
  setThoughtName(Thought.ThoughtName);
  setThoughtDescr(Thought.ThoughtDescr);
  setShowDeleteModal(true);
}

const addThoughtModal = () => {
  setThoughtName("");
  setThoughtDescr("");
  setSelectedThought(null);
  setShowAddModal(true);
};

const infoThoughtModal = (thought) =>{
  setSelectedThought(thought);
  setShowInfoModal(true);
}


useEffect(() => {
  if (loading || !token) return;

  const fetchThoughts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/thoughts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setThoughts(Array.isArray(data) ? data : data.Thoughts || data.data || []);
    } catch (err) {
      console.error("Error fetching Thoughts:", err);
      setError("Failed to load Thoughts");
    }
  };

  fetchThoughts();
}, [token, loading]);
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl animate-pulse">Loading your thoughts...</div>
    </div>
  );
}

const userTier = (tierColor) =>{
  switch(tierColor){
    case 'Free':
      return '#63ea94';
    case 'Unlimited':
      return '#d6b25d';
    case 'Unlimited Free Lifetime':
      return '#85a1c8';
    default:
      return '#ccc';
  }  
}
if (!user) return null;
        

  return (    
    <div id="dashboard" className="w-full">
      <EditModal  isOpen={showEditModal}  onClose={() => setShowEditModal(false)} thought={selectedThought}  onSave={editThought}/>
      <DeleteModal  isOpen={showDeleteModal}  onClose={() => setShowDeleteModal(false)} thought={selectedThought}  onConfirm={() => deleteThought(selectedThought.ThoughtID)}/>
     <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onConfirm={(ThoughtName, ThoughtDescr) => addThought(ThoughtName, ThoughtDescr)}/>
    <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} thought={selectedThought}/>
      <div id="dashWrap" className="flex w-full">
      <div id="mobileMenu" className={`leftSidebar flex justify-between h-full ${ mobileMenu ? "flex" : "hidden" }`}>
        <div className="flex flex-col w-full">        
        <div className="lg:hidden text-right mt-5 w-full">
          <i className="fa-regular fa-xmark text-2xl" onClick={closeMobileMenu}/>
        </div>
          
            <Link to="/dashboard" className="sidebarLink"><i className="fa-regular fa-home"></i> Home</Link>
            <div className="sidebarLink"><i className="fa-regular fa-game-board"></i> Mood Boards</div>
            <div className="sidebarLink"><i className="fa-regular fa-microphone-stand"></i> Prompts</div>
            <div className="sidebarLink"><i className="fa-regular fa-list"></i> Categories</div>
            <div className="sidebarLink"><i className="fa-regular fa-tag"></i> Tags</div>
            <Link to="/lists" className="sidebarLink"><i className="fa-regular fa-list-tree"></i> Lists</Link>
            <div className="sidebarLink"><i className="fa-regular fa-bullseye-arrow"></i> Goals</div>        
          <hr></hr>
          <div className="sidebarLink"><i className="fa-regular fa-cog"></i> Settings</div>
          <div className="sidebarLink"  onClick={logout}><i className="fa-regular fa-left-from-bracket"></i> Logout</div>
        </div>
      </div>
      <div id="dashOverlay" className={`lg:hidden w-full h-full ${ mobileMenu ? "block" : "hidden" }`} onClick={closeMobileMenu} ></div>
      <div className="rightScreen w-full p-2 ml">
      <div id="homeHead" className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1>Hey there, {user.Username}!</h1> <span id="tierName" style={{ color: userTier(user.Tier), backgroundColor: `${userTier(user.Tier)}80` }}>{user.Tier}</span>
        </div>
        <div id="hamburger" className="lg:hidden text-2xl">
          <i className="fa-regular fa-bars" onClick={() => setMobileMenu(!mobileMenu)}></i>
        </div>
      </div>
      <div id="dashLayout" className="flex justify-between w-full  mt-5">
      <section className="dashBody w-full">
        
      </section>

      </div>
      {error && <p className="text-red-500">{error}</p>}
      </div>
      </div>
    </div>    
  );
}

export default Dashboard;
