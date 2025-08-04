// Componente principal da aplicação

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import JogosPage from './pages/JogosPage';
import DesenvolvedorasPage from './pages/DesenvolvedorasPage';
import PlataformasPage from './pages/PlataformasPage';
import GenerosPage from './pages/GenerosPage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jogos" element={<JogosPage />} />
            <Route path="/desenvolvedoras" element={<DesenvolvedorasPage />} />
            <Route path="/plataformas" element={<PlataformasPage />} />
            <Route path="/generos" element={<GenerosPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;

