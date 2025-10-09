import './App.css'
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {   
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [h1Visible, seth1Visible] = useState(true);
  const [chatBox, setHideChat] = useState(false);
  const [hideReminder, setHideReminder] = useState(true);

  const enteredMessage = () =>{
    if (!message.trim()) return;
    console.log('Sending...', message);
    setMessages((prev) => [...prev, message]);
    setMessage("");
    seth1Visible(false);
    setHideChat(true);    
  }

  const reminder = () =>{
    setHideReminder(false);
  }

  return (
    <>
      <Header />
      <div className='chatWrapper'>
        
          {h1Visible && <div className="initialChatBody"> <h1>Welcome To Your Mind</h1> </div>}
          {chatBox && 
            <div className='chatbox'>

              {hideReminder && <p id="reminder">Remember, no one will reply to you in this chat. Its purely a space for your thoughts. <i onClick={(e) => reminder()} className='fa-solid fa-times'></i></p>}
                <div className='sentMessages'>
                  {messages.map((msg, i) => (
                    <div key={i} className="sentMessage">{msg}</div>
                  ))}
                </div>
          </div>
          }   
        <div className="sendWrapper">          
            <div className="select">
              <div className="icons"><i className="fa-solid fa-paperclip"></i></div>    
            </div>
            <input 
            id='messageInput' 
            name="chatInput" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && enteredMessage()} 
            placeholder="A Penny For Your Thoughts?"
            />
            <button onClick={enteredMessage} id="sendChat" className="send">
              <i className="fa-solid fa-paper-plane-top"></i>
            </button>
        </div>
      </div>   
      <Footer />
    </>
  )
}

export default App
