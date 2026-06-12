import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div style={{
      background: 'rgba(10, 14, 26, 0.95)',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(99, 102, 241, 0.1)',
      backdropFilter: 'blur(12px)',
    }}>
      <p style={{
        fontSize: '0.7rem',
        color: '#64748b',
        marginBottom: '6px',
        fontWeight: '500',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>{label}</p>
      <p style={{
        fontSize: '1.15rem',
        fontWeight: '800',
        color: '#a5b4fc',
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: '-0.02em',
      }}>
        {payload[0].value}% <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>win probability</span>
      </p>
    </div>
  );
};

const CustomDot = (props) => {
  const { cx, cy, index, dataLength } = props;
  // Only show dot on the last data point
  if (index !== dataLength - 1) return null;

  return (
    <g>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={8} fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth={2}>
        <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Inner dot */}
      <circle cx={cx} cy={cy} r={4} fill="#6366f1" stroke="#fff" strokeWidth={2} />
    </g>
  );
};

const LiveGraph = ({ data, team1, team2, team1Color }) => {
  const gradientColor = team1Color || "#6366f1";

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 16, right: 16, left: -6, bottom: 4 }}>
          <defs>
            <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientColor} stopOpacity={0.3} />
              <stop offset="40%" stopColor={gradientColor} stopOpacity={0.12} />
              <stop offset="100%" stopColor={gradientColor} stopOpacity={0.01} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="4 6"
            stroke="rgba(255,255,255,0.03)"
            vertical={false}
          />
          {/* 50% reference line */}
          <ReferenceLine
            y={50}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="8 4"
            label={{
              value: "50%",
              position: "right",
              fill: "#475569",
              fontSize: 10,
            }}
          />
          <XAxis
            dataKey="time"
            stroke="transparent"
            tick={{ fill: '#475569', fontSize: 10, fontFamily: "'Inter', sans-serif" }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={[0, 100]}
            stroke="transparent"
            tick={{ fill: '#475569', fontSize: 10, fontFamily: "'Inter', sans-serif" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${val}%`}
            tickMargin={4}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: 'rgba(99, 102, 241, 0.2)',
              strokeWidth: 1,
              strokeDasharray: '4 4',
            }}
          />
          <Area
            type="monotone"
            dataKey="prob"
            stroke={gradientColor}
            strokeWidth={2.5}
            fill="url(#probGradient)"
            dot={(dotProps) => (
              <CustomDot
                key={dotProps.index}
                {...dotProps}
                dataLength={data.length}
              />
            )}
            activeDot={{
              r: 6,
              fill: gradientColor,
              stroke: '#fff',
              strokeWidth: 2,
              filter: 'url(#glow)',
            }}
            animationDuration={600}
            animationEasing="ease-in-out"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveGraph;