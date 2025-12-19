import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Home from "./pages/Home/Home.jsx";
import Chat from "./pages/Chat/Chat.jsx";
import "./App.css";
import "./index.css";
import MyPage from "./pages/Home/MyPage";
import FairytalesPage from "./pages/Home/FairytalesPage";
import StoragePage from "./pages/Home/StoragePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/fairytales" element={<CreateFairytale />} />
      <Route path="/storage" element={<StoragePage />} />
      <Route path="/fairytale/:id" element={<FairytaleDetail />} />
    </Routes>
  );
}

export default App;
