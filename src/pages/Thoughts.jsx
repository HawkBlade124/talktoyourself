import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import axios from "axios";
import Add from  "../components/modals/Add.jsx";
import Dashboard from "../pages/Dashboard.jsx";

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
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const navigate = useNavigate();
const [error, setError] = useState("");

  const [deleteMsg, setDeleteMsg] = useState("");  

  const apiBase = buildApiUrl();
  const { folderName } = useParams();

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  axios
    .get(`${apiBase}/messages/${encodeURIComponent(folderName)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (res.data.success) setMessages(res.data.messages);
    })
    .catch((err) => {
      console.error("Error loading messages:", err.response?.data || err.message);
    });
}, [folderName]);

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
      { folderName, message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/${messageId}`,{
      method:"DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json();

    if(res.ok){
      setMessages((prev) => prev.filter((m) => m.MessageID !== messageId))
    } else {
      setError(data.error || "Failed to delete folder");
    }
  } catch (err) {
    console.error("Delete error:", err);
    setError("An error occurred while deleting.");
  }
  }


  const uploadFile = () => {
    document.getElementById("attachFile").click();
  };

  return (
    <div className="chatWrapper w-5xl m-auto">
        <div className="chatHead flex items-center gap-10">
            <h2 className="text-xl mb-5">Thoughts about "{folderName}"</h2>            
        </div>
        <Link to="/dashboard" className="p-2 bg-gray-500 br-5 rounded-md"><i className="fa-solid fa-arrow-left"></i> Back to Dashboard</Link>

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
            <h1>Welcome To {folderName}</h1>
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
                  <div key={i} className="flex flex-col">
                    <div className="flex justify-end items-center gap-5">
                        <div className="sentMessage">
                            {msg.Message} 
                        </div>
                        <div className="cursor-pointer" onClick={() => deleteMessage(msg.MessageID)}> <i className="fa-solid fa-trash-can"></i></div>
                    </div>
                    <div className="text-sm">
                        {new Date(msg.DateSent).toLocaleString()}
                    </div>
                  </div>                  
                ))}
              </div>
            )}
          </div>
        </div> 
      )}

      <div className="sendWrapper">
        <div id="fileInput">
          <input type="file" id="attachFile" style={{ display: "none" }} />
          <button onClick={uploadFile} className="fileUploadButton">
            <i className="fa-regular fa-paperclip"></i>
          </button>
        </div>

        <input
          id="messageInput"
          name="chatInput"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enteredMessage()}
          placeholder="A Penny For Your Thoughts?"
        />

        <button
          onClick={enteredMessage}
          id="sendChat"
          className="send"
          disabled={!message.trim()}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>

      </div>
    </div>
  );
}

export default Thought;
