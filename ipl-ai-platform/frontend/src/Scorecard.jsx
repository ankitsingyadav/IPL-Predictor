import React from "react";

const Scorecard = ({ selectedMatch }) => {
  if (!selectedMatch) return null;

  const batting = selectedMatch.batting || [];
  const bowling = selectedMatch.bowling || [];

  return (
    <div className="glass-card" id="scorecard-panel">
      <div className="section-title">
        <span className="icon">🏏</span>
        Scorecard
      </div>

      {/* Batting */}
      <div className="scorecard-team-header">
        🏏 {selectedMatch.team1} — Batting
      </div>
      <div className="scorecard-team-score">
        {selectedMatch.score}
      </div>

      {batting.length > 0 ? (
        <table className="scorecard-table">
          <thead>
            <tr>
              <th>Batter</th>
              <th>R</th>
              <th>B</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            {batting.map((player, i) => (
              <tr key={i}>
                <td>{player.name}</td>
                <td style={{ fontWeight: player.runs >= 50 ? '700' : '400', color: player.runs >= 50 ? '#a5b4fc' : undefined }}>
                  {player.runs}
                </td>
                <td>{player.balls}</td>
                <td>{player.fours}</td>
                <td>{player.sixes}</td>
                <td>{player.sr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No batting data available</p>
      )}

      {/* Bowling */}
      {bowling.length > 0 && (
        <div className="bowling-section">
          <div className="scorecard-team-header">
            ⚾ {selectedMatch.team2} — Bowling
          </div>

          <table className="scorecard-table">
            <thead>
              <tr>
                <th>Bowler</th>
                <th>O</th>
                <th>M</th>
                <th>R</th>
                <th>W</th>
                <th>Econ</th>
              </tr>
            </thead>
            <tbody>
              {bowling.map((bowler, i) => (
                <tr key={i}>
                  <td>{bowler.name}</td>
                  <td>{bowler.overs}</td>
                  <td>{bowler.maidens}</td>
                  <td>{bowler.runs}</td>
                  <td style={{ fontWeight: bowler.wickets >= 2 ? '700' : '400', color: bowler.wickets >= 2 ? '#f43f5e' : undefined }}>
                    {bowler.wickets}
                  </td>
                  <td>{bowler.econ}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Scorecard;