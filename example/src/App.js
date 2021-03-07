import React from "react";
import './App.css';
import {Loader, Button, TextInput, Bar, Select} from "saran-library-poc";
import "saran-library-poc/index.css";
function App() {
  const onPageSizeChanged = (evt) =>{
    console.log(evt)
  }
  return (
    <div className="App los-select">
      <Select value={10}
                  displayValue={10}
                  options={[
                    { value: 10 },
                    { value: 20 },
                    { value: 50 },
                    { value: 100 },
                  ]}
                  onChange={onPageSizeChanged} />
                
    </div>
  );
}

export default App;
