/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { Dashboard } from "@/pages/Dashboard"
import { DiseaseDetection } from "@/pages/DiseaseDetection"
import { Chatbot } from "@/pages/Chatbot"
import { Market } from "@/pages/Market"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/market" element={<Market />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Route>
      </Routes>
    </Router>
  )
}

