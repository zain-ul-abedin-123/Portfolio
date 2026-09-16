"use client";

import { useEffect, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { Analytics } from "@vercel/analytics/next"

// --- PROJECT DATA & LINK CONFIGURATION ---
type ProjectKey =
  | "oasis"
  | "pkpl"
  | "tenant"
  | "assessment"
  | "housing"
  | "agriscan"
  | "traffic"
  | "shopping"
  | "hospital"
  | "digit"
  | "compiler"
  | "solar"
  | "studentDbms"
  | "aiMini";

type ProjectConfig = {
  title: string;
  type: "industry" | "archive";
  caseStudy: boolean;
  liveDemo?: string | null;
  github?: string | null;
  privateRepo?: boolean;
  problem: string;
  solution: string;
  impact: string;
};

// Keep all project links in one place.
// Replace null with the REAL deployed URL/repository when available.
// Do not use fabricated URLs.
const projects: Record<ProjectKey, ProjectConfig> = {
  oasis: {
    title: "Oasis Thrive Track", type: "industry", caseStudy: true, privateRepo: true,
    problem: "Oasis School for Autism required a unified digital infrastructure to resolve fragmented administrative workflows and inefficient parent-teacher communication channels.",
    solution: "Designed and engineered a comprehensive full-stack ecosystem as a culminating academic project. The architecture features a highly responsive React web dashboard for administrators and a fluid Flutter mobile application for parents, supported by a FastAPI backend and Supabase PostgreSQL.",
    impact: "Centralized the daily digitized diary system and integrated AI-driven report summarization to reduce manual administrative overhead and improve parent-teacher communication."
  },
  pkpl: {
    title: "Prime Kingdom CRM", type: "industry", caseStudy: true, privateRepo: true,
    problem: "Internal operations needed a robust, centralized platform to securely manage complex administrative tasks and track personnel data at scale.",
    solution: "Architected an enterprise-grade management portal utilizing React and FastAPI to streamline and automate daily business processes.",
    impact: "Deployed strict role-based authentication layers and engineered employee attendance tracking to improve internal security and operational visibility."
  },
  tenant: {
    title: "Tenant Protection Hub", type: "industry", caseStudy: true, liveDemo: null, privateRepo: true,
    problem: "Users navigating housing protection services frequently encountered rigid, inaccessible web interfaces that hindered seamless information discovery.",
    solution: "Engineered a dynamic, high-performance single-page application using React, Vite, Tailwind CSS, and Framer Motion.",
    impact: "Delivered an immersive, accessible browsing experience characterized by custom smooth-scroll mechanics and fluid UI/UX state transitions."
  },
  assessment: {
    title: "Assessment Portal", type: "industry", caseStudy: true, privateRepo: true,
    problem: "Manual evaluation workflows and complex result tabulations were becoming a bottleneck for internal scaling and data accuracy.",
    solution: "Developed a comprehensive evaluation platform featuring an interactive assessment dashboard, driven by a scalable Python backend.",
    impact: "Automated detailed test-result processing with optimized relational database workflows, improving retrieval speed and reporting consistency."
  },
  housing: {
    title: "Housing Support Network", type: "industry", caseStudy: true, liveDemo: null, privateRepo: true,
    problem: "The housing sector required a streamlined platform for users to access support networks and submit claims efficiently without navigating convoluted legacy systems.",
    solution: "Engineered a robust frontend architecture utilizing React, Next.js, Tailwind CSS, FastAPI, and Supabase.",
    impact: "Delivered a highly responsive portal focused on accessibility, efficient information discovery, and streamlined claim-related workflows."
  },
  agriscan: {
    title: "AgriScan AI", type: "archive", caseStudy: true, github: null,
    problem: "Farmers need accessible ways to identify plant diseases without relying entirely on manual visual inspection or specialist knowledge.",
    solution: "Built an AI-powered plant and insect disease recognition system using Python, TensorFlow, Keras, and OpenCV with a computer-vision classification pipeline.",
    impact: "Demonstrated practical deployment of deep-learning-based image classification through a user-facing agricultural application."
  },
  traffic: {
    title: "Traffic Sign Predictor", type: "archive", caseStudy: true, github: "https://github.com/wajahat81/traffic",
    problem: "Manual recognition of road signs from images is unreliable and difficult to scale for automated computer-vision applications.",
    solution: "Developed a neural-network-based image classification system capable of identifying and classifying traffic signs from image data.",
    impact: "Demonstrated an end-to-end machine-learning workflow covering image preprocessing, model training, classification, and prediction."
  },
  shopping: {
    title: "Shopping Revenue Predictor", type: "archive", caseStudy: true, github: "https://github.com/wajahat69/shopping",
    problem: "E-commerce platforms can benefit from predicting whether browsing sessions are likely to result in a purchase.",
    solution: "Developed a machine-learning classification system using shopping-session features to predict purchasing behavior.",
    impact: "Converted behavioral browsing data into a predictive model demonstrating a practical application of supervised machine learning."
  },
  hospital: {
    title: "Hospital Management", type: "archive", caseStudy: true, github: null,
    problem: "Manual management of hospital records can result in fragmented patient information and inefficient administrative workflows.",
    solution: "Developed a database management application for handling patient and hospital-related information.",
    impact: "Centralized core hospital data and demonstrated structured CRUD, database, and application-management concepts."
  },
  digit: {
    title: "Digit Recognizer", type: "archive", caseStudy: true, github: null,
    problem: "Recognizing handwritten numerical characters requires a model capable of learning visual patterns from image data.",
    solution: "Built a deep-learning classification model designed to identify handwritten numerical digits from image inputs.",
    impact: "Demonstrated the fundamentals of image classification and neural-network-based pattern recognition."
  },
  compiler: {
    title: "HTML Basic Compiler", type: "archive", caseStudy: true, github: null,
    problem: "Understanding how source code is transformed into structured representations requires practical exposure to lexical and syntactic processing.",
    solution: "Implemented a foundational compiler capable of parsing and processing basic HTML structures using C++.",
    impact: "Provided practical experience with lexical analysis, parsing, syntax handling, and compiler-construction concepts."
  },
  solar: {
    title: "Solar Tracker", type: "archive", caseStudy: true, github: null,
    problem: "Fixed-position solar panels cannot continuously maintain an optimal orientation toward the sun.",
    solution: "Built an Arduino-based tracking system that dynamically adjusts panel positioning according to detected light direction.",
    impact: "Demonstrated integration of software logic, sensors, embedded hardware, and automated control."
  },
  studentDbms: {
    title: "Student DBMS", type: "archive", caseStudy: true, github: null,
    problem: "Academic records become difficult to maintain when information is distributed across disconnected manual systems.",
    solution: "Developed a structured database management application using C++ and MySQL for centralized student information management.",
    impact: "Demonstrated database design, CRUD operations, structured queries, and application-to-database integration."
  },
  aiMini: {
    title: "AI Mini-Projects Portfolio", type: "archive", caseStudy: true, github: null,
    problem: "Understanding AI concepts requires practical implementation across different search, optimization, and probabilistic problems.",
    solution: "Implemented a collection of AI mini-projects including Minesweeper AI, Tic-Tac-Toe Minimax, PageRank, Nim, and Heredity.",
    impact: "Built practical understanding of search algorithms, game-playing agents, probability, inference, and machine-learning fundamentals."
  }
};

const archiveProjects: ProjectKey[] = [
  "agriscan", "traffic", "shopping", "hospital", "digit", "compiler", "solar", "studentDbms", "aiMini"
];

const archiveTech: Record<ProjectKey, string> = {
  agriscan: "Python • TensorFlow • OpenCV", traffic: "Python • Neural Networks", shopping: "Python • Scikit-Learn • HTML",
  hospital: "Full Stack Development", digit: "Python • Deep Learning", compiler: "C++ • Compiler Construction",
  solar: "C++ • Arduino", studentDbms: "C++ • MySQL", aiMini: "Python",
  oasis: "", pkpl: "", tenant: "", assessment: "", housing: ""
};

const archiveDescriptions: Record<ProjectKey, string> = {
  agriscan: "An AI-driven plant and insect disease classification system designed to identify agricultural health issues using computer vision.",
  traffic: "A computer-vision model designed to autonomously identify and classify traffic signs from image data.",
  shopping: "A machine-learning classifier that predicts whether an online shopping customer will complete a purchase based on browsing behavior.",
  hospital: "A full-stack database management application designed to streamline patient records and hospital administrative workflows.",
  digit: "A deep neural network designed to identify handwritten numerical digits from image data.",
  compiler: "A foundational compiler designed to parse, lex, and process basic HTML syntactical structures.",
  solar: "An automated hardware-integrated solar tracking system engineered to dynamically align with the sun.",
  studentDbms: "A structured database management platform designed to centralize academic records with controlled access.",
  aiMini: "A collection of AI implementations including Minesweeper AI, Tic-Tac-Toe Minimax, PageRank, Nim, and Heredity.",
  oasis: "", pkpl: "", tenant: "", assessment: "", housing: ""
};

function ExternalLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center min-h-[40px] px-3 py-2 text-[9px] md:text-[10px] uppercase tracking-widest font-bold whitespace-nowrap border border-current/15 transition-all duration-300 hover:border-current/50 hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current ${className}`}>
      {children}
    </a>
  );
}

function ProjectActions({ project, onCaseStudy, dark = false }: { project: ProjectConfig; onCaseStudy: () => void; dark?: boolean }) {
  const textColor = dark ? "text-[#F4F0EA]" : "text-[#121212]";
  const mutedColor = dark ? "text-[#F4F0EA]/60" : "text-[#121212]/60";

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 pt-4 mt-6 border-t ${dark ? "border-[#F4F0EA]/10" : "border-black/10"}`}>
      {project.caseStudy && (
        <button type="button" onClick={onCaseStudy} className={`inline-flex items-center justify-center min-h-[40px] px-3 py-2 text-[9px] md:text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all duration-300 hover:-translate-y-[1px] ${textColor} focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current`}>
          Case Study
        </button>
      )}
      {project.liveDemo && <ExternalLink href={project.liveDemo} className={textColor}>Live Demo ↗</ExternalLink>}
      {project.privateRepo && (
        <button type="button" aria-label={`${project.title} source code is private`} className={`inline-flex items-center justify-center min-h-[40px] px-3 py-2 text-[9px] md:text-[10px] uppercase tracking-widest font-bold whitespace-nowrap border border-current/10 transition-all duration-300 hover:border-current/30 hover:-translate-y-[1px] ${mutedColor} focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current`}>
          Private Repo <span className="ml-1 text-[8px]" aria-hidden="true">🔒</span>
        </button>
      )}
      {project.github && <ExternalLink href={project.github} className={textColor}>GitHub ↗</ExternalLink>}
    </div>
  );
}

function ProjectCardHeader({ number, title, image, tech, dark = false }: { number: string; title: string; image: string; tech: string; dark?: boolean }) {
  return (
    <div className="flex items-start gap-4 sm:gap-5 md:gap-6 mb-6 md:mb-8 min-w-0">
      <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 overflow-hidden rounded-md border ${dark ? "border-[#F4F0EA]/10 bg-black/50" : "border-black/10 bg-white/40"} shadow-inner`}>
        <img src={image} alt={`${title} logo`} loading="lazy" decoding="async" className="w-full h-full object-contain p-2 transition-all duration-700 md:grayscale md:opacity-70 group-hover:grayscale-0 group-hover:opacity-100" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2 mb-1">
          <span className={`text-[10px] md:text-xs pt-1 md:pt-1.5 font-medium shrink-0 ${dark ? "text-[#F4F0EA]/50" : "text-black/40"}`}>{number}</span>
          <h4 className={`text-xl sm:text-2xl md:text-4xl font-medium tracking-tight leading-[0.95] break-words min-w-0 ${dark ? "text-[#F4F0EA]" : "text-[#121212]"}`}>{title}</h4>
        </div>
        <p className={`text-[8px] sm:text-[9px] uppercase tracking-[0.14em] sm:tracking-widest mt-2 break-words ${dark ? "text-[#F4F0EA]/50" : "text-black/50"}`}>{tech}</p>
      </div>
    </div>
  );
}


export default function PremiumPortfolio() {
  const [typedText, setTypedText] = useState("");
  const fullText = "MUHAMMAD WAJAHAT HAIDER";

  const [philosophyText, setPhilosophyText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeStudy, setActiveStudy] = useState<ProjectKey | null>(null);
  const [activeProjectTitle, setActiveProjectTitle] = useState("industry");

  const phrases = [
    " scalable backend infrastructures.",
    " deep learning models.",
    " machine learning algorithms.",
    " robust full-stack web applications.",
    " seamless mobile applications.",
    " immersive cross-platform experiences."
  ];

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && philosophyText === currentPhrase) {
      typingSpeed = 1500;
      setTimeout(() => setIsDeleting(true), typingSpeed);
      return;
    } else if (isDeleting && philosophyText === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      typingSpeed = 500;
      return;
    }

    const timeout = setTimeout(() => {
      setPhilosophyText((prev) =>
        isDeleting
          ? currentPhrase.substring(0, prev.length - 1)
          : currentPhrase.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [philosophyText, isDeleting, phraseIndex]);

  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveStudy(null);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const lenis = useLenis();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  // Lock background scroll when Case Study modal OR Mobile Menu is open
  useEffect(() => {
    if (activeStudy || isMenuOpen) {
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "unset";
      if (lenis) lenis.start();
    }
  }, [activeStudy, isMenuOpen, lenis]);

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (lenis) {
      lenis.scrollTo(`#${targetId}`, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormStatus("Thank you. Your message has been sent successfully.");
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus("Oops! There was a problem submitting your form.");
      }
    } catch (error) {
      setFormStatus("Oops! There was a problem submitting your form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <main className="relative z-10 w-full max-w-full overflow-x-clip mb-[50vh] md:mb-[60vh] shadow-[0_40px_80px_rgba(0,0,0,0.5)] bg-[#F4F0EA]">

        {/* Case Study Modal Overlay */}
        <AnimatePresence>
          {activeStudy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-study-title"
              onClick={() => setActiveStudy(null)}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-2xl max-h-[calc(100dvh-24px)] sm:max-h-[calc(100dvh-32px)] md:max-h-[85vh] overflow-y-auto overscroll-contain bg-[#F4F0EA] text-[#121212] p-5 sm:p-6 md:p-12 shadow-2xl rounded-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button type="button" onClick={() => setActiveStudy(null)} aria-label="Close case study" className="absolute top-4 right-4 md:top-6 md:right-6 min-h-[40px] px-2 text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black">
                  Close [X]
                </button>

                <h3 id="case-study-title" className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-bold leading-[0.95] mb-7 md:mb-10 pr-16 break-words">
                  {projects[activeStudy].title}
                </h3>

                <div className="flex flex-col gap-7 md:gap-9">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 md:mb-3">01. The Problem</h4>
                    <p className="text-xs sm:text-sm font-light leading-relaxed text-black/80">{projects[activeStudy].problem}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 md:mb-3">02. The Solution</h4>
                    <p className="text-xs sm:text-sm font-light leading-relaxed text-black/80">{projects[activeStudy].solution}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 md:mb-3">03. The Impact</h4>
                    <p className="text-xs sm:text-sm font-light leading-relaxed text-black/80">{projects[activeStudy].impact}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Premium Navbar - Z-[90] ensures it sits above mobile menu z-[80] */}
        <header className="fixed top-0 left-0 w-full px-6 md:px-8 py-6 z-[90] mix-blend-difference flex justify-between items-center text-[10px] md:text-[11px] uppercase tracking-widest font-medium text-[#F4F0EA] pointer-events-none">
          <div className="pointer-events-auto link-underline cursor-pointer">
            <a href="#home" onClick={(e) => handleScroll(e, "home")}>Muhammad Wajahat Haider</a>
          </div>

          <nav className="hidden md:flex gap-10 pointer-events-auto items-center">
            <a href="#about" onClick={(e) => handleScroll(e, "about")} className="link-underline">About</a>
            <a href="#experience" onClick={(e) => handleScroll(e, "experience")} className="link-underline">Experience</a>
            <a href="#skills" onClick={(e) => handleScroll(e, "skills")} className="link-underline">Skills</a>

            <div className="relative group py-4 -my-4">
              <a href="#projects" onClick={(e) => handleScroll(e, "projects")} className="link-underline">Works</a>
              <div className="absolute top-full left-0 pt-2 flex flex-col gap-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 ease-out">
                <a href="#project-oasis" onClick={(e) => handleScroll(e, "project-oasis")} className="text-[9px] whitespace-nowrap hover:opacity-50 transition-opacity">Oasis Thrive Track</a>
                <a href="#project-pkpl" onClick={(e) => handleScroll(e, "project-pkpl")} className="text-[9px] whitespace-nowrap hover:opacity-50 transition-opacity">Prime Kingdom CRM</a>
                <a href="#project-tenant" onClick={(e) => handleScroll(e, "project-tenant")} className="text-[9px] whitespace-nowrap hover:opacity-50 transition-opacity">Tenant Protection Hub</a>
                <a href="#project-assessment" onClick={(e) => handleScroll(e, "project-assessment")} className="text-[9px] whitespace-nowrap hover:opacity-50 transition-opacity">Assessment Portal</a>
                <a href="#project-housing" onClick={(e) => handleScroll(e, "project-housing")} className="text-[9px] whitespace-nowrap hover:opacity-50 transition-opacity">Housing Support Network</a>
              </div>
            </div>

            <a href="#contact-section" onClick={(e) => handleScroll(e, "contact-section")} className="link-underline">Contact</a>
          </nav>

          <div className="pointer-events-auto flex items-center gap-6">
            <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer" className="hidden md:block border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors rounded-sm">Download CV</a>
            <a href="#contact-section" onClick={(e) => handleScroll(e, "contact-section")} className="link-underline hidden md:block">Get in Touch</a>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              className="md:hidden min-h-[44px] min-w-[44px] px-3 flex items-center justify-center text-white hover:opacity-70 transition-opacity"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </header>

        {/* Premium Mobile Menu Overlay - Z-[80] */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: "-10%" }}
              animate={{ opacity: 1, y: "0%" }}
              exit={{ opacity: 0, y: "-10%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              id="mobile-navigation"
              className="fixed inset-0 z-[80] bg-[#121212] flex flex-col items-center justify-center pointer-events-auto md:hidden"
            >
              <nav className="flex flex-col items-center gap-8 text-[#F4F0EA]">
                <a href="#about" onClick={(e) => handleScroll(e, "about")} className="font-cormorant text-4xl tracking-tight">About</a>
                <a href="#experience" onClick={(e) => handleScroll(e, "experience")} className="font-cormorant text-4xl tracking-tight">Experience</a>
                <a href="#skills" onClick={(e) => handleScroll(e, "skills")} className="font-cormorant text-4xl tracking-tight">Skills</a>
                <a href="#projects" onClick={(e) => handleScroll(e, "projects")} className="font-cormorant text-4xl tracking-tight">Works</a>
                <a href="#contact-section" onClick={(e) => handleScroll(e, "contact-section")} className="font-cormorant text-4xl tracking-tight">Contact</a>
                <a href="/Resume.pdf" target="_blank" className="text-[10px] uppercase tracking-widest border border-white/30 px-6 py-3 mt-4">Download Resume</a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Hero Section */}
        <section id="home" className="relative h-screen w-full bg-[#121212] overflow-hidden flex items-center justify-center">
          <motion.img
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            src="/profile-cutout.png"
            alt="Muhammad Wajahat Haider"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[65vh] md:h-[85vh] w-auto object-cover z-10 pointer-events-none grayscale contrast-125 brightness-90"
          />

          <div className="absolute top-[22%] sm:top-[25%] md:top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-full text-center z-20 pointer-events-none px-4 overflow-hidden mix-blend-difference">
            <h1 className="font-cormorant text-[12vw] sm:text-[8vw] md:text-[5.8vw] leading-[0.8] tracking-tighter text-white max-w-full break-words">
              {typedText}
              <span className="blinking-cursor"></span>
            </h1>
          </div>

          <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 z-20 text-[#F4F0EA]">
            <h2 className="text-[9px] md:text-xs uppercase tracking-[0.3em] font-bold mb-1 md:mb-2">Software Developer</h2>
            <p className="text-[8px] md:text-[10px] font-light tracking-[0.2em] opacity-70">AI Systems & Full-Stack Architecture</p>

            <div className="flex gap-4 mt-5 md:mt-6 pointer-events-auto">
              <a href="#projects" onClick={(e) => handleScroll(e, "projects")} className="px-5 py-2.5 bg-white text-black text-[9px] md:text-[10px] uppercase tracking-widest font-semibold hover:bg-white/80 transition-colors">View My Work</a>
              <a href="#contact-section" onClick={(e) => handleScroll(e, "contact-section")} className="px-5 py-2.5 border border-white/20 text-white text-[9px] md:text-[10px] uppercase tracking-widest font-semibold hover:bg-white/10 transition-colors">Contact Me</a>
            </div>
          </div>

          <div className="absolute bottom-12 right-12 z-20 text-[#F4F0EA] text-right hidden md:block">
            <p className="text-[9px] uppercase tracking-[0.2em] font-light opacity-70 mb-1">Scroll to Explore</p>
            <div className="w-[1px] h-12 bg-[#F4F0EA]/50 mx-auto mr-4" />
          </div>
        </section>

        {/* 3. About / Philosophy */}
        <section id="about" className="relative w-full bg-[#F4F0EA] py-20 md:py-32 px-6 md:px-20 border-b border-black/10">
          <div className="max-w-4xl mx-auto flex flex-col gap-8 md:gap-12">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-6 md:mb-8">01. Philosophy</h2>
              <p className="font-cormorant text-2xl md:text-5xl leading-[1.3] md:leading-[1.2] text-[#121212] font-light min-h-[130px] md:min-h-[120px]">
                I believe in deliberate design and resilient architecture. <br className="hidden md:block" />
                <span className="font-medium text-black/70 italic">Crafting {philosophyText}</span>
                <span className="blinking-cursor text-black"></span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-xs md:text-sm text-[#121212]/80 leading-relaxed font-light mt-4 md:mt-8 pt-8 md:pt-12 border-t border-black/10">
              <p>
                I am a Full-Stack Software Developer currently working at Prime Kingdom Pvt Ltd, with previous experience as a Python Full-Stack Developer Intern at NetSol Technologies. My core expertise includes Python, FastAPI, Django, Flutter, React.js, and database management using PostgreSQL, MySQL, and MongoDB.
              </p>
              <div>
                <p className="mb-8">
                  Throughout my career, I have developed several full-stack projects, including a specialized school management platform for <b>Oasis School for Autism</b> (Oasis Thrive Track) and an AI-powered agricultural mobile application (AgriScan). Additionally, I have trained deep learning and computer vision classifiers using TensorFlow, Keras, and OpenCV.
                </p>
                <h3 className="text-[10px] uppercase tracking-widest font-semibold text-black/40 mb-3">Currently Working On</h3>
                <p className="italic">Improving scalable backend architectures, learning advanced system design, and exploring deeper AI integrations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Experience & Education */}
        <section id="experience" className="relative w-full bg-[#EAE8E3] py-20 md:py-32 px-6 md:px-20 border-b border-black/10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-8 md:mb-12">02. Experience</h2>

              <div className="mb-10 md:mb-12 border-l border-black/20 pl-6 relative group cursor-default hover:border-black transition-colors duration-500">
                <div className="absolute w-2 h-2 bg-[#121212] rounded-full -left-[4.5px] top-1.5 group-hover:scale-150 transition-transform duration-500" />
                <h3 className="text-xl md:text-2xl font-cormorant font-semibold text-[#121212]">Software Developer</h3>
                <p className="text-[10px] uppercase tracking-widest text-black/50 mt-1 mb-4">Prime Kingdom Pvt Ltd • Present</p>
                <p className="text-sm text-[#121212]/80 leading-relaxed font-light">
                  Architecting full-stack solutions, optimizing database queries, and integrating third-party APIs for scalable enterprise applications.
                </p>
              </div>

              <div className="border-l border-black/20 pl-6 relative group cursor-default hover:border-black transition-colors duration-500">
                <div className="absolute w-2 h-2 bg-transparent border border-[#121212] rounded-full -left-[4.5px] top-1.5 group-hover:bg-[#121212] transition-colors duration-500" />
                <h3 className="text-xl md:text-2xl font-cormorant font-semibold text-[#121212]">Python Full-Stack Developer Intern</h3>
                <p className="text-[10px] uppercase tracking-widest text-black/50 mt-1 mb-4">NetSol Technologies • Jun – Aug 2025</p>
                <p className="text-sm text-[#121212]/80 leading-relaxed font-light">
                  Developed backend architectures and automated processes within the Unity team, focusing on Python frameworks and system integration.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-8 md:mb-12">03. Education</h2>
              <div className="border-l border-black/20 pl-6 relative group cursor-default hover:border-black transition-colors duration-500">
                <div className="absolute w-2 h-2 bg-[#121212] rounded-full -left-[4.5px] top-1.5 group-hover:scale-150 transition-transform duration-500" />
                <h3 className="text-xl md:text-2xl font-cormorant font-semibold text-[#121212]">BS in Computer Science</h3>
                <p className="text-[10px] uppercase tracking-widest text-black/50 mt-1 mb-4">Bahria University Lahore • 2022 – 2026</p>
                <p className="text-sm text-[#121212]/80 leading-relaxed font-light">
                  Specialized in software engineering, artificial intelligence, and web development. Final Year Project focused on full-stack Cross platform Mobile Application and Web based Admin Dashboard, Specifically Designed for <b>Oasis School for Autism</b>. <br /><br />
                  <span className="font-medium text-[#121212]">CGPA: 3.3 / 4.0</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Skills Section */}
        <section id="skills" className="relative w-full bg-[#F4F0EA] py-20 md:py-32 px-6 md:px-20 border-b border-black/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-10 md:mb-16">04. Technical Expertise</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-black/10 pt-10 md:pt-12">
              <div>
                <h3 className="text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-4 md:mb-6 text-black">Languages</h3>
                <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-black/70 font-light">
                  <li><b>Python</b></li>
                  <li><b>C++</b></li>
                  <li><b>Dart</b></li>
                  <li><b>SQL</b></li>
                  <li><b>HTML / CSS</b></li>
                </ul>
              </div>

              <div>
                <h3 className="text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-4 md:mb-6 text-black">Frontend & Mobile</h3>
                <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-black/70 font-light">
                  <li><b>Flutter</b></li>
                  <li><b>React / Next.js</b></li>
                  <li><b>Vite</b></li>
                  <li><b>Tailwind CSS</b></li>
                  <li><b>Framer Motion</b></li>
                </ul>
              </div>

              <div>
                <h3 className="text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-4 md:mb-6 text-black">Backend & Cloud</h3>
                <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-black/70 font-light">
                  <li><b>FastAPI</b></li>
                  <li><b>Django / DRF</b></li>
                  <li><b>PostgreSQL</b></li>
                  <li><b>AWS</b></li>
                  <li><b>Supabase</b></li>
                  <li><b>Docker</b></li>
                </ul>
              </div>

              <div>
                <h3 className="text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-4 md:mb-6 text-black">Machine Learning</h3>
                <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-black/70 font-light">
                  <li><b>TensorFlow / Keras</b></li>
                  <li><b>OpenCV</b></li>
                  <li><b>NumPy / Pandas</b></li>
                  <li><b>CNN Architectures</b></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Complete Project Showcase Wrapper */}
        <div id="projects" className="relative w-full bg-[#F4F0EA] border-b border-black/10">

          {/* SINGLE Centered Sticky Title */}
          <div className={`sticky top-0 h-screen w-full pointer-events-none flex flex-col justify-center items-center p-6 mix-blend-difference text-white transition-all duration-300 ${activeProjectTitle === "industry" ? "z-40" : "z-0"}`}>
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence>
                {activeProjectTitle === "industry" && (
                  <div key="industry" className="absolute flex flex-col items-center">
                    <div className="overflow-hidden mb-4 md:mb-6">
                      <motion.h2
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
                        className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-white/60"
                      >

                      </motion.h2>
                    </div>
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1], delay: 0.05 }}
                        className="font-cormorant text-4xl md:text-[6.5vw] font-bold tracking-tighter uppercase leading-none text-center"
                      >
                        Industrial
                      </motion.div>
                    </div>
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
                        className="font-cormorant text-4xl md:text-[6.5vw] font-bold tracking-tighter uppercase leading-none text-center"
                      >
                        Projects.
                      </motion.div>
                    </div>
                  </div>
                )}

                {activeProjectTitle === "archive" && (
                  <div key="archive" className="absolute flex flex-col items-center">
                    <div className="overflow-hidden mb-4 md:mb-6">
                      <motion.h2
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
                        className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-white/60"
                      >

                      </motion.h2>
                    </div>
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1], delay: 0.05 }}
                        className="font-cormorant text-4xl md:text-[6.5vw] font-bold tracking-tighter uppercase leading-none text-center"
                      >
                        Archived
                      </motion.div>
                    </div>
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
                        className="font-cormorant text-4xl md:text-[6.5vw] font-bold tracking-tighter uppercase leading-none text-center"
                      >
                        Projects.
                      </motion.div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Scrolling Cards Container */}
          <div className="relative z-20 w-full -mt-[100vh] pt-[60vh] md:pt-[70vh] pb-[20vh]">

            {/* =========================================
                PART A: INDUSTRY CARDS
            ========================================= */}
            <motion.div
              onViewportEnter={() => setActiveProjectTitle("industry")}
              viewport={{ margin: "-30% 0px -30% 0px" }}
              className="flex flex-col gap-12 sm:gap-16 md:gap-40 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto"
            >
              <div id="project-oasis" className="relative w-full md:w-[50vw] mx-auto md:mx-0 md:mr-auto md:ml-12 bg-[#161616] p-5 sm:p-6 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] group transition-transform hover:-translate-y-2 duration-500 rounded-sm min-w-0">
                <ProjectCardHeader number="01" title={projects.oasis.title} image="/oasis_logo.png" tech="React • Flutter • FastAPI • Supabase" dark />
                <div className="w-8 h-[1px] bg-[#F4F0EA]/30 mb-5 md:mb-6" />
                <p className="text-sm md:text-base text-[#F4F0EA]/80 font-light leading-relaxed">A specialized school management platform featuring a comprehensive web-based admin dashboard, secure role-based login, automated AI report summarization, and a digitized diary system accessible via a cross-platform mobile application.</p>
                <ProjectActions project={projects.oasis} onCaseStudy={() => setActiveStudy("oasis")} dark />
              </div>

              <div id="project-pkpl" className="relative w-full md:w-[50vw] mx-auto md:mx-0 md:ml-auto md:mr-12 bg-[#1A1A1A] p-5 sm:p-6 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] group transition-transform hover:-translate-y-2 duration-500 rounded-sm min-w-0">
                <ProjectCardHeader number="02" title={projects.pkpl.title} image="/primekingdom-logo.png" tech="React • FastAPI • Supabase" dark />
                <div className="w-8 h-[1px] bg-[#F4F0EA]/30 mb-5 md:mb-6" />
                <p className="text-sm md:text-base text-[#F4F0EA]/80 font-light leading-relaxed">An enterprise-grade management portal designed to streamline administrative workflows with role-based authentication, centralized data management, and employee attendance tracking.</p>
                <ProjectActions project={projects.pkpl} onCaseStudy={() => setActiveStudy("pkpl")} dark />
              </div>

              <div id="project-tenant" className="relative w-full md:w-[50vw] mx-auto md:mx-0 md:mr-auto md:ml-12 bg-[#161616] p-5 sm:p-6 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] group transition-transform hover:-translate-y-2 duration-500 rounded-sm min-w-0">
                <ProjectCardHeader number="03" title={projects.tenant.title} image="/tenant-logo.png" tech="React • Vite • Tailwind • Framer" dark />
                <div className="w-8 h-[1px] bg-[#F4F0EA]/30 mb-5 md:mb-6" />
                <p className="text-sm md:text-base text-[#F4F0EA]/80 font-light leading-relaxed">A responsive single-page application built to deliver fluid UI/UX, accessible information discovery, smooth scrolling, and polished interaction design.</p>
                <ProjectActions project={projects.tenant} onCaseStudy={() => setActiveStudy("tenant")} dark />
              </div>

              <div id="project-assessment" className="relative w-full md:w-[50vw] mx-auto md:mx-0 md:ml-auto md:mr-12 bg-[#1A1A1A] p-5 sm:p-6 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] group transition-transform hover:-translate-y-2 duration-500 rounded-sm min-w-0">
                <ProjectCardHeader number="04" title={projects.assessment.title} image="/primekingdom-logo.png" tech="React • FastAPI • Supabase" dark />
                <div className="w-8 h-[1px] bg-[#F4F0EA]/30 mb-5 md:mb-6" />
                <p className="text-sm md:text-base text-[#F4F0EA]/80 font-light leading-relaxed">A comprehensive evaluation platform featuring candidate assessments, question management, result processing, and administrative workflows powered by a robust Python backend.</p>
                <ProjectActions project={projects.assessment} onCaseStudy={() => setActiveStudy("assessment")} dark />
              </div>

              <div id="project-housing" className="relative w-full md:w-[50vw] mx-auto md:mx-0 md:mr-auto md:ml-12 bg-[#161616] p-5 sm:p-6 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] group transition-transform hover:-translate-y-2 duration-500 rounded-sm min-w-0">
                <ProjectCardHeader number="05" title={projects.housing.title} image="/logo.avif" tech="Next.js • React • Tailwind • FastAPI • Supabase" dark />
                <div className="w-8 h-[1px] bg-[#F4F0EA]/30 mb-5 md:mb-6" />
                <p className="text-sm md:text-base text-[#F4F0EA]/80 font-light leading-relaxed">A streamlined digital platform designed for the housing sector, enabling users to access support networks and submit claims through a polished, responsive, and accessible experience.</p>
                <ProjectActions project={projects.housing} onCaseStudy={() => setActiveStudy("housing")} dark />
              </div>
            </motion.div>

            {/* =========================================
                PART B: ARCHIVE CARDS (Scroll Trigger)
            ========================================= */}
            <motion.div
              onViewportEnter={() => setActiveProjectTitle("archive")}
              viewport={{ margin: "-30% 0px -30% 0px" }}
              className="mt-40 md:mt-60 pt-20"
            >
              <div className="flex flex-col gap-12 md:gap-24 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto">
                {archiveProjects.map((projectKey, index) => {
                  const project = projects[projectKey];
                  const isRightAligned = index % 2 === 0;

                  return (
                    <div
                      key={projectKey}
                      className={`w-full md:w-[45vw] mx-auto md:mx-0 ${isRightAligned ? "md:ml-auto md:mr-12" : "md:mr-auto md:ml-12"} bg-[#F4F0EA] p-5 sm:p-6 md:p-8 shadow-2xl border border-black/5 hover:-translate-y-2 transition-transform duration-500 rounded-sm relative z-20 min-w-0`}
                    >
                      <div className="flex items-start gap-2 mb-2 min-w-0">
                        <span className="text-[10px] md:text-xs pt-1 font-medium text-black/40 shrink-0">{String(index + 1).padStart(2, "0")}</span>
                        <h4 className="font-medium tracking-tight text-xl sm:text-2xl md:text-3xl text-[#121212] leading-[0.95] break-words min-w-0">{project.title}</h4>
                      </div>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-black/50 mb-4 mt-2 break-words">{archiveTech[projectKey]}</p>
                      <div className="w-6 h-[1px] bg-black/10 mb-4" />
                      <p className="text-sm text-black/70 font-light leading-relaxed">{archiveDescriptions[projectKey]}</p>
                      <ProjectActions project={project} onCaseStudy={() => setActiveStudy(projectKey)} />
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>

        {/* 7. Fully Functional Contact Form Section */}
        <section id="contact-section" className="relative w-full bg-[#121212] text-[#F4F0EA] py-20 md:py-32 px-6 md:px-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-4">07. Direct Inquiry</h2>
            <h3 className="font-cormorant text-3xl md:text-6xl font-light mb-8 md:mb-12">Start a conversation.</h3>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="flex flex-col">
                  <label className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/60 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name"
                    className="bg-transparent border-b border-white/20 py-2 md:py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/60 mb-2">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your-email@example.com"
                    className="bg-transparent border-b border-white/20 py-2 md:py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/60 mb-2">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell me about your project or inquiry..."
                  className="bg-transparent border-b border-white/20 py-2 md:py-3 text-sm text-white focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 md:px-8 py-3 md:py-4 bg-white text-black text-[10px] md:text-xs uppercase tracking-widest font-semibold hover:bg-white/80 transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {formStatus && (
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/70">{formStatus}</p>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* 8. Classic Premium Footer */}
      <footer id="contact" className="fixed bottom-0 left-0 w-full max-w-full h-[50vh] md:h-[60vh] bg-[#121212] z-0 flex flex-col justify-between pt-12 md:pt-16 pb-6 overflow-hidden text-[#F4F0EA]">

        <div className="flex flex-col md:flex-row justify-between items-start w-full px-6 md:px-12 z-10 gap-8 md:gap-0">
          <div className="max-w-md">
            <h2 className="font-cormorant text-2xl md:text-5xl leading-[1.1] md:leading-[0.9] font-light mb-3 md:mb-4 text-[#F4F0EA]">Let's create <br /><span className="italic text-[#F4F0EA]/70">something exceptional.</span></h2>
            <a href="mailto:mwajahath81@gmail.com" className="inline-block uppercase tracking-widest text-[10px] md:text-xs font-semibold border-b border-[#F4F0EA]/50 pb-1 hover:text-white hover:border-white transition-colors">
              mwajahath81@gmail.com
            </a>
          </div>

          <div className="flex gap-12 md:gap-16 text-[9px] md:text-[10px] uppercase tracking-widest font-medium">
            <div className="flex flex-col gap-2 md:gap-3">
              <span className="text-white/40 mb-1">Connect</span>
              <a href="https://www.linkedin.com/in/mwajahathaider" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-white/80 transition-colors w-fit">LinkedIn</a>
              <a href="https://github.com/wajahat81" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-white/80 transition-colors w-fit">GitHub</a>
            </div>
            <div className="flex flex-col gap-2 md:gap-3">
              <span className="text-white/40 mb-1">Legal</span>
              <a href="#" className="link-underline hover:text-white/80 transition-colors w-fit">Privacy Policy</a>
              <a href="#" className="link-underline hover:text-white/80 transition-colors w-fit">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Marquee Footer */}
        <div className="w-full relative mt-auto pt-4 border-t border-[#F4F0EA]/10">
          <a href="mailto:mwajahath81@gmail.com" className="block w-full overflow-hidden hover:opacity-70 transition-opacity">
            <motion.div
              className="flex whitespace-nowrap text-[18vw] md:text-[13vw] font-bold tracking-tighter leading-none uppercase text-[#F4F0EA]"
              animate={{ x: [0, -1500] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
            >
              <span className="pr-8 md:pr-12">GET IN TOUCH</span>
              <span className="pr-8 md:pr-12">GET IN TOUCH</span>
              <span className="pr-8 md:pr-12">GET IN TOUCH</span>
            </motion.div>
          </a>
        </div>
      </footer>
    </ReactLenis>
  );
}