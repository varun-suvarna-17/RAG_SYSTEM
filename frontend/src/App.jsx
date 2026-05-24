import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import ParticlesBG from "./components/ParticlesBG";

export default function App() {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [history, setHistory] = useState([]);

  const selectQuery = (q) => {
    setSelectedQuery(q);
    setTimeout(() => setSelectedQuery(null), 150);
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Aurora ambient */}
      <div className="aurora">
        <div className="aurora-orb orb-1" />
        <div className="aurora-orb orb-2" />
        <div className="aurora-orb orb-3" />
      </div>

      {/* Particle network */}
      <ParticlesBG />

      {/* Fixed navbar */}
      <Navbar />

      {/* Body */}
      <div className="flex flex-1 pt-14 overflow-hidden" style={{ position: 'relative', zIndex: 10 }}>
        {/* Sidebar */}
        <Sidebar onSelectQuery={selectQuery} history={history} />

        {/* Chat panel */}
        <main className="flex-1 lg:pl-60 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col m-4 rounded-3xl overflow-hidden glass" style={{ boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>
            {/* Panel titlebar */}
            <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                </div>
                <span className="text-xs font-medium ml-2" style={{ color: 'var(--text-3)' }}>AI Knowledge Assistant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--emerald)', boxShadow: '0 0 5px #10b981', animation: 'pulse 2s infinite' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>Live</span>
              </div>
            </div>

            {/* Chat */}
            <ChatInterface
              initialQuery={selectedQuery}
              onQuerySent={(q) => setHistory(p => [...p, q].slice(-20))}
            />
          </div>
        </main>
      </div>
    </div>
  );
}