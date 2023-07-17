import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserForm from "./components/UserForm";
import UserData from "./components/UserData";
import Error from "./components/Error";
import { AnimatePresence } from "framer-motion";
const App = () => {
  const [att, setAtt] = useState([]);
  const handleDataFromChild = (data) => {
    setAtt(data.transformedData);
  };
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={<UserForm formLogin={handleDataFromChild} />}
          />
          <Route path="/youratt" element={<UserData att={att} />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
};

export default App;
