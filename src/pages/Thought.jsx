import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import axios from "axios";
import Add from  "../components/modals/Add.jsx";
import Dashboard from "./Dashboard.jsx";
import Grid from "@mui/material/Grid";


function buildApiUrl() {
  const raw = (import.meta.env.VITE_API_URL || window.location.origin).trim();
  const base = raw.replace(/\/+$/, "");
  const hasApi = /\/api$/.test(base);
  return hasApi ? base : `${base}/api`;
}

function Thought() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [h1Visible, setH1Visible] = useState(true);
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [reminderHidden, setReminderHidden] = useState(true);
  const [search, setSearch] = useState("");
  const [ThoughtDescription, setThoughtDescription] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const navigate = useNavigate();
  const [switchBtn, setSwitchBtn] = useState(true);
  const [addCat, setCat] = useState("");
  const [addTag, setTag] = useState("");
  const [showField, setShowField] = useState(true);
  const [ThoughtID, setThoughtID] = useState(null);
  const [TagID, setTagID] = useState(null);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");  
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);  
  const [deleteCat, setDeleteCat] = useState("");
  const [showTab, setShowTab] = useState("main");

const [hoveredId, setHoveredId] = useState(null);
  const apiBase = buildApiUrl();
  const { ThoughtName } = useParams();

const fetchMessages = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/Unauthorized");
    return;
  }

  try {
    const res = await axios.get(`${apiBase}/messages/${encodeURIComponent(ThoughtName)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {        
      setMessages(res.data.messages);
      if (res.data.Thought?.ThoughtDescr) {
        setThoughtDescription(res.data.Thought.ThoughtDescr);
      }
      if (res.data.Thought?.ThoughtID) {
        setThoughtID(res.data.Thought.ThoughtID);
      }                
    }
  } catch (err) {
    const status = err.response?.status;
    if (status === 401 || status === 403) navigate("/Unauthorized");
    else if (status === 404) navigate("/404");
    else console.error("Error fetching messages:", err);
  }
};

useEffect(() => {
  fetchMessages();
}, [ThoughtName, navigate]);


const enteredMessage = async () => {
  if (!message.trim()) return;

  setMessages((prev) => [...prev, { Message: message }]);
  setMessage("");
  setH1Visible(false);
  setChatBoxVisible(true);
  setReminderHidden(false);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const res = await axios.post(
      `${apiBase}/messages`,
      { ThoughtName, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.data.success) {
      console.error("Failed to save message:", res.data.error);
    }
  } catch (err) {
    console.error("Error saving message:", err.response?.data || err.message);
  }
};

const deleteMessage = async(messageId) =>{
  const token = localStorage.getItem("token");

  try{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/messages/${messageId}`,{
      method:"DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json();

    if(res.ok){
      setMessages((prev) => prev.filter((m) => m.MessageID !== messageId))
    } else {
      setError(data.error || "Failed to delete Thought");
    }
  } catch (err) {
    console.error("Delete error:", err);
    setError("An error occurred while deleting.");
  }
  }

const handleSearch = async (e) => {
  const term = e.target.value;
  setSearch(term);

  if (!term.trim()) {
    fetchMessages(); // restore current messages instead of clearing
    return;
  }

  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${apiBase}/search?q=${encodeURIComponent(term)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.success) setMessages(res.data.messages);
  } catch (err) {
    console.error("Search error:", err);
  }
};


const addCategory = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(
      `${apiBase}/categories`,
      { category: addCat, ThoughtID },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      setCategories((prev) => [...prev, { CategoryName: addCat, CategoryID: res.data.CategoryID }]);
      setCat("");
    } else {
      console.error("Category add failed:", res.data.error);
    }
  } catch (err) {
    if (!addCat.trim()) {
      setError("Please enter a category name");
    }
    console.error("Error Adding Category:", err.response?.data || err.message);
  }
};

useEffect(() => {
  if (!ThoughtID) return;
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${apiBase}/categories/${ThoughtID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  fetchCategories();
}, [ThoughtID]);

const deleteCategory = async(categoryId) =>{
    const token = localStorage.getItem("token");

    try{
      const res = await fetch(`${apiBase}/categories/${categoryId}`,{
        method:"DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json();

      if(res.ok){        
        setCategories((prev) => prev.filter((cat) => cat.CategoryID !== categoryId));
      } else {
        setError(data.error || "Failed to delete category");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("An error occurred while deleting.");
    }
}

const addTags = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(
      `${apiBase}/tags`,
      { tag: addTag, ThoughtID },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      setTags((prev) => [...prev, { TagName: addTag, TagID: res.data.TagID }]);
      setTag("");
    } else {
      console.error("Tag add failed:", res.data.error);
    }
  } catch (err) {
    if (!addTag.trim()) {
      setError("Please enter a tag name");
    }
    console.error("Error Adding Tag:", err.response?.data || err.message);
  }
};

const deleteTag = async(tagId) =>{
    const token = localStorage.getItem("token");

    try{
      const res = await fetch(`${apiBase}/tags/${tagId}`,{
        method:"DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json();

      if(res.ok){
        setTags((prev) => prev.filter((tag) => tag.TagID !== tagId));
      } else {
        setError(data.error || "Failed to delete tag");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("An error occurred while deleting.");
    }
}
useEffect(() => {
  if (!ThoughtID) return;
  const token = localStorage.getItem("token");

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${apiBase}/tags/${ThoughtID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setTags(res.data.tags || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  fetchTags();
}, [ThoughtID]);

const switchTabs = async () => {

}
  return (
    <div className="flex m-auto">      
      <div id="leftSidebar">
        <div className="tab" onClick={() => setShowTab("main")}>Main Detail Page</div>
        <div className="tab" onClick={() => setShowTab("thought")}>Thought input</div>
        <div className="tab" onClick={() => setShowTab("categories")}>Categories/tags</div>
        <Link to="/dashboard">Back To Thought bank</Link>
      </div>
      <div className="flex flex-col w-full">
        {showTab === "main" && (
          <div id="mainDetailPage">
            Main Details
          </div>
        )}
      {showTab === "thought" && (
      <div id="thoughtTab">
      {!reminderHidden && (
        <p id="reminder">
          Remember, no one will reply to you in any of these chats. It’s purely
          a space for your thoughts.{" "}
          <i
            onClick={() => setReminderHidden(!reminderHidden)}
            className="fa-solid fa-times"
          ></i>
        </p>
      )}   
      
      {messages.length === 0 ? (
        h1Visible && (          
          <div className="initialChatBody w-2xl m-auto flex flex-col gap-20">
            <div className="flex gap-5"> 
            <h1>Welcome To {ThoughtName}</h1>
            <i className="fa-solid fa-thought-bubble text-5xl"></i>                        
            </div>
            <div className="text-center">
              <p>A place to compile all your thoughts and talk to yourself. To begin, just enter a thought in the text bar. No one will reply. This place is purely organization for your thoughts.</p>
            </div>
          </div>          
        )
      ) : (
       <div className="chatbox">
          <div className="sentMessages">
            {messages.length === 0 ? (
              <p>No Messages Yet</p>
            ) : (
              <div>
                {messages.map((msg, i) => (
                  <div key={msg.MessageID} className="flex flex-col" >
                    <div className="flex flex-col justify-end items-end">
                      <div className="sentMessage flex flex-col items-end relative" onMouseEnter={() => setHoveredId(msg.MessageID)} onMouseLeave={() => setHoveredId(null)}>
                        <span className="text-xs">{new Date(msg.DateSent).toLocaleString()}</span>
                        {msg.Message}
                        {hoveredId === msg.MessageID && (
                          <div className="editGroup absolute top-10 z-200 mt-2 bg-gray-700 p-2 rounded-md flex justify-end gap-2">
                            <div className="cursor-pointer" onClick={() => editMessage(msg.MessageID)}>
                              <i className="fa-regular fa-pencil"></i>
                            </div>
                            <div className="cursor-pointer" onClick={() => deleteMessage(msg.MessageID)}>
                              <i className="fa-regular fa-trash-can"></i>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                 
                ))}
              </div>
            )}
          </div>
        </div> 
      )}

      <div className="sendWrapper w-full">
        <div id="fileInput">
          <input type="file" id="attachFile" style={{ display: "none" }} />
          <button className="fileUploadButton">
            <i className="fa-regular fa-paperclip"></i>
          </button>
        </div>

        <input id="messageInput" name="chatInput" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && enteredMessage()} placeholder="A Penny For Your Thoughts?" />

        <button onClick={enteredMessage} id="sendChat" className="send" disabled={!message.trim()}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
      )}
      {showTab === "categories" && (
          <div id="categoryTab">
        <div className="flex justify-center gap-2 sidebarSection text-xl rounded-md">
          <div className="w-full cursor-pointer text-center rounded-md pt-2 pb-2" onClick={() => setSwitchBtn(true)}>
            <i className="fa-light fa-list"></i>
          </div>
          <div className="w-full cursor-pointer text-center rounded-md pt-2 pb-2" onClick={() => setSwitchBtn(false)}>
            <i className="fa-light fa-tags"></i>
          </div>
        </div>      
        {switchBtn ? (
          <div className="sidebarList flex flex-col items-start">
            <div className="leftSidebarHead mt-6 flex justify-between items-center w-full gap-10">
              <h3 className="text-2xl">Categories</h3>
            </div>
            <div id="categoryList" className="">
              {categories.length === 0 ?(
                <p>No categories added. Please use the field below to add one.</p>
              ) : (
                <div className="categoryName">
                  {categories.map((cat, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="flex justify-end items-center gap-5">
                          <div className="category">
                            {cat.CategoryName} <i className="fa-solid fa-xmark" onClick={() => deleteCategory(cat.CategoryID)}></i>
                            
                          </div>
                      </div>
                    </div>                  
                  ))}
                </div>
              )}
            </div>
            <div className="showField flex justify-between w-full mt-5">
              <input className="leftSideField" type="text" name="category" placeholder="New Category" value={addCat} onChange={(e) => setCat(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCategory()}/>
              <button type="submit" onClick={addCategory} className="addButton rounded-md pr-5 pl-5 pt-1 pb-1"><i className="fa-solid fa-plus"></i></button>            
            </div>                        
          </div>
        ) : (
          <div className="sidebarList flex flex-col items-start">
            <div className="leftSidebarHead mt-6 flex justify-between items-center w-full gap-10">
              <h3 className="text-2xl">Tags</h3>
            </div>
            <div id="tagList" className="">
              {tags.length === 0 ?(
                <p>No tags added. Please use the field below to add one.</p>
              ) : (
                <div className="categoryName">
                  {tags.map((tag, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="flex justify-end items-center gap-5">
                          <div className="category">
                            {tag.TagName} <i className="fa-solid fa-xmark" onClick={() => deleteTag(tag.TagID)}></i>
                            
                          </div>
                      </div>
                    </div>                  
                  ))}
                </div>
              )}
            </div>
            <div className="showField flex justify-between w-full mt-5">
              <input className="leftSideField" type="text" name="category" placeholder="New Tag" value={addTag} onChange={(e) => setTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTags()} />
              <button onClick={addTags} className="addButton rounded-md pr-5 pl-5 pt-1 pb-1"><i className="fa-solid fa-plus"></i></button>
            </div>
            </div>
        )}
      </div> 
      )}
        <div className="thoughtInfoHead flex justify-between">
          <Link to="/dashboard" className="p-2 bg-gray-500 br-5 rounded-md"><i className="fa-solid fa-arrow-left"></i> Back to Dashboard</Link>
        </div>                
        <thought-sidebar>
          <div id="searchThoughts">
            <div id="searchSideBarHead" className="flex gap-2 items-center mt-5">              
                <i className="fa-solid fa-magnifying-glass"></i><input type="text" className="box-border" value={search} onChange={handleSearch} placeholder="Search Your Thoughts"/>

            </div>
{search.trim() ? (
  <div className="searchResults mt-3">
    {messages.length === 0 ? (
      <p className="text-gray-500 text-sm">No matches found.</p>
    ) : (
      <ul className="flex flex-col gap-2">
        {messages.map((msg) => (
          <li
            key={msg.MessageID}
            className="border p-2 rounded-md cursor-pointer hover:bg-gray-100"
            onClick={() => {
              if (msg.ThoughtName) {
                navigate(`/thought/${encodeURIComponent(msg.ThoughtName)}`);
              } else if (msg.ThoughtID) {
                navigate(`/thought/${encodeURIComponent(ThoughtName)}`);
              }
            }}
          >
            <div className="font-semibold">
              {msg.ThoughtName || "Unknown Thought"}
            </div>
            <div className="text-sm text-gray-600 truncate">{msg.Message}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
) : (
  <div className="defaultSidebar mt-3 text-gray-600 text-sm">
    <p>Search across all your thoughts.</p>    
  </div>
)}

          </div>
        </thought-sidebar>
      </div>
    </div>
  );
}

export default Thought;
