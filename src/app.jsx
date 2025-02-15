import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Projects from "./Pages/Projects/Projects";
import Skills from "./Pages/Skills/Skills";
import Study from "./Pages/Study/Study";
import Social from "./Pages/Social/Social";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/study" element={<Study />} />
                <Route path="/social" element={<Social />} />
            </Routes>
        </>
    )

}