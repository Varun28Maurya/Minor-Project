import React, { useEffect, useState } from "react";
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API = process.env.REACT_API_URL;
        const userId = localStorage.getItem("userId");
        const res = await fetch(`${API}/api/profile/${userId}`);
        const data = await res.json();
        if (res.ok && data.profile) {
          setProfile(data.profile);
        } else {
          setError(data.message || "Profile not found.");
        }
      } catch (err) {
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-700 font-semibold text-lg">
        Loading your profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p className="mb-4">{error || "No profile found."}</p>
        <a
          href="/create"
          className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow"
        >
          Create Profile
        </a>
      </div>
    );
  }

  // ✅ Hackathon progress visualization
  const hackathonCount = profile.hackathonCount || 0; // coming from database
  const totalHackathons = 5;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-700 text-white flex items-center justify-center text-3xl font-bold">
            {profile.header?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.header?.name}
            </h1>
            <p className="text-blue-700 font-medium">
              {profile.header?.headline}
            </p>
            <p className="text-gray-500">{profile.header?.location}</p>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3 border-l-4 border-blue-600 pl-2">
            About
          </h2>
          <p className="text-gray-700">{profile.about}</p>
        </section>

        {/* Experience Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3 border-l-4 border-blue-600 pl-2">
            Experience
          </h2>
          {profile.experiences?.length ? (
            profile.experiences.map((exp, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3"
              >
                <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.dates}</p>
                <p className="text-gray-700 mt-1">{exp.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No experiences added yet.</p>
          )}
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3 border-l-4 border-blue-600 pl-2">
            Education
          </h2>
          {profile.education?.length ? (
            profile.education.map((edu, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3"
              >
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-500">{edu.dates}</p>
                <p className="text-gray-700 mt-1">{edu.field}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education details added yet.</p>
          )}
        </section>

        {/* 🎯 Activity Section (Hackathons) */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3 border-l-4 border-blue-600 pl-2">
            Monthly Hackathon Activity
          </h2>
          <p className="text-gray-600 mb-4">
            You’ve registered for{" "}
            <span className="text-blue-700 font-semibold">
              {hackathonCount}
            </span>{" "}
            out of 5 hackathons this month.
          </p>

          <div className="flex justify-between items-center max-w-xs mx-auto">
            {Array.from({ length: totalHackathons }, (_, i) => {
              const level = i + 1;
              const isActive = hackathonCount >= level;
              const intensity = isActive
                ? `bg-blue-${400 + level * 100}`
                : "bg-gray-200";

              return (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${intensity}`}
                >
                  {level}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-4 text-sm text-gray-500">
            Complete all 5 to reach elite status 💪
          </div>
        </section>
        {/* Action Buttons */}
        <div className="text-center">
          <a
            href="/main/create"
            className="inline-block px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow"
          >
            Edit Profile
          </a>
        </div>
      </div>
    </div>
  );
}
