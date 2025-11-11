// src/Pages/Settings.jsx
import React, { useState } from "react";

const faqData = [
  {
    question: "How do I add a Hackathon?",
    answer:
      "Click the “+ Add Hackathon” button in the header. A popup will appear — simply paste hackathon details or manually enter them.",
  },
  {
    question: "How does search work?",
    answer:
      "The search bar scans hackathon name, platform, location, prize pool, and keywords.",
  },
  {
    question: "Can I manage my team here?",
    answer:
      "Yes. Go to the 'Team' page from the sidebar to invite members or update team info.",
  },
  {
    question: "Is my data stored permanently?",
    answer:
      "Yes, hackathons are stored in your account so you can track submissions and deadlines.",
  },
  {
    question: "Can I edit hackathon details later?",
    answer:
      "Yes, open any hackathon card and click the 'Edit' button to update details anytime.",
  },
  {
    question: "Can I delete a hackathon?",
    answer:
      "Yes, open the hackathon details and click the delete icon to remove it permanently.",
  },
  {
    question: "Does the app send deadline reminders?",
    answer:
      "Yes, reminders are shown in your dashboard and notifications section.",
  },
  {
    question: "Are hackathons sorted automatically?",
    answer:
      "Yes, hackathons auto-sort by nearest deadline to help you prioritize.",
  },
  {
    question: "What is the Pipeline page?",
    answer:
      "Pipeline groups hackathons into status stages like 'Interested', 'In Progress', and 'Submitted'.",
  },
  {
    question: "Can I change the pipeline status manually?",
    answer:
      "Yes, drag and drop hackathons between stages anytime.",
  },
  {
    question: "Can multiple users collaborate?",
    answer:
      "Yes, invite team members so all of you can view and update the same hackathons.",
  },
  {
    question: "Do team members need an account?",
    answer:
      "Yes, they need to sign up to access shared hackathons and pipelines.",
  },
  {
    question: "Is there a dark mode?",
    answer:
      "Dark mode will be available soon; we’re actively working on it.",
  },
  {
    question: "Can I export hackathons?",
    answer:
      "Export to CSV is coming soon for easier spreadsheet management.",
  },
  {
    question: "Is my data shared with hackathon platforms?",
    answer:
      "No, your stored data is private and only visible to your team.",
  },
  {
    question: "Is the app free to use?",
    answer:
      "Yes, all features are free right now.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "Platforms like Devpost, Dare2Compete, Unstop, and Hackerearth are supported.",
  },
  {
    question: "Can I add offline/local hackathons?",
    answer:
      "Absolutely. You can add custom hackathons even if they aren’t from a platform.",
  },
  {
    question: "I found a bug. How do I report it?",
    answer:
      "Use the feedback form in settings or message us directly from the Help Center.",
  },
  {
    question: "How often is the dashboard updated?",
    answer:
      "Dashboard and deadlines update instantly when changes are made.",
  },
];

const guideSteps = [
  "Navigate to Dashboard to view hackathons sorted by deadlines.",
  "Click '+ Add Hackathon' to add a new one.",
  "Use the search bar to filter hackathons instantly.",
  "Visit Pipeline to see all hackathons in card/grid layout.",
  "Open Team page to manage members collaborating with you.",
];

const Settings = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Settings & Help Center</h1>

      {/* Guide Section */}
      <section className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">How to Use Hacker Pipe?</h2>

        <ol className="list-decimal ml-6 space-y-2 text-gray-600">
          {guideSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>

      {/* FAQ Section */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition"
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{item.question}</h3>
                <span className="text-xl text-blue-600">
                  {openFAQ === index ? "−" : "+"}
                </span>
              </div>

              {openFAQ === index && (
                <p className="text-gray-600 mt-3">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Settings;
