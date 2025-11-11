import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// Helper to convert date strings like "21 Oct 25" into "YYYY-MM-DD"
const parseDateString = (dateStr) => {
  const monthMap = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
  const parts = dateStr.trim().split(/\s+/);

  if (parts.length < 3) return null;

  const day = parseInt(parts[0]);
  const month = monthMap[parts[1].substring(0, 3)];
  let year = 2000 + parseInt(parts[2]);

  if (isNaN(day) || month === undefined || isNaN(year)) return null;

  const date = new Date(year, month, day);

  // Simple validation to ensure the date created is close to the input
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date.toISOString().split('T')[0];
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getStatus = (deadline) => {
  if (!deadline) return 'Upcoming';
  const deadlineDate = new Date(deadline);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (deadlineDate < now) {
    return 'Completed';
  }
  // Check if the deadline is within the next 60 days
  const sixtyDays = 60 * 24 * 60 * 60 * 1000;
  if (deadlineDate.getTime() - now.getTime() < sixtyDays) {
    return 'Ongoing';
  }
  return 'Upcoming';
};

// --- Helper Components ---

const Modal = ({ isOpen, onClose, children }) => {
  const modalClass = isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none';
  const contentClass = isOpen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-5';

  return (
    <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 transition-all duration-300 ${modalClass}`}>
      <div className="flex items-center justify-center min-h-screen p-4" onClick={onClose}>
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl transition-transform duration-300 ${contentClass}
              p-8 mx-auto`}
          onClick={e => e.stopPropagation()}
        >
          <div className="max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddHackathonModal = ({ isOpen, onClose, addHackathon }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id || storedUser?.id; // <-- handle both
  console.log("userId being sent:", userId);


  const [rawDetails, setRawDetails] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleAddHackathon = useCallback(async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!rawDetails.trim()) {
      setMessage('Please paste event details.');
      setMessageType('error');
      return;
    }
    const API = process.env.REACT_APP_API_URL;
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id || storedUser?.id; // ✅ unified check
      console.log("Sending userId to backend:", userId);

      const response = await fetch(`${API}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawDetails, userId })
      });

      const result = await response.json();
      console.log("✅ Received from backend:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      const newHackathon = {
        ...result,
        id: `backend-${Date.now()}`,
      };

      addHackathon(newHackathon);

      setMessage(`✅ Added: "${newHackathon.hackName}" (from backend parsing)`);
      setMessageType('success');
      setRawDetails('');

      setTimeout(onClose, 1500);

    } catch (error) {
      console.log("❌ Backend parse error:", error);
      setMessage("❌ Backend failed to parse. Check terminal.");
      setMessageType('error');
    }
  }, [rawDetails, addHackathon, onClose]);


  const messageClasses = messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 sm:p-8 space-y-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-2">
          <h3 className="text-2xl font-bold text-base-blue">✨ Add Hackathon (Smart Paste)</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none cursor-pointer transition-colors">×</button>
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-sm font-medium ${messageClasses}`}>
            {message}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleAddHackathon} className="space-y-4">
          <p className="text-sm text-gray-600 italic">
            Paste the full event details (like from Unstop or Devfolio) below. The system will attempt to extract the name, dates, stages, and prize details using client-side logic.
          </p>

          {/* Raw Details Textarea */}
          <div>
            <label htmlFor="rawDetails" className="block text-sm font-medium text-gray-700 mb-1">Paste Event Details Here</label>
            <textarea
              id="rawDetails"
              name="rawDetails"
              rows="10"
              required
              value={rawDetails}
              onChange={(e) => setRawDetails(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:ring-accent-blue focus:border-accent-blue transition-all"
              placeholder="e.g., Datathon Modern Institute of Technology... Stages & Timeline... Prizes worth..."
            ></textarea>
          </div>

          {/* Save Hackathon Button */}
          <button type="submit" className="w-full gradient-btn mt-6">
            Parse & Add Hackathon
          </button>
        </form>
      </div>
    </Modal>
  );
};

const DetailModal = ({ isOpen, onClose, hackathon }) => {
  if (!hackathon) return null;

  const status = getStatus(hackathon.deadline);
  const statusColor = status === 'Upcoming' ? 'bg-green-100 text-green-700' :
    status === 'Ongoing' ? 'bg-yellow-100 text-yellow-700' :
      'bg-red-100 text-red-700';

  const tagHTML = hackathon.domains.map(tag => (
    <span key={tag} className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium shadow-sm">{tag}</span>
  ));

  const stagesHTML = hackathon.stages && hackathon.stages.length > 0 ? (
    <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-xl overflow-hidden">
      <thead className="bg-accent-blue">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Stage Name</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Start Date</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">End Date</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {hackathon.stages.map((stage, index) => (
          <tr key={index}>
            <td className="px-4 py-3 text-sm font-medium text-gray-800">{stage.name}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(stage.start)}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(stage.end)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : <p className="text-gray-500 italic">No detailed stages defined.</p>;

  const prizePoolDisplay = hackathon.prizePool && hackathon.prizePool !== 'Not Specified' ? `₹${hackathon.prizePool}` : 'Not Specified';

  const rewardsHTML = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 bg-soft-gray rounded-xl border-l-4 border-yellow-500">
        <p className="font-medium text-gray-500 text-sm">Prize Pool</p>
        <p className="text-xl font-extrabold text-gray-800">{prizePoolDisplay}</p>
      </div>
      <div className="p-4 bg-soft-gray rounded-xl border-l-4 border-purple-500 sm:col-span-2">
        <p className="font-medium text-gray-500 text-sm">Winner Reward Details</p>
        <p className="text-md font-bold text-gray-800">{hackathon.rewards?.winner || 'Not Specified'}</p>
      </div>
      <div className="p-4 bg-soft-gray rounded-xl border-l-4 border-blue-500 col-span-full">
        <p className="font-medium text-gray-500 text-sm">Participation</p>
        <p className="text-md text-gray-800">{hackathon.rewards?.participant || 'None'}</p>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 sm:p-8 space-y-6 w-full max-w-4xl">
        {/* Modal Header */}
        <div className="flex justify-between items-start pb-4 border-b border-gray-100">
          <h3 className="text-3xl font-extrabold text-base-blue">{hackathon.hackName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none cursor-pointer transition-colors">×</button>
        </div>

        {/* Detail Content */}
        <div className="space-y-8">
          {/* Status, Platform, Location */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-soft-gray rounded-xl border border-gray-200">
              <p className="font-medium text-gray-500 text-sm">Status</p>
              <span className={`px-3 py-1 text-sm font-bold rounded-full ${statusColor}`}>{status}</span>
            </div>
            <div className="p-3 bg-soft-gray rounded-xl border border-gray-200">
              <p className="font-medium text-gray-500 text-sm">Platform</p>
              <p className="text-lg font-bold text-accent-blue">{hackathon.platform}</p>
            </div>
            <div className="p-3 bg-soft-gray rounded-xl border border-gray-200">
              <p className="font-medium text-gray-500 text-sm">Location</p>
              <p className="text-lg font-bold text-gray-800">{hackathon.location}</p>
            </div>
          </div>

          {/* Stages Section */}
          <div>
            <h4 className="font-extrabold text-xl text-gray-800 mb-3 border-b-2 border-accent-blue/50 pb-1">📅 Stages & Timeline</h4>
            {stagesHTML}
          </div>

          {/* Rewards Section */}
          <div>
            <h4 className="font-extrabold text-xl text-gray-800 mb-3 border-b-2 border-accent-blue/50 pb-1">💰 Rewards & Prizes</h4>
            {rewardsHTML}
          </div>

          {/* Description & Keywords */}
          <div>
            <h4 className="font-extrabold text-xl text-gray-800 mb-3 border-b-2 border-accent-blue/50 pb-1">📖 Overview & Focus</h4>
            <p className="text-gray-600 border-l-4 border-accent-blue pl-4 py-3 bg-soft-gray rounded-lg italic text-md">
              {hackathon.description || 'No detailed description provided.'}
            </p>
            <h5 className="font-bold text-gray-800 mt-4 mb-2">Domains:</h5>
            <div className="flex flex-wrap gap-2">
              {tagHTML.length > 0 ? tagHTML : <span className="text-xs px-3 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">No Domains Tagged</span>}
            </div>
          </div>

          {/* Registration Link Button */}
          <a href={hackathon.link || '#'} target="_blank" rel="noopener noreferrer" className={`block w-full text-center py-3 gradient-btn ${!hackathon.link ? 'opacity-50 cursor-default' : ''}`}>
            🔗 Go to Registration Link (Deadline: {formatDate(hackathon.deadline)})
          </a>
        </div>
      </div>
    </Modal>
  );
};

const HackathonCard = ({ hack, openDetailModal }) => {
  const status = getStatus(hack.deadline);
  const statusColor = status === 'Upcoming' ? 'bg-green-100 text-green-700' :
    status === 'Ongoing' ? 'bg-yellow-100 text-yellow-700' :
      'bg-red-100 text-red-700 opacity-70';

  return (
    <div className="bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-accent-blue/50 border border-transparent">
      <div className={`card-header-gradient p-5 rounded-t-2xl flex justify-between items-center ${status === 'Completed' ? 'opacity-70' : ''}`}>
        <h3 className="text-lg font-bold text-white truncate">{hack.hackName}</h3>
      </div>
      <div className="p-5 space-y-3">
        <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Platform:</span> {hack.platform}</p>
        <div className="text-sm">
          <span className="font-medium text-gray-900">Deadline: </span>
          <span className="font-bold text-gray-800">{formatDate(hack.deadline)}</span>
        </div>
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
          {status}
        </span>
        {/* Domains */}
        {hack.domains && hack.domains.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hack.domains.slice(0, 3).map((domain, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
              >
                {domain}
              </span>
            ))}
          </div>
        )}

        <button onClick={() => openDetailModal(hack)} className="block w-full text-center py-2 text-base-blue border border-base-blue rounded-xl font-semibold hover:bg-base-blue hover:text-white transition-all duration-300 cursor-pointer mt-4">
          View More
        </button>
      </div>
    </div>
  );
};

const HackathonTableRow = ({ hack, openDetailModal }) => {
  const status = getStatus(hack.deadline);
  const statusColor = status === 'Upcoming' ? 'bg-green-100 text-green-700' :
    status === 'Ongoing' ? 'bg-yellow-100 text-yellow-700' :
      'bg-red-100 text-red-700 opacity-70';
  const prizeDisplay = hack.prizePool && hack.prizePool !== 'Not Specified' ? `₹${hack.prizePool}` : 'N/A';

  return (
    <tr
      className="
      group
      rounded-xl
      border border-gray-300
      transition-all duration-300
      overflow-hidden
      relative
    "
    >
      {/* animated border using ::before */}
      <style>
        {`
        .row-border::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          border-radius: 0.75rem;
          background: linear-gradient(120deg, var(--color-base-blue), var(--color-accent-blue), #60a5fa, #1E3A8A);
          background-size: 300% 300%;
          opacity: 0;
          transition: opacity 0.3s ease;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: destination-out;
        }

        .row-border:hover::before {
          opacity: 1;
          animation: border-move 2.5s linear infinite;
        }
      `}
      </style>

      <td className="relative z-10 px-6 py-4 whitespace-normal break-words text-sm font-semibold text-gray-900">
        {hack.hackName}
      </td>
      <td className="relative z-10 px-6 py-4 whitespace-normal break-words text-sm text-gray-600">
        {hack.platform}
      </td>
      <td className="relative z-10 px-6 py-4 whitespace-normal break-words text-sm text-gray-600">
        {formatDate(hack.deadline)}
      </td>
      <td className="relative z-10 hidden md:table-cell px-6 py-4 whitespace-normal break-words text-sm font-medium text-green-700">
        {prizeDisplay}
      </td>
      <td className="relative z-10 hidden md:table-cell px-6 py-4 whitespace-normal break-words text-sm text-gray-600">
        {hack.location}
      </td>
      <td className="relative z-10 px-6 py-4 whitespace-normal break-words text-sm text-center">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="relative z-10 px-6 py-4 whitespace-normal break-words text-right text-sm font-medium">
        <button
          onClick={() => openDetailModal(hack)}
          className="text-accent-blue hover:text-base-blue transition-colors cursor-pointer"
        >
          View Details
        </button>
      </td>
    </tr>
  );

};

// --- Main Application Component ---

const HackathonTracker = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id; // handle both

  const [hackathons, setHackathons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('cards');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  const addHackathon = useCallback((newHackathon) => {
    setHackathons(prev => {
      const updatedHacks = [...prev, newHackathon];
      // Sort by deadline
      updatedHacks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      return updatedHacks;
    });
  }, []);

  const openDetailModal = useCallback((hack) => {
    setSelectedHackathon(hack);
  }, []);

  const closeDetailModal = useCallback(() => {
    setSelectedHackathon(null);
  }, []);

  const navigate = useNavigate();
  // navigation hook

  // profile navigation handler
  const goToProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);


  const filteredHackathons = useMemo(() => {
    if (!searchTerm) {
      return hackathons;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return hackathons.filter(hack =>
      hack.hackName.toLowerCase().includes(lowerCaseSearch) ||
      hack.platform.toLowerCase().includes(lowerCaseSearch) ||
      hack.location.toLowerCase().includes(lowerCaseSearch) ||
      hack.domains.some(domain => domain.toLowerCase().includes(lowerCaseSearch))
    );
  }, [hackathons, searchTerm]);
  useEffect(() => {
    if (!userId) return;

    console.log("Fetching hackathons for user:", userId); // debug log
    const API = process.env.REACT_APP_API_URL;
    const fetchHackathons = async () => {
      try {
        const response = await fetch(`${API}/api/user/${userId}/hackathons`);
        const data = await response.json();

        console.log("✅ Data fetched:", data);
        setHackathons(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error fetching hackathons:", error);
      }
    };

    fetchHackathons();
  }, [userId]);




  return (
    <div className="bg-soft-gray font-sans min-h-screen">
      <style jsx global>
        {`
        :root {
          --color-base-blue: #1E3A8A;
          --color-accent-blue: #3B82F6;
          --color-soft-gray: #F7F8F9;
        }
        .card-header-gradient {
          background: linear-gradient(135deg, var(--color-base-blue), var(--color-accent-blue));
        }
        .gradient-btn {
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-base-blue));
        }
        .view-toggle-active {
          background-color: var(--color-accent-blue);
          color: white;
        }
        @keyframes border-move {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-border-move {
  animation: border-move 2.5s linear infinite;
}
  .animated-table-wrapper {
  background: linear-gradient(120deg, var(--color-base-blue), var(--color-accent-blue), #60a5fa, #1E3A8A);
  background-size: 300% 300%;
  animation: border-move 3s linear infinite;
  border-radius: 1rem;
}
      `}
      </style>

      {/* ✅ Top toolbar (one row) */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-50 shadow p-4 flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search hackathons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 w-full p-3 border-2 border-gray-200 bg-white rounded-2xl shadow-sm
        focus:ring-accent-blue focus:border-accent-blue transition-all duration-300"
        />

        {/* Add Hackathon */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-accent-blue text-white font-semibold px-4 py-2 rounded-full shadow hover:shadow-md hover:bg-base-blue transition-all duration-300"
        >
          ➕ Add
        </button>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 bg-white p-1 rounded-full shadow-lg">
          <button
            onClick={() => setCurrentView("cards")}
            className={`px-4 py-2 font-semibold text-sm rounded-full transition-all duration-300
            ${currentView === "cards" ? "view-toggle-active" : "text-gray-600 hover:bg-soft-gray"}`}
          >
            Card
          </button>
          <button
            onClick={() => setCurrentView("table")}
            className={`px-4 py-2 font-semibold text-sm rounded-full transition-all duration-300
            ${currentView === "table" ? "view-toggle-active" : "text-gray-600 hover:bg-soft-gray"}`}
          >
            Table
          </button>
        </div>
      </div>
      {/* ✅ Main Content Area */}
      <main className="px-6 py-6">
        {/* Card View */}
        {currentView === "cards" && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6 items-start justify-start">
            {filteredHackathons.length > 0 ? (
              filteredHackathons.slice(0, 6).map((hack) => (
                <HackathonCard key={hack._id || hack.id} hack={hack} openDetailModal={openDetailModal} />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">No hackathons found.</p>
            )}
          </section>

        )}

        {/* Table View */}
        {currentView === "table" && (
          <section className="rounded-2xl p-[2px] mt-6 w-full animated-table-wrapper">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {filteredHackathons.length > 0 ? (
                <table className="w-full table-fixed border-separate border-spacing-y-3">

                  <thead className="bg-soft-gray rounded-t-2xl">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Platform</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Deadline</th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Prizes</th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Location</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHackathons.map((hack) => (
                      <HackathonTableRow key={hack._id || hack.id} hack={hack} openDetailModal={openDetailModal} />
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center">No hackathons found.</p>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Modals */}
      <AddHackathonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        addHackathon={addHackathon}
      />
      <DetailModal
        isOpen={!!selectedHackathon}
        onClose={closeDetailModal}
        hackathon={selectedHackathon}
      />
    </div>

  );
};

export default HackathonTracker;