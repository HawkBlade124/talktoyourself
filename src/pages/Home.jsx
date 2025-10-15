import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [h1Visible, setH1Visible] = useState(true);
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [reminderHidden, setReminderHidden] = useState(true);
  const [messageCount, setMessageCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.UserID;

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/messages/${userId}`)
      .then((res) => {
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      })
      .catch((err) => console.error("Error loading messages:", err));
  }, [userId]);

  const enteredMessage = async () => {
    if (!message.trim()) return;
    console.log("Sending...", message);
    setMessages((prev) => [...prev, { Message: message }]); // local UI update
    setMessage("");
    setH1Visible(false);
    setChatBoxVisible(true);  
    setReminderHidden(false);
    try {
      const res = await axios.post("http://localhost:5000/messages", {
        message,
        userId,
      });
      if (!res.data.success) {
        console.error("Failed to save message:", res.data.error);
      }
    } catch (err) {
      console.error("Error saving message:", err.response?.data || err.message);
    }
  };

  const uploadFile = () => {
    document.getElementById('attachFile').click();
  }
  return (
    <div className="chatWrapper">
      {h1Visible && (
        <div className="initialChatBody">
          <h1>Welcome To Your Mind</h1>
        </div>
      )}
      {chatBoxVisible && (
        <div className="chatbox">
          {!reminderHidden && (
            <p id="reminder">
              Remember, no one will reply to you in any of these chat. It’s purely a space for your thoughts.{" "}
              <i onClick={() => setReminderHidden(!reminderHidden)} className="fa-solid fa-times"></i>
            </p>
          )}
          <div className="sentMessages">            
            {messages.map((msg, i) => (
              <div key={i} className="sentMessage">
                {msg.Message}
              </div>
            ))}
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
        <button onClick={enteredMessage} id="sendChat" className="send" disabled={!message.trim()}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

export default Home;
