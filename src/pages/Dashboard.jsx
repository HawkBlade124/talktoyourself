import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import EditModal from "../components/modals/Edit.jsx";
import DeleteModal from "../components/modals/Delete.jsx";
import AddModal from "../components/modals/Add.jsx";
import InfoModal from "../components/modals/Info.jsx";
function Dashboard() {
  
  const { user, Thoughts, setThoughts } = useAuth();  
  const [error, setError] = useState("");  
  const [ThoughtName, setThoughtName] = useState("");
  const [ThoughtDescr, setThoughtDescr] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedThought, setSelectedThought] = useState("");
  
  const ThoughtCount = Thoughts.length;
  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchThoughts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Thoughts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setThoughts(Array.isArray(data) ? data : data.Thoughts || data.data || []);
      console.log("Fetched Thoughts:", data);
    } catch (err) {
      console.error("Error fetching Thoughts:", err);
      setError("Failed to load Thoughts");
    }
  };

  fetchThoughts();
}, [token]);


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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/thoughts/${ThoughtId}`, {
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/thoughts`, {
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

const editSingleThought = (Thought) => {
  console.log(Thought)
  setSelectedThought(Thought);
  setThoughtName(Thought.ThoughtName);
  setThoughtDescr(Thought.ThoughtDescr);
  setShowModal(true);
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

const infoModal = () =>{

}


if (!user) return null;
        
  return (    
    <div id="dashboard" className="w-full">
      <EditModal  isOpen={showModal}  onClose={() => setShowModal(false)}  Thought={selectedThought}  onSave={editThought}/>
      <DeleteModal  isOpen={showDeleteModal}  onClose={() => setShowDeleteModal(false)}  Thought={selectedThought}  onConfirm={() => deleteThought(selectedThought.ThoughtID)}/>
     <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onConfirm={(ThoughtName, ThoughtDescr) => addThought(ThoughtName, ThoughtDescr)}/>
    <InfoModal />
      <h1>Welcome, {user.Username}!</h1>
      <h2 className=""></h2>
      <div className="flex justify-between items-center">        
      <h2 className="mt-5 text-4xl">Thought Bubbles</h2>   
        <div className="addThoughtButton flex flex-col">          
          <i className="fa-kit text-7xl fa-regular-thought-bubble-circle-plus cursor-pointer" onClick={() => addThoughtModal()}></i>          
        </div>
      </div>
      <div className="flex">              
      <ul id="ThoughtList" className="grid grid-cols-3 gap-15 w-full text-3xl mb-5 mt-5">
        {Thoughts.map((f, i) => (
          <li key={i} className="ThoughtItem w-full flex flex-col items-center justify-between">
            <div className="flex justify-between w-full">              
              <i className="fa-solid fa-thought-bubble"></i>
              <i className="text-xl fa-regular fa-circle-info"></i>
            </div>
            <div>{f.ThoughtName}</div>
            <div className="text-lg">{f.thoughtDescr}</div>
            <div className="ThoughtFoot flex items-center justify-between w-full mt-5">
              <Link to={`/thought/${encodeURIComponent(f.ThoughtName)}`} className="contThoughtButton text-base text-nowrap"><i className="text-blue-800 fa-regular fa-arrow-right"></i></Link>
              <div className="ThoughtFunctions flex items-center justify-end w-full gap-1">
                <i
                  className="text-xl fa-solid fa-pencil cursor-pointer"
                  onClick={() => editSingleThought(f)}
                ></i>
                <i onClick={() => deleteThoughtModal(f)} className="text-xl fa-solid fa-trash cursor-pointer text-red-700"></i>
                
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div> 
      

      {ThoughtCount > 0 && <p>Total Thoughts: {ThoughtCount}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* <h2 className="mt-5 text-2xl">Tags</h2> */}
      {/* <h2 className="mt-5 text-2xl">Categories</h2> */}
    </div>    
  );
}

export default Dashboard;
