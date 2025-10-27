import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Add from  "../components/modals/Add.jsx";

function buildApiUrl() {
  const raw = (import.meta.env.VITE_API_URL || window.location.origin).trim();
  const base = raw.replace(/\/+$/, "");
  const hasApi = /\/api$/.test(base);
  return hasApi ? base : `${base}/api`;
}

function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [h1Visible, setH1Visible] = useState(true);
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [reminderHidden, setReminderHidden] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const navigate = useNavigate();

  const apiBase = buildApiUrl();

  useEffect(() => {
    axios
      .get(`${apiBase}/messages/${userId}`)
      .then((res) => {
        if (res.data.success) setMessages(res.data.messages);
      })
      .catch((err) => console.error("Error loading messages:", err));
  }, [userId]);

  const enteredMessage = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { Message: message }]);
    setMessage("");
    setH1Visible(false);
    setChatBoxVisible(true);
    setReminderHidden(false);

    try {
      const res = await axios.post(`${apiBase}/messages`, {
        userId,
        message,
      });

      if (!res.data.success) {
        console.error("Failed to save message:", res.data.error);
      }
    } catch (err) {
      console.error("Error saving message:", err.response?.data || err.message);
    }
  };

  const uploadFile = () => {
    document.getElementById("attachFile").click();
  };

  return (
    <div className="chatWrapper w-5xl m-auto">
      <div className="thoughtToolbar w-2xl m-auto pt-5">
        <div id="saveChat" className="flex text-xl pr-5">
          Create Folder
        </div>
        <div id="chatFunctions">
          
        </div>
      </div>
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
            <h1>Welcome To Your Mind</h1>
            <i class="fa-solid fa-thought-bubble text-5xl"></i>                        
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
                  <div key={i} className="sentMessage">
                    {msg.Message}
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

export default Home;
