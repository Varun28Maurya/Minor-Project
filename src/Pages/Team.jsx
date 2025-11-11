import React, { useEffect, useRef, useState } from "react";
// Make sure to update these image paths to match your project structure
import varunImg from "../Assests/varun.jpg";
import usaidImg from "../Assests/usaid.jpg";
import shubhamImg from "../Assests/shubham.jpg";
import krupaImg from "../Assests/krupa.jpg";
import prakashImg from "../Assests/prakash.jpg";

// --- Team Member Data ---
const teamMembers = [
  {
    id: 1,
    name: "Prakash Mandal",
    role: "Project Co-Lead & Database Management",
    imageUrl: prakashImg,
    linkedin: "https://www.linkedin.com/in/prakash-mandal-337090339/",
    contribution:
      "Implemented the core frontend screens and reusable component structure for the application. Also assisted with backend integration wherever required and took responsibility for designing and managing the database setup, ensuring smooth connectivity between the server and the frontend."
  },
  {
    id: 2,
    name: "Krupa Kataria",
    role: "UI/UX Design & Frontend Implementation",
    imageUrl: krupaImg,
    linkedin: "http://www.linkedin.com/in/krupa-kataria-751b0a372",
    contribution:
      "Designed the visual identity of the project from scratch by creating high-fidelity screens, user experience flows, color palettes, and typography guidelines. Additionally, contributed to converting UI designs into functional frontend layouts that align with the project’s design system."
  },
  {
    id: 3,
    name: "Varun Maurya",
    role: "Project Lead & Full-Stack Development",
    imageUrl: varunImg,
    linkedin: "https://www.linkedin.com/in/varun28maurya",
    contribution:
      "Led the entire project lifecycle — planning, task delegation, version control, and delivery. Developed the backend API, established secure routes, handled database logic, and ensured seamless integration between frontend and backend. Acted as the technical decision-maker and ensured the project stayed aligned with goals and timelines."
  },
  {
    id: 4,
    name: "Usaid Khan",
    role: "Cybersecurity & Documentation",
    imageUrl: usaidImg,
    linkedin: "https://www.linkedin.com/",
    contribution:
      "Focused on identifying potential security vulnerabilities and strengthening the application against misuse. Implemented authentication-related checks and evaluated data flow for secure handling of sensitive information. Also led the creation of the formal project report and documentation."
  },
  {
    id: 5,
    name: "Shubham Prajapati",
    role: "Landing Page Development & Ideation",
    imageUrl: shubhamImg,
    linkedin: "https://www.linkedin.com/in/shubham-prajapati-a71801372/",
    contribution:
      "Designed and developed the landing page with attention to modern UI aesthetics and performance. Participated actively in ideation sessions, contributing concepts that shaped the final direction of the project. Ensured visual consistency across different screens and user-facing elements."
  }
];


// --- TeamCard Component ---
const TeamCard = ({ member, onClick, isSelected, isInactive }) => {
  const cardRef = useRef(null);
  const cardInnerRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const cardInner = cardInnerRef.current;
    if (!card || !cardInner) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const cardInner = cardInnerRef.current;
    if (cardInner) {
      cardInner.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  };
  const cardClasses = [
    "team-card",
    isSelected ? "w-80 h-[580px]" : "w-64 h-[550px]", 
    "transition-all duration-500 ease-in-out",
    "cursor-pointer",
    isSelected ? "card-selected" : "",
    isInactive ? "card-inactive" : ""
  ].join(" ");

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardInnerRef}
        className="card-inner relative group bg-gradient-to-b from-[#1E2A5A] to-[#121529] rounded-2xl overflow-hidden shadow-lg"
      >
        <img
  src={member.imageUrl}
  alt={member.name}
  className={`card-image absolute top-0 left-0 w-full h-full object-cover object-top
    transition-all duration-500 ease-in-out
    ${
      isSelected
        ? "opacity-100 grayscale-0 scale-105" // stay colorful & zoom when clicked
        : "opacity-30 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
    }`
  }
/>

        <div
          className="card-content absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent"
        >
          <div className="font-black text-6xl text-white/40 opacity-100 group-hover:opacity-0 group-hover:-translate-y-4 transition-all duration-500 ease-in-out">
            {String(member.id).padStart(2, '0')}
          </div>
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
            <h3 className="text-lg font-bold text-white">{member.name}</h3>
            <p className="text-sm text-blue-300 font-medium">{member.role}</p>
          </div>
        </div>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()} 
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.5 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

const Team = () => {
  const glowRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);

  const selectedMember = teamMembers.find(member => member.id === selectedId);

  useEffect(() => {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    const easing = 0.08;

    const animateCursor = () => {
      glowX += (mouseX - glowX) * easing;
      glowY += (mouseY - glowY) * easing;
      if (glowRef.current)
        glowRef.current.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
      requestAnimationFrame(animateCursor);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    animateCursor();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // --- Click Outside to Reset ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".team-card") && !e.target.closest(".contribution-box")) {
        setSelectedId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  
  // Use flex-wrap and justify-center
  const teamContainerClasses = [
    "flex flex-wrap items-center justify-center gap-4",
    "transition-all duration-500 ease-in-out",
  ].join(" ");


  return (
    <div className="text-white bg-black relative overflow-x-hidden">

      <div
        ref={glowRef}
        id="cursor-glow"
        className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none rounded-full blur-[100px] z-[-1]"
        style={{
          background: "radial-gradient(circle, rgba(217,70,239,0.2), rgba(139,92,246,0.15), rgba(59,130,246,0.1), transparent 60%)"
        }}
      ></div>

      <div className="container mx-auto px-4 pt-0 pb-16">
        <header className="text-center mb-6">
          <h1 className="text-5xl md:text-[10rem] font-black tracking-wider uppercase">
            WEBSITE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
              TEAM
            </span>
          </h1>
        </header>

        {/* This is the main content wrapper */}
        <div className="flex flex-wrap justify-center items-start gap-8">
          
          <div 
            id="team-container" 
            className={teamContainerClasses}
          >
            {teamMembers.map(member => (
              <TeamCard
                key={member.id}
                member={member}
                isSelected={selectedId === member.id}
                isInactive={selectedId !== null && selectedId !== member.id}
                onClick={() => setSelectedId(selectedId === member.id ? null : member.id)}
              />
            ))}
          </div>

          {/* Contribution Box - Renders only if a member is selected */}
          {selectedMember && (
            <div className="contribution-box w-full max-w-md lg:max-w-lg p-8 bg-gradient-to-b from-[#1E2A5A]/50 to-[#121529]/50 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-3xl font-bold text-white">{selectedMember.name}</h3>
              <p className="text-lg text-blue-300 font-medium mb-4">{selectedMember.role}</p>
              <div className="w-1/4 h-1 bg-blue-400 rounded-full mb-6"></div>
              <h4 className="text-xl font-semibold text-white/90 mb-2">Contribution</h4>
              <p className="text-white/70 text-base leading-relaxed">
                {selectedMember.contribution}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- Styles --- */}
      <style>{`
        .team-card { perspective: 1000px; }
        .card-inner {
          transition: transform 0.2s ease-out, box-shadow 0.3s ease-in-out;
          transform-style: preserve-3d;
          width: 100%; height: 100%; position: relative;
        }
        .card-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 2px;
          background: linear-gradient(45deg, #00ffff, #1d69ff);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .team-card:hover .card-inner::before { opacity: 0.7; }
        .card-image, .card-content { transform-style: preserve-d; transition: transform 0.3s ease-out; }

        .card-selected {
          filter: blur(0) !important;
          opacity: 1 !important;
          z-index: 10;
        }
        
        .card-inactive {
          transform: scale(0.9);
          filter: blur(8px);
          opacity: 0;
          pointer-events: none;
          
          /* Collapse the card */
          width: 0 !important;
          min-width: 0 !D;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
        }
        
        .contribution-box {
          animation: fadeInSlide 0.5s ease-out forwards;
        }
        
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Team;