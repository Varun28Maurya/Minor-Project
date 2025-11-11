import React, { useState } from "react";

export default function CreatePage() {
  const [formData, setFormData] = useState({
    header: { name: "", headline: "", location: "" },
    about: "",
    experiences: [{ title: "", company: "", dates: "", description: "" }],
    education: [{ degree: "", school: "", dates: "", field: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Input handlers
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      header: { ...prev.header, [name]: value },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, e, type) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = [...prev[type]];
      updated[index][name] = value;
      return { ...prev, [type]: updated };
    });
  };

  const addItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        type === "experiences"
          ? { title: "", company: "", dates: "", description: "" }
          : { degree: "", school: "", dates: "", field: "" },
      ],
    }));
  };

  const removeItem = (index, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("User ID missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Profile saved successfully!");
        setTimeout(() => (window.location.href = "/main/profile"), 1000);
      } else {
        setMessage(`⚠️ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Create Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">
              Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="name"
                value={formData.header.name}
                onChange={handleHeaderChange}
                placeholder="Full Name"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                name="headline"
                value={formData.header.headline}
                onChange={handleHeaderChange}
                placeholder="Headline (e.g. Web Developer)"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                name="location"
                value={formData.header.location}
                onChange={handleHeaderChange}
                placeholder="Location (City, Country)"
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2"
                required
              />
            </div>
          </section>

          {/* About Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-600 pl-2">
              About You
            </h2>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Write a brief summary about yourself..."
              rows={4}
              className="border rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </section>

          {/* Experience Section */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-2">
                Experience
              </h2>
              <button
                type="button"
                onClick={() => addItem("experiences")}
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                + Add Experience
              </button>
            </div>
            {formData.experiences.map((exp, i) => (
              <div
                key={i}
                className="bg-gray-50 border rounded-lg p-4 mb-3 shadow-sm"
              >
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    name="title"
                    value={exp.title}
                    onChange={(e) => handleArrayChange(i, e, "experiences")}
                    placeholder="Job Title"
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleArrayChange(i, e, "experiences")}
                    placeholder="Company"
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    name="dates"
                    value={exp.dates}
                    onChange={(e) => handleArrayChange(i, e, "experiences")}
                    placeholder="Dates (e.g. Jan 2024 - Present)"
                    className="border p-2 rounded-md md:col-span-2"
                    required
                  />
                </div>
                <textarea
                  name="description"
                  value={exp.description}
                  onChange={(e) => handleArrayChange(i, e, "experiences")}
                  placeholder="Brief description"
                  rows={3}
                  className="border rounded-md w-full p-2 mt-3"
                ></textarea>
                {formData.experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i, "experiences")}
                    className="text-red-500 mt-2 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Education Section */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-2">
                Education
              </h2>
              <button
                type="button"
                onClick={() => addItem("education")}
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                + Add Education
              </button>
            </div>
            {formData.education.map((edu, i) => (
              <div
                key={i}
                className="bg-gray-50 border rounded-lg p-4 mb-3 shadow-sm"
              >
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleArrayChange(i, e, "education")}
                    placeholder="Degree"
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    name="school"
                    value={edu.school}
                    onChange={(e) => handleArrayChange(i, e, "education")}
                    placeholder="School / College"
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    name="dates"
                    value={edu.dates}
                    onChange={(e) => handleArrayChange(i, e, "education")}
                    placeholder="Dates (e.g. 2020 - 2024)"
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    name="field"
                    value={edu.field}
                    onChange={(e) => handleArrayChange(i, e, "education")}
                    placeholder="Field of Study"
                    className="border p-2 rounded-md"
                    required
                  />
                </div>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i, "education")}
                    className="text-red-500 mt-2 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </section>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-full shadow-md"
            >
              {loading ? "Saving..." : "Create Profile"}
            </button>
          </div>
          {message && (
            <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
