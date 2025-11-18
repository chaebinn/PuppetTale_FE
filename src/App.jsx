import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Home from "./pages/Home/Home";
import "./App.css";
import './index.css'; 
import MyPage from "./pages/Home/MyPage";
import MyPageOption from "./components/MyPageOption";
import ModeSelectModal from "./components/Modal/ModeSelectModal";
import RenamePetModal from "./components/Modal/RenamePetModal";
import CreateStoryModal from "./components/Modal/CreateStoryModal";
import FairytalesPage from "./pages/Home/FairytalesPage";

function App() {
  return (
  <Routes>
      <Route path="/" element={<Home />} />     
      <Route path="/mypage" element={<MyPage/>}/>
      <Route path="/fairytales" element={<FairytalesPage/>}/>
  </Routes>  );
}

export default App;

