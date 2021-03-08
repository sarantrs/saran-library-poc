import React from "react";
import './App.css';
import {Loader, Button, TextInput, Bar, Select} from "saran-library-poc";
import "saran-library-poc/index.css";
function App() {
  
  return (
    <div className="App los-select">
      <Select value={10}
                  displayValue={10}
                  options={[
                    { value: 10 },
                    { value: 20 },
                    { value: 50 },
                    { value: 100 },
                  ]} />
                
    </div>
  );
}

export default App;
