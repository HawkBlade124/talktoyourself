import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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
  const [reminderHidden, setReminderHidden] = useState(true);
  const [search, setSearch] = useState("");
  const [ThoughtDescription, setThoughtDescription] = useState("");

  const [switchBtn, setSwitchBtn] = useState(true);
  const [addCat, setCat] = useState("");
  const [addTag, setTag] = useState("");
  const [ThoughtID, setThoughtID] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [activeTab, setActiveTab] = useState("main");

  const { token, loading } = useAuth();
  const navigate = useNavigate();
  const { ThoughtName } = useParams();
  const apiBase = buildApiUrl();

  useEffect(() => {
    if (!loading && !token) {
      navigate("/Unauthorized");
    }
  }, [loading, token, navigate]);

  // ---------- Fetch messages ----------
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${apiBase}/messages/${encodeURIComponent(ThoughtName)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setMessages(res.data.messages || []);
        setThoughtDescription(res.data.Thought?.ThoughtDescr || "");
        setThoughtID(res.data.Thought?.ThoughtID || null);
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) navigate("/Unauthorized");
      else if (status === 404) navigate("/404");
      else console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token, ThoughtName]);

  // ---------- Enter message ----------
  const enteredMessage = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { Message: message }]);
    setMessage("");
    setH1Visible(false);
    setReminderHidden(false);

    try {
      await axios.post(
        `${apiBase}/messages`,
        { ThoughtName, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error saving message:", err.response?.data || err.message);
      setError("Could not save your message.");
    }
  };

  // ---------- Delete message ----------
  const deleteMessage = async (messageId) => {
    try {
      const res = await fetch(`${apiBase}/messages/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.MessageID !== messageId));
      } else {
        setError(data.error || "Failed to delete message");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("An error occurred while deleting.");
    }
  };

  // ---------- Search ----------
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearch(term);

    if (!term.trim()) {
      fetchMessages();
      return;
    }

    try {
      const res = await axios.get(
        `${apiBase}/search?q=${encodeURIComponent(term)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // ---------- Categories ----------
  useEffect(() => {
    if (!ThoughtID) return;
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${apiBase}/categories/${ThoughtID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    loadCategories();
  }, [ThoughtID, apiBase, token]);

  const addCategory = async () => {
    if (!addCat.trim()) {
      setError("Please enter a category name");
      return;
    }

    try {
      const res = await axios.post(
        `${apiBase}/categories`,
        { category: addCat, ThoughtID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) { 
          setCategories((prev) => [
          ...prev,
          { CategoryName: addCat, CategoryID: res.data.CategoryID },
        ]);
        setCat("");
        setError("");
      } else {
        console.error("Category add failed:", res.data.error);
      }
    } catch (err) {
      console.error("Error Adding Category:", err.response?.data || err.message);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const res = await fetch(`${apiBase}/categories/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setCategories((prev) =>
          prev.filter((cat) => cat.CategoryID !== categoryId)
        );
      } else {
        setError(data.error || "Failed to delete category");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("An error occurred while deleting.");
    }
  };

  // ---------- Tags ----------
  useEffect(() => {
    if (!ThoughtID) return;
    const loadTags = async () => {
      try {
        const res = await axios.get(`${apiBase}/tags/${ThoughtID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setTags(res.data.tags || []);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    loadTags();
  }, [ThoughtID, apiBase, token]);

  const addTags = async () => {
    if (!addTag.trim()) {
      setError("Please enter a tag name");
      return;
    }

    try {
      const res = await axios.post(
        `${apiBase}/tags`,
        { tag: addTag, ThoughtID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setTags((prev) => [
          ...prev,
          { TagName: addTag, TagID: res.data.TagID },
        ]);
        setTag("");
        setError("");
      } else {
        console.error("Tag add failed:", res.data.error);
      }
    } catch (err) {
      console.error("Error Adding Tag:", err.response?.data || err.message);
    }
  };

  const deleteTag = async (tagId) => {
    try {
      const res = await fetch(`${apiBase}/tags/${tagId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setTags((prev) => prev.filter((tag) => tag.TagID !== tagId));
      } else {
        setError(data.error || "Failed to delete tag");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("An error occurred while deleting.");
    }
  };
  const switchTabs = () => {    
    switch(active) {
      case "search":
        return
    }
  }
  return (
    <>
        <div id="headBar" className="p-5 lg:hidden md:flex items-center"> 
            <Link to="/dashboard" className="p-2 bg-gray-500 br-5 rounded-md lg:hidden items-center gap-2">
              <i className="fa-solid fa-arrow-left"></i>              
            </Link>         
            <div id="headBarWrap" className="flex items-center justify-center rounded-md">
              <div id="thoughtSearch" className={`p-2 ${activeTab === "search" ? "bg-blue-500 text-white rounded-md" : ""}`} onClick={() => setActiveTab("search")}>Search</div>
              <div id="main" className={`p-2 ${activeTab === "main" ? "bg-blue-500 text-white rounded-md" : ""}`} onClick={() => setActiveTab("main")}>Main</div>
              <div id="thoughtDetails" className={`p-2 ${activeTab === "details" ? "bg-blue-500 text-white rounded-md" : ""}`}  onClick={() => setActiveTab("details")}>Details</div>
            </div>
        </div>
      <div id="thoughtBody" className="flex flex-col lg:flex-row m-auto">

        {/* LEFT SIDEBAR */}
        <div id="leftSide"   className={`sidebar p-5 ${activeTab === "search" ? "block" : "hidden"} lg:block`}>
          <div id="searchThoughts">
            <div id="searchSideBarHead" className="flex gap-2 items-center mt-5">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" className="box-border" value={search} onChange={handleSearch} placeholder="Search Your Thoughts"/>
            </div>

            {search.trim() ? (
              <div className="searchResults mt-3">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-sm">No matches found.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {messages.map((msg) => (
                      <li key={msg.MessageID} className="border p-2 rounded-md cursor-pointer hover:bg-gray-100" onClick={() => { const targetThought = msg.ThoughtName || ThoughtName || ""; navigate(`/thought/${encodeURIComponent(targetThought)}`);}}>
                        <div className="font-semibold">
                          {msg.ThoughtName || "Unknown Thought"}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {msg.Message}
                        </div>
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
        </div>

        {/* MAIN AREA */}
        <div id="mainSection"   className={`flex flex-col w-full chatInput justify-between mr-10 ml-10 ${activeTab === "main" ? "flex" : "hidden"} lg:flex`}>
          <div className="thoughtInfoHead flex items-center gap-10">
            <Link to="/dashboard" className="backtodashbtn ml-5 rounded-md flex items-center gap-2 justify-center">
              <i className="fa-solid fa-arrow-left"></i>            
            </Link>
            <div id="thoughtName" className="text-3xl font-bold text-center w-full"> Thoughts of {ThoughtName}</div>
          </div>

          {!reminderHidden && (
            <p id="reminder">
              Remember, no one will reply to you in any of these chats. It’s
              purely a space for your thoughts.
              <i
                onClick={() => setReminderHidden(true)}
                className="fa-solid fa-times cursor-pointer ml-2"
              ></i>
            </p>
          )}

          {/* EMPTY STATE */}
          {messages.length === 0 && h1Visible ? (
            <div className="initialChatBody w-2xl m-auto flex flex-col gap-20 mb-5">
              <div className="flex gap-5">
                <h1>Welcome To {ThoughtName}</h1>
                <i className="fa-solid fa-thought-bubble text-5xl"></i>
              </div>
              <div className="text-center">
                <p>
                  A place to compile all your thoughts and talk to yourself. To
                  begin, just enter a thought in the text bar.
                </p>
              </div>
            </div>
          ) : (
            <div className="chatbox w-full h-full ">
              <div className="sentMessages w-full">
                {messages.map((msg) => (
                  <div key={msg.MessageID} className="sentMessage flex flex-col justify-start items-start w-full" >
                    <div className="flex items-start justify-between w-full" onMouseEnter={() => setHoveredId(msg.MessageID)} onMouseLeave={() => setHoveredId(null)} >
                      <span className="text-xs">
                        {msg.DateSent ? new Date(msg.DateSent).toLocaleString() : ""}
                      </span>
                        <div className="editGroup rounded-md flex justify-end gap-2">
                          <div className="cursor-pointer" onClick={() => editMessage(msg.MessageID)}>
                            <i className="fa-regular fa-pencil"></i>
                          </div>
                          <div className="cursor-pointer" onClick={() => deleteMessage(msg.MessageID)}>
                            <i className="fa-regular fa-trash-can"></i>
                          </div>
                        </div>
                    </div>
                    <div className="messageString">{msg.Message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="sendWrapper w-full p-5 flex gap-5">
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

          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}
        </div>
        <div id="rightSide"   className={`sidebar p-5 flex-col ${activeTab === "details" ? "flex" : "hidden"} lg:flex`}>
            <h2 className="text-xl w-full">Detailed Information</h2>
            <section className="sidebarSection">
              <h3 className="text-lg">Lists</h3>
              <div className=""></div>
            </section>
            <section className="sidebarSection">
              <h3 className="text-lg">Categories</h3>
              <div className=""></div>
            </section>          
            <section className="sidebarSection">
              <h3 className="text-lg">Tags</h3>
              <div className=""></div>
            </section>
        </div>
      </div>
    </>
  );
}

export default Thought;
