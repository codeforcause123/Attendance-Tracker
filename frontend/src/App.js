import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserForm from "./components/UserForm";
import UserData from "./components/UserData";
import Error from "./components/Error";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
const App = () => {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/youratt" element={<UserData />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </AnimatePresence>
      <Analytics />
    </BrowserRouter>
  );
};

export default App;
