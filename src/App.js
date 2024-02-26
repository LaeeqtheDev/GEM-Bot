import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
 

  const surpriseOptions = [
    'Who won the latest Nobel Prize?',
    'Where does pizza come from?',
    'How do you make babies?'
  ];

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please make a wish");
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();
      console.log(data);
      setChatHistory(oldChatHistory => [...oldChatHistory,{
        role: "user",
        parts: value
      },
    {
      role: "model",
      parts: data
    }])

    setValue("")

    } catch (error) {
      console.error(error);
      setError("Something went terribly wrong, return back to the base");
    }
  };

  const clear=()=>{
    setValue("")
    setError("")
    setChatHistory([])
  }

  return (
    <div className="app">
      <p>ABRA CA DABRAAA DOOWWW What do you want to know?
      <button className="surprise" onClick={surprise} disabled={!chatHistory}>This is my WISH</button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="Where is Santaklaus...?"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask Me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, _index)=><div key={_index}>
          <p className="answer">{chatItem.role}:{chatItem.parts}</p>
        </div>)}
      </div>
    </div>
  );
}

export default App;
