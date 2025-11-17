import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import EditModal from "../components/modals/Edit.jsx";
import DeleteModal from "../components/modals/Delete.jsx";
import AddModal from "../components/modals/Add.jsx";
import InfoModal from "../components/modals/Info.jsx";

function Dashboard() {
  
  const { user, Thoughts, setThoughts, token, loading } = useAuth();

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
      <div className="leftSidebar flex flex-col justiify-between h-100">
        <div className="sidebarLink"><i className="fa-regular fa-home"></i> Home</div>
        <div className="sidebarLink"><i className="fa-regular fa-game-board"></i> Mood Boards</div>
        <div className="sidebarLink"><i className="fa-regular fa-microphone-stand"></i> Prompts</div>
        <div className="sidebarLink"><i className="fa-regular fa-list"></i> Categories</div>
        <div className="sidebarLink"><i className="fa-regular fa-tag"></i> Tags</div>
        <div className="sidebarLink"><i className="fa-regular fa-list-tree"></i> Lists</div>
        <div className="sidebarLink"><i className="fa-regular fa-bullseye-arrow"></i> Goals</div>
        <hr></hr>
        <div className="sidebarLink"><i className="fa-regular fa-cog"></i> Settings</div>
        <div className="sidebarLink"><i className="fa-regular fa-left-from-bracket"></i> Logout</div>
      </div>
      <div className="rightScreen w-full pr-5 pt-5">
      <div id="homeHead" className="flex items-center gap-5">
        <h1>Hey there, {user.Username}!</h1> <span id="tierName" style={{ color: userTier(user.Tier), backgroundColor: `${userTier(user.Tier)}80` }}>{user.Tier}</span>
      </div>
      <section className="dashBody">
        <h2 className="text-2xl">Recent</h2>
        No recent thoughts
      </section>
      <section className="dashBody">
        <h2 className="text-2xl">Quick Access</h2>
        No pinned thoughts
      </section>
      <section className="dashBody">
        <h2 className="text-2xl">Lists</h2>
        No lists created.
      </section>
      <section className="dashBody">
        <h2 className="text-2xl">Mood Boards</h2>
        No Mood Boards.
      </section>
      <section className="dashBody">
        <div className="flex justify-between items-center"> 
        <h2 className="text-2xl">Your Brain Dump</h2>     
        <div className="addThoughtButton flex flex-col">          
          <i className="fa-kit text-7xl fa-regular-thought-bubble-circle-plus cursor-pointer" onClick={() => addThoughtModal()}></i>                    
        </div>      
        </div>
        <div className="flex w-full">        
        <div id="thoughtList" className="grid grid-cols-3 gap-15 w-full text-3xl mb-5 mt-5">
          {Thoughts.map((f, i) => (
            <div key={i} className="thoughtItem w-full flex flex-col items-center justify-between">
              <div className="flex justify-between w-full">              
                <i className="text-xl fa-regular fa-thumbtack-angle"></i>
                <div className="flex">              
                  <i onClick={() => favoriteThought(f.ThoughtID, !f.Favorite)} className={`text-xl cursor-pointer ${f.Favorite ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"}`}/>
                  <i onClick={() => infoThoughtModal(f)} className="text-xl cursor-pointer fa-regular fa-circle-info"/>              
                </div>
              </div>
              <div>{f.ThoughtName}</div>
              <div className="text-lg">{f.ThoughtDescr}</div>
              <div className="thoughtFoot flex items-center justify-between w-full mt-5">
                <Link to={`/thought/${encodeURIComponent(f.ThoughtName)}`} className="contThoughtButton text-base text-nowrap"><i className="text-green-500 hover:text-green-200 fa-regular fa-arrow-right"></i></Link>
                <div className="thoughtFunctions flex items-center justify-end w-full gap-1">
                  <i onClick={() => editSingleThought(f)} className="text-xl fa-solid fa-cog cursor-pointer hover:text-blue-200"></i>
                  <i onClick={() => deleteThoughtModal(f)} className="text-xl fa-solid fa-trash cursor-pointer text-red-500 hover:text-red-200"></i>
                  
                </div>
              </div>
            </div>
          ))}
        </div>      
        </div>
      </section>
      {error && <p className="text-red-500">{error}</p>}
      {/* <h2 className="mt-5 text-2xl">Tags</h2> */}
      {/* <h2 className="mt-5 text-2xl">Categories</h2> */} 
      </div>
      </div>
    </div>    
  );
}

export default Dashboard;
