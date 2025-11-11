import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";

const MainPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  const [hackathons, setHackathons] = useState([]);
  const API = process.env.REACT_APP_API_URL;
  useEffect(() => {
    if (!userId) return;
    const fetchHackathons = async () => {
      const response = await fetch(`${API}/api/user/${userId}/hackathons`);
      const data = await response.json();
      setHackathons(data || []);
    };
    fetchHackathons();
  }, [userId]);

// Same logic used in HackathonTracker
const getStatus = (deadline) => {
  if (!deadline) return "Upcoming";
  const deadlineDate = new Date(deadline);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (deadlineDate < now) return "Completed";

  const sixtyDays = 60 * 24 * 60 * 60 * 1000;
  if (deadlineDate.getTime() - now.getTime() < sixtyDays) return "Ongoing";

  return "Upcoming";
};

// Stats (Participated / Ongoing / Upcoming / Completed)
const participated = hackathons.length;
const ongoing = hackathons.filter(h => getStatus(h.deadline) === "Ongoing").length;
const upcoming = hackathons.filter(h => getStatus(h.deadline) === "Upcoming").length;
const completed = hackathons.filter(h => getStatus(h.deadline) === "Completed").length;


  // ✅ 1. Pie chart data
  const pieData = [
  { name: "Participated", value: participated },
  { name: "Ongoing", value: ongoing },
  { name: "Upcoming", value: upcoming },
  { name: "Completed", value: completed },
];

// Order: blue, yellow, green, red
const colors = ["#3B82F6", "#FACC15", "#22C55E", "#EF4444"];


  // ✅ 2. Bar chart data – hackathons by deadline month
  const monthlyData = hackathons.reduce((acc, h) => {
    const month = new Date(h.deadline).toLocaleString("en-US", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthChartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    count,
  }));

  // ✅ 3. Line chart – number of hackathons added over time
  // ✅ Line Chart: Calculate hackathons added over timeline
  const lineChartData = hackathons
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // sort by added date
    .map((h, idx) => ({
      date: new Date(h.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: idx + 1,  // cumulative hackathons added
    }));


  // ✅ 4. Radar chart – count domains
  const domainCount = {};
  hackathons.forEach(h => {
    h.domains.forEach(d => {
      domainCount[d] = (domainCount[d] || 0) + 1;
    });
  });

  const radarData = Object.keys(domainCount).map((domain) => ({
    domain,
    count: domainCount[domain]
  }));

  return (
    <div className="p-6 min-h-screen bg-gray-100">

      <h1 className="text-7xl text-blue-800 font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

  {/* Participated */}
  <div className="group bg-white rounded-2xl border border-gray-200 shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-blue-200/20"></div>
    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
      🚀 Participated
    </h2>
    <p className="text-5xl font-extrabold text-blue-600 mt-3">{participated}</p>
  </div>

  {/* Ongoing */}
  <div className="group bg-white rounded-2xl border border-gray-200 shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-yellow-200/20"></div>
    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
      🔥 Ongoing
    </h2>
    <p className="text-5xl font-extrabold text-yellow-500 mt-3">{ongoing}</p>
  </div>

  {/* Upcoming */}
  <div className="group bg-white rounded-2xl border border-gray-200 shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-green-200/20"></div>
    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
      ⏳ Upcoming
    </h2>
    <p className="text-5xl font-extrabold text-green-600 mt-3">{upcoming}</p>
  </div>

  {/* Completed */}
  <div className="group bg-white rounded-2xl border border-gray-200 shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-red-200/20"></div>
    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
      ✅ Completed
    </h2>
    <p className="text-5xl font-extrabold text-red-600 mt-3">{completed}</p>
  </div>

</div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="font-semibold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={4}
                label
              >

                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={colors[idx]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="font-semibold mb-4">Hackathons by Month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthChartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                radius={[10, 10, 0, 0]}
                fill="url(#colorGradient)"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>
              </defs>

            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="font-semibold mb-4">Hackathons Growth</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>


        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="font-semibold mb-4">Domains Covered</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="domain" />
              <Radar name="Domains" dataKey="count" stroke="#6366F1" fill="#818CF8" fillOpacity={0.5} />

              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
};

export default MainPage;
