import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import LiveGraph from "./LiveGraph";
import Matches from "./Matches";
import Scorecard from "./Scorecard";
import "./App.css";

/* ══════════ IPL Team Data ══════════ */
const TEAM_COLORS = {
  "CSK": "#f5c518",
  "Chennai Super Kings": "#f5c518",
  "MI": "#004ba0",
  "Mumbai Indians": "#004ba0",
  "RCB": "#ec1c24",
  "Royal Challengers Bangalore": "#ec1c24",
  "Royal Challengers Bengaluru": "#ec1c24",
  "KKR": "#3a225d",
  "Kolkata Knight Riders": "#3a225d",
  "DC": "#004c93",
  "Delhi Capitals": "#004c93",
  "RR": "#ea1a85",
  "Rajasthan Royals": "#ea1a85",
  "SRH": "#ff822a",
  "Sunrisers Hyderabad": "#ff822a",
  "PBKS": "#ed1b24",
  "Punjab Kings": "#ed1b24",
  "GT": "#1c1c2b",
  "Gujarat Titans": "#1c1c2b",
  "LSG": "#a4d7f4",
  "Lucknow Super Giants": "#a4d7f4",
};

const TEAM_ABBR = {
  "Chennai Super Kings": "CSK",
  "Mumbai Indians": "MI",
  "Royal Challengers Bangalore": "RCB",
  "Royal Challengers Bengaluru": "RCB",
  "Kolkata Knight Riders": "KKR",
  "Delhi Capitals": "DC",
  "Rajasthan Royals": "RR",
  "Sunrisers Hyderabad": "SRH",
  "Punjab Kings": "PBKS",
  "Gujarat Titans": "GT",
  "Lucknow Super Giants": "LSG",
};

const TEAM_LOGOS = {
  "CSK": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313418.logo.png",
  "Chennai Super Kings": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313418.logo.png",
  "MI": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313419.logo.png",
  "Mumbai Indians": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313419.logo.png",
  "RCB": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313411.logo.png",
  "Royal Challengers Bangalore": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313411.logo.png",
  "Royal Challengers Bengaluru": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313411.logo.png",
  "KKR": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313412.logo.png",
  "Kolkata Knight Riders": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313412.logo.png",
  "DC": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313422.logo.png",
  "Delhi Capitals": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313422.logo.png",
  "RR": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313423.logo.png",
  "Rajasthan Royals": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313423.logo.png",
  "SRH": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313480.logo.png",
  "Sunrisers Hyderabad": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313480.logo.png",
  "PBKS": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313414.logo.png",
  "Punjab Kings": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313414.logo.png",
  "GT": "https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg",
  "Gujarat Titans": "https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg",
  "LSG": "https://upload.wikimedia.org/wikipedia/en/a/a9/Lucknow_Super_Giants_IPL_Logo.svg",
  "Lucknow Super Giants": "https://upload.wikimedia.org/wikipedia/en/a/a9/Lucknow_Super_Giants_IPL_Logo.svg",
};

/* ══════════ Demo Data ══════════ */
const DEMO_MATCHES = [
  {
    id: 1,
    team1: "Chennai Super Kings",
    team2: "Mumbai Indians",
    score: "152/3 (16.4 ov)",
    prob: 68,
    batting: [
      { name: "Ruturaj Gaikwad", runs: 52, balls: 34, fours: 6, sixes: 2, sr: "152.94" },
      { name: "MS Dhoni", runs: 45, balls: 28, fours: 3, sixes: 3, sr: "160.71" },
      { name: "Devon Conway", runs: 32, balls: 24, fours: 4, sixes: 0, sr: "133.33" },
      { name: "Shivam Dube", runs: 18, balls: 12, fours: 1, sixes: 1, sr: "150.00" },
    ],
    bowling: [
      { name: "Jasprit Bumrah", overs: "4", maidens: 1, runs: 22, wickets: 2, econ: "5.50" },
      { name: "Hardik Pandya", overs: "3", maidens: 0, runs: 28, wickets: 0, econ: "9.33" },
      { name: "Piyush Chawla", overs: "3.4", maidens: 0, runs: 35, wickets: 1, econ: "9.55" },
    ],
    commentary: [
      { over: "16.4", text: "Dhoni smashes it over long-on for a MASSIVE SIX! 🔥", type: "six" },
      { over: "16.3", text: "Good length outside off, pushed to cover for a single", type: "normal" },
      { over: "16.2", text: "DROPPED! Rohit puts down a sitter at mid-off", type: "normal" },
      { over: "16.1", text: "Dube flicks it through mid-wicket for FOUR!", type: "boundary" },
      { over: "15.6", text: "WICKET! Conway caught at deep square leg by Surya", type: "wicket" },
      { over: "15.5", text: "Short ball, pulled away for two runs", type: "normal" },
      { over: "15.4", text: "Slower ball, mistimed but safe", type: "normal" },
      { over: "15.3", text: "Full toss driven through covers for FOUR! 💥", type: "boundary" },
    ],
    stats: {
      totalRuns: 152, wickets: 3, overs: "16.4",
      runRate: "9.12", highestScore: "52 (Gaikwad)",
      fours: 14, sixes: 6, extras: 5,
      dotBalls: 34, boundaryPercentage: "43%"
    }
  },
  {
    id: 2,
    team1: "Royal Challengers Bangalore",
    team2: "Kolkata Knight Riders",
    score: "180/6 (18.2 ov)",
    prob: 55,
    batting: [
      { name: "Virat Kohli", runs: 73, balls: 46, fours: 8, sixes: 2, sr: "158.70" },
      { name: "Faf du Plessis", runs: 42, balls: 30, fours: 5, sixes: 1, sr: "140.00" },
      { name: "Glenn Maxwell", runs: 38, balls: 18, fours: 2, sixes: 4, sr: "211.11" },
      { name: "Dinesh Karthik", runs: 15, balls: 10, fours: 1, sixes: 1, sr: "150.00" },
    ],
    bowling: [
      { name: "Sunil Narine", overs: "4", maidens: 0, runs: 24, wickets: 1, econ: "6.00" },
      { name: "Andre Russell", overs: "3.2", maidens: 0, runs: 38, wickets: 2, econ: "11.40" },
      { name: "Varun Chakravarthy", overs: "4", maidens: 0, runs: 32, wickets: 2, econ: "8.00" },
    ],
    commentary: [
      { over: "18.2", text: "Maxwell LAUNCHES it into the stands! SIX! 🚀", type: "six" },
      { over: "18.1", text: "WICKET! Kohli edges one to the keeper off Russell", type: "wicket" },
      { over: "17.6", text: "Kohli drives through extra cover for FOUR!", type: "boundary" },
      { over: "17.5", text: "Dot ball. Tight from Narine", type: "normal" },
      { over: "17.4", text: "Quick single taken, good running between the wickets", type: "normal" },
      { over: "17.3", text: "FOUR! Kohli lofts it over mid-on beautifully!", type: "boundary" },
    ],
    stats: {
      totalRuns: 180, wickets: 6, overs: "18.2",
      runRate: "9.82", highestScore: "73 (Kohli)",
      fours: 16, sixes: 8, extras: 12,
      dotBalls: 28, boundaryPercentage: "51%"
    }
  },
  {
    id: 3,
    team1: "Rajasthan Royals",
    team2: "Delhi Capitals",
    score: "195/4 (20 ov)",
    prob: 72,
    batting: [
      { name: "Yashasvi Jaiswal", runs: 85, balls: 50, fours: 10, sixes: 3, sr: "170.00" },
      { name: "Sanju Samson", runs: 54, balls: 32, fours: 4, sixes: 3, sr: "168.75" },
      { name: "Shimron Hetmyer", runs: 32, balls: 16, fours: 2, sixes: 3, sr: "200.00" },
      { name: "Jos Buttler", runs: 18, balls: 14, fours: 2, sixes: 0, sr: "128.57" },
    ],
    bowling: [
      { name: "Anrich Nortje", overs: "4", maidens: 0, runs: 42, wickets: 1, econ: "10.50" },
      { name: "Axar Patel", overs: "4", maidens: 0, runs: 35, wickets: 2, econ: "8.75" },
      { name: "Kuldeep Yadav", overs: "4", maidens: 0, runs: 38, wickets: 1, econ: "9.50" },
    ],
    commentary: [
      { over: "20.0", text: "FOUR! Hetmyer finishes in style through covers!", type: "boundary" },
      { over: "19.5", text: "SIX! Hetmyer smashes it over cow corner! 💥", type: "six" },
      { over: "19.4", text: "Single taken, Samson rotates strike", type: "normal" },
    ],
    stats: {
      totalRuns: 195, wickets: 4, overs: "20",
      runRate: "9.75", highestScore: "85 (Jaiswal)",
      fours: 18, sixes: 9, extras: 6,
      dotBalls: 30, boundaryPercentage: "49%"
    }
  },
  {
    id: 4,
    team1: "Gujarat Titans",
    team2: "Lucknow Super Giants",
    score: "168/5 (19.1 ov)",
    prob: 61,
    batting: [
      { name: "Shubman Gill", runs: 62, balls: 42, fours: 7, sixes: 1, sr: "147.62" },
      { name: "David Miller", runs: 48, balls: 28, fours: 3, sixes: 3, sr: "171.43" },
      { name: "Rashid Khan", runs: 28, balls: 14, fours: 1, sixes: 3, sr: "200.00" },
      { name: "Sai Sudharsan", runs: 22, balls: 18, fours: 2, sixes: 0, sr: "122.22" },
    ],
    bowling: [
      { name: "Mark Wood", overs: "4", maidens: 1, runs: 28, wickets: 2, econ: "7.00" },
      { name: "Ravi Bishnoi", overs: "4", maidens: 0, runs: 30, wickets: 2, econ: "7.50" },
      { name: "Krunal Pandya", overs: "3.1", maidens: 0, runs: 34, wickets: 1, econ: "10.74" },
    ],
    commentary: [
      { over: "19.1", text: "Rashid Khan slams it for SIX! Unstoppable! 🚀", type: "six" },
      { over: "19.0", text: "FOUR! Miller drives it through mid-off gap!", type: "boundary" },
    ],
    stats: {
      totalRuns: 168, wickets: 5, overs: "19.1",
      runRate: "8.77", highestScore: "62 (Gill)",
      fours: 13, sixes: 7, extras: 8,
      dotBalls: 38, boundaryPercentage: "39%"
    }
  }
];

function App() {
  const [mode, setMode] = useState("demo");
  const [hasMatch, setHasMatch] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(DEMO_MATCHES[0]);
  const [activeTab, setActiveTab] = useState("scorecard");
  const [graphData, setGraphData] = useState([]);
  const [teams, setTeams] = useState(DEMO_MATCHES[0].team1 && [DEMO_MATCHES[0].team1, DEMO_MATCHES[0].team2]);
  const [score, setScore] = useState(DEMO_MATCHES[0].score);
  const [prob, setProb] = useState(DEMO_MATCHES[0].prob);

  /* ══════════ Data Fetching ══════════ */
  const fetchData = useCallback(async () => {
    if (mode === "demo") {
      const match = selectedMatch || DEMO_MATCHES[0];
      setHasMatch(true);
      setTeams([match.team1, match.team2]);
      setScore(match.score);
      setProb(match.prob);
      setGraphData(prev => [
        ...prev.slice(-15),
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), prob: match.prob + Math.floor(Math.random() * 6 - 3) }
      ]);
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/matches");
      if (res.data && res.data.length > 0) {
        const match = res.data[0];
        setHasMatch(true);
        setTeams([match.team1, match.team2]);
        setScore(match.score);
        setProb(match.prob || 65);
        setGraphData(prev => [
          ...prev.slice(-15),
          { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), prob: match.prob || 65 }
        ]);
      } else {
        setHasMatch(false);
        setTeams([]);
        setScore("No live match");
        setGraphData([]);
      }
    } catch (err) {
      console.log("API not reachable:", err.message);
      setHasMatch(false);
      setTeams([]);
      setScore("Backend offline");
    }
  }, [mode, selectedMatch]);

  useEffect(() => {
    setGraphData([]); // reset graph on mode/match change
    fetchData();
  }, [fetchData]);

  // Auto-refresh in demo mode to simulate live data
  useEffect(() => {
    if (mode === "demo" && hasMatch) {
      const interval = setInterval(() => {
        fetchData();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [mode, hasMatch, fetchData]);

  /* ══════════ Helper ══════════ */
  const getTeamColor = (team) => TEAM_COLORS[team] || "#6366f1";
  const getTeamAbbr = (team) => TEAM_ABBR[team] || team;
  const getTeamLogo = (team) => TEAM_LOGOS[team] || null;
  const winningTeam = prob >= 50 ? teams[0] : teams[1];

  /* ══════════ Render ══════════ */
  return (
    <div className="app-container">

      {/* ═══════════ HEADER ═══════════ */}
      <header className="header fade-in">
        <div className="header-inner">
          <span className="header-icon">🏏</span>
          <div>
            <h1>IPL Predictor</h1>
            <p className="header-subtitle">AI-Powered Match Analysis</p>
          </div>
        </div>
      </header>

      {/* ═══════════ MODE TOGGLE ═══════════ */}
      <div className="mode-toggle fade-in fade-in-delay-1">
        <button
          id="mode-live-btn"
          className={`mode-btn ${mode === "live" ? "active" : ""}`}
          onClick={() => { setMode("live"); setSelectedMatch(null); }}
        >
          <span className={`mode-dot ${mode === "live" ? "live" : ""}`}></span>
          Live
        </button>
        <button
          id="mode-demo-btn"
          className={`mode-btn ${mode === "demo" ? "active" : ""}`}
          onClick={() => { setMode("demo"); setSelectedMatch(DEMO_MATCHES[0]); }}
        >
          <span className={`mode-dot ${mode === "demo" ? "demo" : ""}`}></span>
          Demo
        </button>
      </div>

      {/* ═══════════ MATCHES CAROUSEL ═══════════ */}
      <Matches
        mode={mode}
        demoMatches={DEMO_MATCHES}
        selectedMatch={selectedMatch}
        setSelectedMatch={setSelectedMatch}
      />

      {/* ═══════════ MAIN PREDICTION CARD ═══════════ */}
      <div className="glass-card fade-in fade-in-delay-2" id="prediction-card">
        <span className={`status-badge ${mode === "demo" ? "demo" : "live"}`}>
          <span className="pulse-dot"></span>
          {mode === "demo" ? "Demo Mode" : "Live"}
        </span>

        {!hasMatch ? (
          <div className="no-match-main">
            <div className="big-icon">📡</div>
            <h2>No Live Match Available</h2>
            <p>Switch to Demo mode to explore predictions</p>
          </div>
        ) : (
          <>
            {/* Teams */}
            <div className="teams-display">
              <div className="team-block">
                <div className="team-logo-wrapper" style={{ borderColor: `${getTeamColor(teams[0])}40` }}>
                  {getTeamLogo(teams[0]) ? (
                    <img src={getTeamLogo(teams[0])} alt={teams[0]} className="team-logo-img" onError={(e) => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/en/4/41/IPL_Logo.svg'; }} />
                  ) : (
                    <span className="team-logo-placeholder">🏏</span>
                  )}
                </div>
                <span className="team-name">{teams[0]}</span>
              </div>

              <div className="vs-badge">VS</div>

              <div className="team-block">
                <div className="team-logo-wrapper" style={{ borderColor: `${getTeamColor(teams[1])}40` }}>
                  {getTeamLogo(teams[1]) ? (
                    <img src={getTeamLogo(teams[1])} alt={teams[1]} className="team-logo-img" onError={(e) => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/en/4/41/IPL_Logo.svg'; }} />
                  ) : (
                    <span className="team-logo-placeholder">🏏</span>
                  )}
                </div>
                <span className="team-name">{teams[1]}</span>
              </div>
            </div>

            {/* Score */}
            <div className="score-display">
              <div className="score-value">{score}</div>
              <div className="ai-prediction">
                <span className="ai-icon">🤖</span>
                <span className="ai-text">
                  AI Prediction: <span className="ai-team">{getTeamAbbr(winningTeam)}</span> favored to win
                </span>
              </div>
            </div>

            {/* Probability Bar */}
            <div className="probability-section">
              <div className="prob-header">
                <div className="prob-team-info">
                  <div className="mini-logo">
                    {getTeamLogo(teams[0]) ? (
                      <img src={getTeamLogo(teams[0])} alt={teams[0]} onError={(e) => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/en/4/41/IPL_Logo.svg'; }} />
                    ) : (
                      <span className="mini-logo-placeholder">🏏</span>
                    )}
                  </div>
                  <span className="prob-team-name">{getTeamAbbr(teams[0])}</span>
                  <span className="prob-value" style={{ color: getTeamColor(teams[0]) }}>{prob}%</span>
                </div>
                <div className="prob-team-info">
                  <span className="prob-value" style={{ color: getTeamColor(teams[1]) }}>{100 - prob}%</span>
                  <span className="prob-team-name">{getTeamAbbr(teams[1])}</span>
                  <div className="mini-logo">
                    {getTeamLogo(teams[1]) ? (
                      <img src={getTeamLogo(teams[1])} alt={teams[1]} onError={(e) => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/en/4/41/IPL_Logo.svg'; }} />
                    ) : (
                      <span className="mini-logo-placeholder">🏏</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="prob-bar-container">
                <div
                  className="prob-fill-left"
                  style={{
                    width: `${prob}%`,
                    background: `linear-gradient(90deg, ${getTeamColor(teams[0])}, ${getTeamColor(teams[0])}cc)`
                  }}
                />
                <div
                  className="prob-fill-right"
                  style={{
                    background: `linear-gradient(90deg, ${getTeamColor(teams[1])}cc, ${getTeamColor(teams[1])})`
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══════════ GRAPH ═══════════ */}
      <div className="glass-card fade-in fade-in-delay-3" id="graph-card">
        <div className="section-title">
          <span className="icon">📈</span>
          Win Probability Trend
        </div>
        {hasMatch && graphData.length > 0 ? (
          <LiveGraph
            data={graphData}
            team1={teams[0]}
            team2={teams[1]}
            team1Color={getTeamColor(teams[0])}
          />
        ) : (
          <div className="chart-no-data">
            <p>📊 Probability data will appear here during the match</p>
          </div>
        )}
      </div>

      {/* ═══════════ DETAIL TABS ═══════════ */}
      {hasMatch && (
        <div className="fade-in fade-in-delay-4">
          <div className="tabs-container" id="detail-tabs">
            <button
              id="tab-scorecard"
              className={`tab-btn ${activeTab === "scorecard" ? "active" : ""}`}
              onClick={() => setActiveTab("scorecard")}
            >
              🏏 Scorecard
            </button>
            <button
              id="tab-commentary"
              className={`tab-btn ${activeTab === "commentary" ? "active" : ""}`}
              onClick={() => setActiveTab("commentary")}
            >
              💬 Commentary
            </button>
            <button
              id="tab-stats"
              className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              📊 Stats
            </button>
          </div>

          {activeTab === "scorecard" && (
            <Scorecard selectedMatch={selectedMatch || DEMO_MATCHES[0]} />
          )}

          {activeTab === "commentary" && (
            <div className="glass-card" id="commentary-panel">
              <div className="section-title">
                <span className="icon">💬</span>
                Live Commentary
              </div>
              <div className="commentary-list">
                {(selectedMatch || DEMO_MATCHES[0]).commentary.map((item, i) => (
                  <div key={i} className={`commentary-item ${item.type}`}>
                    <span className="commentary-over">{item.over}</span>
                    <span className="commentary-text" dangerouslySetInnerHTML={{ __html: item.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "stats" && (() => {
            const stats = (selectedMatch || DEMO_MATCHES[0]).stats;
            return (
              <div className="glass-card" id="stats-panel">
                <div className="section-title">
                  <span className="icon">📊</span>
                  Match Statistics
                </div>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🏏</div>
                    <div className="stat-value">{stats.totalRuns}/{stats.wickets}</div>
                    <div className="stat-label">Total Score</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-value">{stats.runRate}</div>
                    <div className="stat-label">Run Rate</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-value">{stats.overs}</div>
                    <div className="stat-label">Overs</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value" style={{ fontSize: '1rem' }}>{stats.highestScore}</div>
                    <div className="stat-label">Top Scorer</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">4️⃣</div>
                    <div className="stat-value">{stats.fours}</div>
                    <div className="stat-label">Fours</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">6️⃣</div>
                    <div className="stat-value">{stats.sixes}</div>
                    <div className="stat-label">Sixes</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⚪</div>
                    <div className="stat-value">{stats.dotBalls}</div>
                    <div className="stat-label">Dot Balls</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💥</div>
                    <div className="stat-value">{stats.boundaryPercentage}</div>
                    <div className="stat-label">Boundary %</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default App;