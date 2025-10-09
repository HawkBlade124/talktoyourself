// pages/Home.js
import { useState } from 'react';

function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [h1Visible, setH1Visible] = useState(true);
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [reminderHidden, setReminderHidden] = useState(true);

  const enteredMessage = () => {
    if (!message.trim()) return;
    console.log('Sending...', message);
    setMessages((prev) => [...prev, message]);
    setMessage('');
    setH1Visible(false);
    setChatBoxVisible(true);
  };

  const toggleReminder = () => {
    setReminderHidden(!reminderHidden);
  };

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
              Remember, no one will reply to you in this chat. It’s purely a space for your thoughts.{' '}
              <i onClick={toggleReminder} className="fa-solid fa-times"></i>
            </p>
          )}
          <div className="sentMessages">
            {messages.map((msg, i) => (
              <div key={i} className="sentMessage">{msg}</div>
            ))}
          </div>
        </div>
      )}
      <div className="sendWrapper">
        <div className="select">
          <div className="icons">
            <i className="fa-solid fa-paperclip"></i>
          </div>
        </div>
        <input
          id="messageInput"
          name="chatInput"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enteredMessage()}
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