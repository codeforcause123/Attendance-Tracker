import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserForm from "./components/UserForm";
import UserData from "./components/UserData";
import Error from "./components/Error";
const App = () => {
  const [att, setAtt] = useState([]);
  const handleDataFromChild = (data) => {
    setAtt(data.transformedData);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<UserForm formLogin={handleDataFromChild} />}
        />
        <Route path="/youratt" element={<UserData att={att} />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
