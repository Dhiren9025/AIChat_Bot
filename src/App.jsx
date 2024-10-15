import { useState, useRef, useEffect } from "react";
import "./App.css"; // Ensure this includes the relevant CSS for hover effects
import { IoCodeSlash, IoSend } from "react-icons/io5";
import { BiPlanet } from "react-icons/bi";
import { FaPython } from "react-icons/fa";
import { TbMessageChatbot } from "react-icons/tb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
  const [message, setMessage] = useState("");
  const [isResponseScreen, setIsResponseScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [, setError] = useState("");

  const messagesEndRef = useRef(null);

  // Load messages from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
      setIsResponseScreen(true);
    }
  }, []);

  const hitRequest = () => {
    if (message.trim()) { // Check for non-empty input
      setError(""); // Clear any previous error message
      generateResponse(message);
    } else {
      setError("You must write something... !"); // Set error message to state
    }
  };
  const generateResponse = async (msg) => {
    if (!msg) return;

    const genAI = new GoogleGenerativeAI(
      "AIzaSyDXuvFwLofS4eYE_82kMsH0hRZvaFmWAh4"
    ); // Replace with your API key
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent(msg);
      let plainTextResponse = result.response
        .text()
        .replace(/\*\*(.*?)\*\*/g, "$1") // Removes double asterisks
        .replace(/\*(.*?)\*/g, "$1") // Removes single asterisks
        .replace(/##/g, "") // Removes double hash symbols
        .replace(/#/g, "") // Removes single hash symbols
        .trim();

      const newMessages = [
        ...messages,
        { type: "userMsg", text: msg },
        { type: "responseMsg", text: plainTextResponse },
      ];

      setMessages(newMessages);
      localStorage.setItem("chatMessages", JSON.stringify(newMessages)); // Save messages to localStorage
      setIsResponseScreen(true);
      setMessage("");
    } catch (error) {
      console.error("Error generating response:", error);
      alert("There was an error generating the response.");
    }
  };

  const newChat = () => {
    setIsResponseScreen(false);
    setMessages([]);
    localStorage.removeItem("chatMessages"); // Clear messages from localStorage
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      const lastMessage = messagesEndRef.current.previousElementSibling; // Get the last message element
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll to the start of the last message
      }
    }
  }, [messages]);

  return (
    <div className="container w-screen min-h-screen overflow-x-hidden bg-white text-black">
      {isResponseScreen ? (
        <div className="h-[80vh]">
          <div className="header pt-[25px] flex items-center justify-between w-[100vw] px-[300px]">
            <h2 className="text-2xl flex items-center">
              Assist
              <p
                className="inline-block text-white w-[36px] h-[35px] text-2xl flex items-center justify-center ml-1 rounded-lg shadow-lg"
                style={{ backgroundColor: "#007bff" }}
              >
                Me
              </p>
            </h2>

            <button
              id="newChatBtn"
              className="bg-white p-[10px] rounded-[30px] cursor-pointer text-[14px] px-[20px] border border-black shadow-lg transition-colors duration-300 hover:bg-[#007bff] hover:text-white hover:border-black"
              onClick={newChat}
              
            >
              New Chat
            </button>
          </div>

          <div className="messages" aria-live="polite">
            {messages?.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.type}`}
                role="alert" // For accessibility
              >
                <span className="message-text">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        <div className="middle h-[80vh] flex items-center flex-col justify-center">
          <h1 className="text-4xl flex items-center">
            Assist
            <p
              className="inline-block text-white w-[52px] h-[50px] flex items-center justify-center ml-1 rounded-lg shadow-lg transition-colors duration-300"
              style={{ backgroundColor: "#007bff" }}
            >
              Me
            </p>
          </h1>
          <div className="boxes mt-[30px] flex items-center gap-2">
            <div
              className="card rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 px-[20px] relative min-h-[20vh] p-[10px] border border-gray-300 shadow-lg"
              style={{ backgroundColor: "#F7F7F7" }} // Set card background color
              onClick={() =>
                generateResponse("What is coding? How can we learn it.")
              }
            >
              <p className="text-[18px] text-black">
                What is coding? <br />
                How can we learn it.
              </p>
              <div className="icon">
                <IoCodeSlash className="absolute right-3 bottom-3 text-[18px] text-black" />
              </div>
            </div>
            <div
              className="card rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 px-[20px] relative min-h-[20vh] p-[10px] border border-gray-300 shadow-lg"
              style={{ backgroundColor: "#F7F7F7" }} // Set card background color
              onClick={() =>
                generateResponse("Which is the red planet of the solar system?")
              }
            >
              <p className="text-[18px] text-black">
                Which is the red <br />
                planet of the solar system?
              </p>
              <div className="icon">
                <BiPlanet className="absolute right-3 bottom-3 text-[18px] text-black" />
              </div>
            </div>

            <div
              className="card rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 px-[20px] relative min-h-[20vh] p-[10px] border border-gray-300 shadow-lg"
              style={{ backgroundColor: "#F7F7F7" }} // Set card background color
              onClick={() =>
                generateResponse("In which year was Python invented?")
              }
            >
              <p className="text-[18px] text-black">
                In which year was Python <br />
                invented?
              </p>
              <div className="icon">
                <FaPython className="absolute right-3 bottom-3 text-[18px] text-black" />
              </div>
            </div>

            <div
              className="card rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 px-[20px] relative min-h-[20vh] p-[10px] border border-gray-300 shadow-lg"
              style={{ backgroundColor: "#F7F7F7" }} // Set card background color
              onClick={() =>
                generateResponse("What are some motivation quotes?")
              }
            >
              <p className="text-[18px] text-black">
                What are some <br /> motivation quotes?
              </p>
              <div className="icon">
                <TbMessageChatbot className="absolute right-3 bottom-3 text-[18px] text-black" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bottom w-[100%] flex flex-col items-center">
        <div className="inputBox w-[60%] text-[20px] py-[7px] flex items-center bg-white rounded-[30px] border border-black shadow-lg">
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                hitRequest(); // Call hitRequest when Enter is pressed
                e.preventDefault(); // Prevent default behavior to avoid form submission
              }
            }}
            type="text"
            className="p-[10px] pl-[15px] flex-1 outline-none border-none text-black"
            placeholder="Type your message here..."
            id="messageBox"
          />
          {message === "" ? (
            ""
          ) : (
            <i
              className="text-green-500 cursor-pointer text-3xl mr-3"
              onClick={hitRequest}
            >
              <IoSend />
            </i>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
