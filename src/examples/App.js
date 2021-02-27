import React from "react";
import { TextInput, Loader } from "../lib";

const App = () => {
  const changeHandler =  (evt) =>{
    console.log("console", evt)
  }
  return(
    <div style={{ width: 640, margin: "15px auto" }}>
        <h1>Hello React</h1>
        <TextInput onChange={changeHandler} label="Email Address" placeholder="name@example.com" />
        <Loader />
    </div>
  )
  
};

export default App;
