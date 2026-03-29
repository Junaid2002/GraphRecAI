import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    active: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8-8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    active: false,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    label: "Users",
    active: false,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zM5.5 16c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5H5.5z" />
      </svg>
    ),
  },
  {
    label: "Content",
    active: false,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    active: false,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ total_users: 0, total_content: 0, total_interactions: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counters, setCounters] = useState({ total_users: 0, total_content: 0, total_interactions: 0 });

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    API.get("/api/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  useEffect(() => {
    const keys = ["total_users", "total_content", "total_interactions"];
    keys.forEach((key) => {
      const target = data[key];
      if (!target) return;
      let start = 0;
      const duration = 1200;
      const step = Math.ceil(target / (duration / 16));
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setCounters((prev) => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounters((prev) => ({ ...prev, [key]: start }));
        }
      }, 16);
      return () => clearInterval(timer);
    });
  }, [data]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const chartData = [
    { name: "Users", value: data.total_users },
    { name: "Content", value: data.total_content },
    { name: "Interactions", value: data.total_interactions },
  ];

  const areaData = [
    { name: "Mon", users: Math.floor(data.total_users * 0.12) },
    { name: "Tue", users: Math.floor(data.total_users * 0.19) },
    { name: "Wed", users: Math.floor(data.total_users * 0.15) },
    { name: "Thu", users: Math.floor(data.total_users * 0.23) },
    { name: "Fri", users: Math.floor(data.total_users * 0.28) },
    { name: "Sat", users: Math.floor(data.total_users * 0.34) },
    { name: "Sun", users: Math.floor(data.total_users * 0.42) },
  ];

  const statCards = [
    {
      title: "Total Users",
      value: counters.total_users,
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zM5.5 16c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5H5.5z" />
        </svg>
      ),
      color: "card-blue",
      delta: "+12.4%",
    },
    {
      title: "Total Content",
      value: counters.total_content,
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      ),
      color: "card-purple",
      delta: "+8.1%",
    },
    {
      title: "Interactions",
      value: counters.total_interactions,
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
      color: "card-teal",
      delta: "+24.7%",
    },
  ];

  return (
    <div className="dash-layout">
      <div className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
              <path d="M12 20 Q20 8 28 20 Q20 32 12 20Z" fill="currentColor" opacity="0.9" />
              <circle cx="20" cy="20" r="3" fill="white" />
            </svg>
          </div>
          <span>GraphRecAI</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className={`sidebar-nav-item ${item.active ? "active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.active && <span className="nav-active-dot" />}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{name}</span>
            <span className="sidebar-user-email">{email}</span>
          </div>
        </div>
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="dash-main">
        <header className="dash-navbar">
          <div className="navbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span /><span /><span />
            </button>
            <div className="navbar-title">
              <span className="navbar-greeting">Good day,</span>
              <span className="navbar-name">{name}</span>
            </div>
          </div>
          <div className="navbar-right">
            <div className="navbar-pulse">
              <span className="pulse-dot" />
              <span>Live</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h7a1 1 0 100-2H4V5h6a1 1 0 100-2H3zm10.293 4.293a1 1 0 011.414 0L17 9.586V9a1 1 0 112 0v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        <div className="dash-content">
          <div className="dash-section-label">OVERVIEW</div>

          <div className="stat-cards">
            {statCards.map((card, i) => (
              <div key={card.title} className={`stat-card ${card.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-card-top">
                  <div className="stat-icon">{card.icon}</div>
                  <span className="stat-delta">{card.delta}</span>
                </div>
                <div className="stat-value">{card.value.toLocaleString()}</div>
                <div className="stat-title">{card.title}</div>
                <div className="stat-card-glow" />
              </div>
            ))}
          </div>

          <div className="charts-grid">
            <div className="chart-card chart-main">
              <div className="chart-card-header">
                <div>
                  <div className="chart-card-title">Activity Overview</div>
                  <div className="chart-card-subtitle">Users vs Content vs Interactions</div>
                </div>
                <div className="chart-legend">
                  <span className="legend-dot" style={{ background: "var(--accent)" }} />
                  <span>Metrics</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} barSize={36}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6c63ff" />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#7a7a8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#7a7a8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(108,99,255,0.08)" }} />
                  <Bar dataKey="value" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card chart-area">
              <div className="chart-card-header">
                <div>
                  <div className="chart-card-title">User Trend</div>
                  <div className="chart-card-subtitle">Weekly activity</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity="0.3" />
                      <stop offset="95%" stopColor="#34d399" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#7a7a8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#7a7a8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="users" stroke="#34d399" strokeWidth={2} fill="url(#areaGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-avatar-ring" />
            </div>
            <div className="profile-info">
              <div className="profile-name">{name}</div>
              <div className="profile-email">{email}</div>
              <div className="profile-badge">Administrator</div>
            </div>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">{data.total_users}</span>
                <span className="profile-stat-label">Users</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="profile-stat-value">{data.total_content}</span>
                <span className="profile-stat-label">Content</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="profile-stat-value">{data.total_interactions}</span>
                <span className="profile-stat-label">Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
