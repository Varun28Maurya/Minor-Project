import React from "react";

const webInfo = {
    appName: "Trackathon",
    launchDate: "November 11, 2025",
    currentVersion: "v1.0.0",
    lastUpdated: "November 11, 2025",
    mission:
        "Make hackathon planning effortless by centralizing tracking, analytics, and team collaboration.",
    techStack: [
        "React",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Recharts",
        "OpenAI API",
    ],
    roadmap: [
        "Dark Mode",
        "CSV Export",
        "Google Calendar Sync",
        "Collaborative Participation",
        "Email Notifications",
        "Advanced Analytics",
        "Customizable Dashboards",
        "Checklist/Task",
        "Scratchpad",
        "Real-Time Chat",
        "Skill-map Analysis",
        "And many more...",
    ],
    teamCredits: "Built by Team Trackathon",
    policiesLinks: [
        { label: "Terms of Use", href: "#" },
        { label: "Privacy Policy", href: "#" },
    ],
    contact: {
        email: "varun28maurya@gmail.com",
        github: "https://github.com/your-repo",
        website: "https://your-site.com",
    },
};

// Row component for cleaner code
const Row = ({ title, children }) => (
    <div className="border-b py-3 flex flex-col sm:flex-row gap-3">
        <div className="font-semibold text-gray-700 sm:w-56">{title}</div>
        <div className="text-gray-700">{children}</div>
    </div>
);

const About = () => {
    return (
        <div className="bg-white rounded-xl shadow p-6 divide-y">
            <Row title="Website Name">{webInfo.appName}</Row>

            <Row title="Launch Date">{webInfo.launchDate}</Row>

            <Row title="Current Version">
                <span className="px-3 py-2 bg-gray-100 rounded-md text-medium font-mono">
                    {webInfo.currentVersion}
                </span>
            </Row>

            <Row title="Last Updated">{webInfo.lastUpdated}</Row>

            <Row title="Mission Statement">{webInfo.mission}</Row>

            <Row title="Tech Stack">
                <div className="flex flex-wrap gap-3">
                    {webInfo.techStack.map((item) => (
                        <span
                            key={item}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-full bg-white shadow-sm hover:bg-blue-50 transition"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </Row>

            <Row title="Roadmap (Next Features)">
  <ul
    className="
      grid
      grid-cols-1           /* ✅ mobile: 1 column */
      sm:grid-cols-2        /* ✅ small screens: 2 */
      md:grid-cols-3        /* ✅ tablets: 3 */
      lg:grid-cols-4        /* ✅ laptops: 4 */
      xl:grid-cols-5        /* ✅ big screens: 5 */
      2xl:grid-cols-6       /* ✅ your current screen: 6 */
      gap-x-6 gap-y-3
      list-disc ml-5
    "
  >
    {webInfo.roadmap.map((feature) => (
      <li key={feature} className="break-words text-gray-700 font-medium">
        {feature}
      </li>
    ))}
  </ul>
</Row>

            <Row title="Team / Credits">{webInfo.teamCredits}</Row>

            <Row title="Policies / Links">
                <div className="space-y-1">
                    {webInfo.policiesLinks.map((p) => (
                        <div key={p.label}>
                            <a className="text-blue-600 hover:underline" href={p.href}>
                                {p.label}
                            </a>
                        </div>
                    ))}
                </div>
            </Row>

            <Row title="Contact Info">
                <div className="space-y-1">
                    <p>
                        Email:{" "}
                        <a
                            href={`mailto:${webInfo.contact.email}`}
                            className="text-blue-600 hover:underline"
                        >
                            {webInfo.contact.email}
                        </a>
                    </p>
                    <p>
                        GitHub:{" "}
                        <a
                            href={webInfo.contact.github}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {webInfo.contact.github}
                        </a>
                    </p>
                    <p>
                        Website:{" "}
                        <a
                            href={webInfo.contact.website}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {webInfo.contact.website}
                        </a>
                    </p>
                </div>
            </Row>
            <p className="text-center text-xs text-gray-400 mt-6">
                © {new Date().getFullYear()} Trackathon • All rights reserved.
            </p>
        </div>
    );
};

export default About;
