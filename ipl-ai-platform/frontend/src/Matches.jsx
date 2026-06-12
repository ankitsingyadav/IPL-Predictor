import React, { useEffect, useState } from "react";

const Matches = ({ mode, demoMatches, selectedMatch, setSelectedMatch }) => {
  const [matches, setMatches] = useState([]);
  const [liveMatch, setLiveMatch] = useState(null);

  useEffect(() => {
    if (mode === "demo") {
      setMatches(demoMatches || []);
      setLiveMatch(null);
      return;
    }

    // Live mode: try API
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/matches");
        const data = await res.json();

        if (data && data.length > 0) {
          setMatches(data);
          setLiveMatch(data[0]);
        } else {
          setMatches(demoMatches || []);
          setLiveMatch(null);
        }
      } catch (err) {
        console.log("Matches API unavailable, using demo data");
        setMatches(demoMatches || []);
        setLiveMatch(null);
      }
    };

    fetchMatches();
  }, [mode, demoMatches]);

  return (
    <div className="matches-section fade-in fade-in-delay-1">
      {/* Section Header */}
      <div className="section-title">
        <span className="icon">📋</span>
        {mode === "live" ? "Current Matches" : "Featured Matches"}
      </div>

      {/* Live Match Banner (only in live mode when we have a match) */}
      {mode === "live" && !liveMatch && (
        <div className="no-match-banner">
          <div className="banner-icon">📡</div>
          <h3>No Live Match Detected</h3>
          <p>Showing demo matches — switch to Demo mode for full experience</p>
        </div>
      )}

      {/* Match Cards Carousel */}
      <div className="matches-scroll">
        {matches.map((match, index) => {
          const isSelected = selectedMatch && (
            selectedMatch.id === match.id ||
            (selectedMatch.team1 === match.team1 && selectedMatch.team2 === match.team2)
          );

          return (
            <div
              key={match.id || index}
              id={`match-card-${match.id || index}`}
              className={`match-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedMatch(match)}
            >
              <div className="match-card-teams">
                {match.team1?.length > 12
                  ? match.team1.split(" ").map(w => w[0]).join("")
                  : match.team1}
                {" vs "}
                {match.team2?.length > 12
                  ? match.team2.split(" ").map(w => w[0]).join("")
                  : match.team2}
              </div>

              <div className="match-card-score">
                {match.score || match.status || "Upcoming"}
              </div>

              <div className="match-card-prob">
                <span className="fire">🔥</span>
                {match.prob || 50}% win probability
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Matches;