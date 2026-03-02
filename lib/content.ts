/**
 * Portfolio Content Configuration
 * 
 * Centralized content management for the portfolio.
 * Edit this file to update all personal information across the site.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Project {
  id: string
  title: string
  period: string
  description: string
  technologies: string[]
  impact: string
  url?: string
  images?: { src: string; alt: string }[]
  logo?: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  year: string
  description: string
}

// ============================================================================
// PERSONAL INFORMATION
// ============================================================================

export const personalInfo = {
  name: "Nahuel Mosse",
  role: "Software Engineer – Full Stack",
  email: "nahuelgamail@gmail.com",
  phone: "+54 9 11 2161-5807",
  location: "Buenos Aires, Argentina",
  linkedin: "https://linkedin.com/in/nahuelmosse",
  github: "https://github.com/NahuelMosse",
  gitlab: "https://gitlab.com/NahuelMosse",
  
  // Hero section
  hero: {
    tagline: "Building scalable software solutions with precision, passion, and a commitment to continuous growth. From curiosity to craft—this is my journey in code.",
  },
  
  // Footer
  footer: {
    tagline: "Built with care and intention.",
  },
}

// ============================================================================
// ORIGINS - How you started in software
// ============================================================================

export const origins = {
  title: "How It Started",
  paragraphs: [
    "My first computer came into my life at 12, and like most kids, I used it for Minecraft. A few years later, at 15, I built my own PC and somehow ended up watching a Python tutorial on YouTube. I wanted to create my own AI assistant—like Jarvis from Iron Man. I didn't understand much back then, and after a while, I gave up.",
    
    "At 18, everything changed. I had a programming class in my final year of high school, and I gave it another shot. This time, it clicked. I picked things up faster than my classmates and became genuinely obsessed. I spent hours helping peers debug their code and fix those classic C mistakes—like forgetting the semicolon. I got so into it that I taught myself a GUI library for C, even though the course barely required us to use two while loops.",
    
    "That's when I realized this was my path. I enrolled in Computer Engineering, and by my first semester, I'd already landed my first job. What started as a kid playing games became a career focused on solving real problems and building systems that matter.",
  ],
}

// ============================================================================
// EDUCATION - Academic background
// ============================================================================

export const education = {
  title: "Education & Foundations",
  intro: [
    "My formal education provided the theoretical foundation—data structures, algorithms, software architecture, and systems thinking. But more importantly, it taught me how to learn, how to approach problems methodically, and how to think like an engineer. Throughout my academic journey, I've been recognized with merit-based scholarships and have served as a study group leader, helping peers succeed.",
  ],
  
  degrees: [
    {
      id: "degree-computer-engineering",
      title: "Computer Engineering",
      institution: "University of Morón",
      period: "March 2022 – Present",
      status: "In Progress – 4th Year",
      description: "Currently pursuing advanced coursework in software architecture, distributed systems, and computational theory. Maintaining a GPA above 8.5 with a merit-based scholarship. Leading study groups and collaborating on complex engineering challenges.",
      url: "https://venialaum.unimoron.edu.ar/carreras/escuela-superior-de-ingenieria-informatica-y-cs-agroalimentarias/de-grado/ingenieria-en-informatica/2013?e=3&c=30",
      logo: "/logo-UM.webp"
    },
    {
      id: "degree-advanced-english",
      title: "Advanced English",
      institution: "Liceo Cultural Británico",
      period: "March 2025 – Present",
      status: "In Progress",
      description: "English language studies and English literature. Currently completing the highest level in 2026 and preparing for the First Certificate in 2027.",
      url: "https://www.liceobritanico.com/",
      logo: "/logo-liceo-cultural-britanico.webp"
    },
    {
      id: "degree-systems-analyst",
      title: "Computer Systems Analyst",
      institution: "University of Morón",
      period: "March 2022 – December 2025",
      status: "Completed",
      description: "Completed comprehensive studies in systems analysis, software development, database design, and project management. Graduated with a merit-based scholarship for academic excellence (GPA above 8.5). Developed strong foundations in full-stack development and system architecture.",
      url: "https://venialaum.unimoron.edu.ar/carreras/escuela-superior-de-ingenieria-informatica-y-cs-agroalimentarias/de-grado/ingenieria-en-informatica/2013?e=3&c=30",
      logo: "/logo-UM.webp"
    },
    {
      id: "degree-electromechanical",
      title: "Electromechanical Technician",
      institution: "Colegio Emaús",
      period: "March 2015 – December 2021",
      status: "Completed",
      description: "Technical foundation in electromechanics, electronics, and systems. This early technical training developed my problem-solving mindset and hands-on approach to understanding how systems work—skills that later translated naturally into software engineering.",
      url: "https://www.colegioemaus.edu.ar/tecnica.html",
      logo: "/logo-emaus.webp"
    },
  ],
  
  conclusion: [
    "I'm deliberately building a professional career in software engineering—not as a side pursuit, but as a focused, long-term commitment. I'm investing in expertise, craftsmanship, and the continuous refinement of my skills, with a strong academic foundation backing my practical experience.",
  ],
}

// ============================================================================
// PROJECTS - Professional and Personal work
// ============================================================================

export const projects = {
  title: "Projects",
  intro: "A collection of my professional and personal work. Each project represents growth, learning, and the practical application of my technical skills.",
  
  professional: {
    title: "Professional Experience",
    intro: "Working at Kovix Consulting for over 4 years, I've contributed to large-scale B2C platforms serving millions of users. Each project taught me that great software isn't just about writing code—it's about understanding business needs, collaborating across teams, and delivering measurable results that matter.",

    items: [
      {
        id: "project-visma",
        title: "Visma Enterprise Solutions",
        period: "Feb 2026 - Present",
        description: "Currently working on Visma's enterprise solutions, focusing on scalable architecture and system integration for Nordic market operations.",
        technologies: ["Node.js", "NestJS", "TypeScript", "PostgreSQL"],
        impact: "Contributing to enterprise-grade software serving thousands of businesses across Scandinavia.",
        url: "https://www.visma.com/",
        logo: "/logo-visma.webp"
      },
      {
        id: "project-fravega",
        title: "Frávega E-Commerce Platform",
        period: "Jun 2023 – Jan 2026",
        description: "Full Stack Developer working on a major Argentine e-commerce platform. Designed and maintained API contracts across multiple teams, optimized critical database queries, and planned high-impact production releases. Implemented complete Backend-for-Frontend (BFF) architecture for the Sellers module, actively mentored teammates, and improved code quality through comprehensive unit testing.",
        technologies: ["Node.js", "NestJS", "Angular", "React", "TypeScript", "PostgreSQL", "Jest", "Vitest", "Tailwind CSS", "Webhooks"],
        impact: "Simplified business processes by ~80%, reduced average processing time from several hours to under one hour (1026% improvement in receiving operations: from 7:48h to 46m average), implemented BFF supporting 40,000+ daily requests (1.2M monthly), and maintained system stability during peak traffic periods.",
        url: "https://www.fravega.com/",
        logo: "/logo-fravega.webp",
        images: [
          { src: "/fravega-1.webp", alt: "Frávega WMS Backoffice" },
          { src: "/fravega-2.webp", alt: "Frávega WMS Backoffice" },
          { src: "/fravega-3.webp", alt: "Frávega WMS Mobile Web App" },
          { src: "/fravega-4.webp", alt: "Frávega WMS Microservices Design" },
        ],
      },
      {
        id: "project-justo",
        title: "Jüsto Grocery Delivery Platform",
        period: "Nov 2022 – Dic 2023",
        description: "Collaborated on technical design decisions and API contracts for core business workflows at a fast-growing grocery delivery startup. Estimated development efforts, coordinated task execution within the team, and supported multiple successful production deployments with a strong focus on stability and performance.",
        technologies: ["Node.js", "NestJS", "Angular", "React", "TypeScript", "PostgreSQL", "Jest", "Webhooks"],
        impact: "Delivered 10+ production releases without major incidents, reduced end-to-end preparation time for key workflows by ~50%, and helped scale systems processing tens of millions of product operations during peak demand periods.",
        logo: "/logo-justo.webp",
        images: [
          { src: "/justo-1.webp", alt: "Jüsto WMS Backoffice" },
          { src: "/justo-2.webp", alt: "Jüsto WMS Mobile App" },
        ],
      },
      {
        id: "project-kovix",
        title: "Kovix Marketplace",
        period: "Jul 2022 – Nov 2022",
        description: "Internal marketplace platform development at Kovix Consulting, building core features and infrastructure for multi-vendor operations.",
        technologies: ["Node.js", "NestJS", "React", "TypeScript", "PostgreSQL"],
        impact: "Contributed to building foundational marketplace features and establishing development standards for the project.",
        logo: "/logo-kovix.webp"
      },
    ],

    conclusion: [
      "These professional experiences shaped my understanding of software at scale. From database optimization to system architecture, from mentoring teammates to coordinating releases—I've learned to balance technical excellence with business impact, always focusing on solutions that deliver real value.",
    ],
  },
  
  personal: {
    title: "Personal Projects",
    intro: "Beyond professional work, I experiment with new technologies and build tools I find interesting. From fitness tracking to financial calculators, each project represents curiosity and continuous learning.",
    
    items: [
      {
        id: "personal-gym-app",
        title: "Gym App",
        period: "2024",
        description: "Fitness tracking application designed to help users log workouts, track progress, and visualize their fitness journey over time.",
        technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
        impact: "Personal tool for tracking strength training progression with clean UI and data visualization.",
        url: "https://github.com/nahuelmosse/gym-app",
      },
      {
        id: "personal-portfolio",
        title: "Portfolio Website",
        period: "2026",
        description: "This website—a modern, nature-inspired portfolio built with Next.js, featuring smooth animations, glassmorphism effects, and responsive design.",
        technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        impact: "Showcases my work and technical skills with a unique design aesthetic and excellent user experience.",
        url: "https://github.com/nahuelmosse/portfolio",
        page: "https://nahuelmosse.vercel.app",
      },
      {
        id: "personal-nasa-calendar",
        title: "NASA Calendar",
        period: "2023",
        description: "A dynamic calendar-based web application that consumes NASA's Astronomy Picture of the Day API to render an interactive UI with server-side rendering.",
        technologies: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Server-Side Rendering"],
        impact: "Demonstrates proficiency in modern frontend development and API integration. Open source on GitHub.",
        url: "https://github.com/nahuelmosse/nasa-calendar",
      },
      {
        id: "personal-interest-calculator",
        title: "Compound Interest Calculator",
        period: "2024",
        description: "Financial calculator for computing compound interest with customizable parameters, featuring interactive charts and detailed breakdown of calculations.",
        technologies: ["React", "TypeScript", "Chart.js", "Tailwind CSS"],
        impact: "Useful tool for financial planning and understanding the power of compound returns over time.",
        url: "https://github.com/NahuelMosse/Calculadora-de-interes-compuesto",
        page: "https://nahuelmosse.github.io/Calculadora-de-interes-compuesto/"
      },
      {
        id: "personal-git-tutorial",
        title: "Git Tutorial",
        period: "2023",
        description: "Interactive Git tutorial and reference guide covering essential commands, workflows, and best practices for version control.",
        technologies: ["HTML", "CSS", "JavaScript", "Markdown"],
        impact: "Educational resource for developers learning Git fundamentals and advanced techniques.",
        url: "https://github.com/NahuelMosse/Tutorial-de-Git",
        page: "https://nahuelmosse.github.io/Tutorial-de-Git/"
      },
      {
        id: "personal-winapi-login",
        title: "Login WinAPI",
        period: "2022",
        description: "Windows desktop login application built using Windows API in C++, demonstrating low-level system programming and GUI development.",
        technologies: ["C++", "Windows API", "Win32"],
        impact: "Deep dive into Windows system programming and understanding OS-level authentication mechanisms.",
        url: "https://github.com/NahuelMosse/Sign-in-log-in-WinApi",
      },
    ],

    conclusion: [
      "What professional work taught me about scale and reliability, personal projects taught me about creativity and exploration. Together, they represent my commitment to growth—not just as an engineer building features, but as a craftsman refining my skills.",
    ],
  },
}

// ============================================================================
// CERTIFICATIONS - Learning and growth
// ============================================================================

export const certifications = {
  title: "Achievements & Certifications",
  intro: "Beyond technical skills, I've demonstrated consistent excellence in academics and professional development. From national-level competitions to language proficiency, these achievements reflect my commitment to continuous learning and pushing boundaries.",
  
  items: [
    {
      id: "cert-efset-c2",
      title: "EF SET English Certificate – C2 Proficient",
      issuer: "EF Education First",
      year: "2026",
      description: "C2 level proficiency (highest CEFR level).",
    },
    {
      id: "cert-applied-architecture",
      title: "Applied Software Architecture Course",
      issuer: "Platzi",
      year: "2026",
      description: "Advanced architecture patterns and system design.",
    },
    {
      id: "cert-architecture-fundamentals-2026",
      title: "Software Architecture Fundamentals Course",
      issuer: "Platzi",
      year: "2026",
      description: "Architecture principles and best practices.",
    },
    {
      id: "cert-liceo-level-7",
      title: "Liceo Cultural Británico – Level 7",
      issuer: "Liceo Cultural Británico",
      year: "2025",
      description: "Advanced English language and literature.",
    },
    {
      id: "cert-liceo-level-6",
      title: "Liceo Cultural Británico – Level 6",
      issuer: "Liceo Cultural Británico",
      year: "2025",
      description: "English studies towards First Certificate.",
    },
    {
      id: "cert-architecture-fundamentals-2023",
      title: "Software Architecture Fundamentals",
      issuer: "Platzi",
      year: "2023",
      description: "Core architectural concepts and patterns.",
    },
    {
      id: "cert-engineering-fundamentals",
      title: "Software Engineering Fundamentals",
      issuer: "Platzi",
      year: "2023",
      description: "Engineering principles and methodologies.",
    },
    {
      id: "cert-freecodecamp-responsive",
      title: "Responsive Web Design",
      issuer: "freeCodeCamp",
      year: "2022",
      description: "HTML5, CSS3, Flexbox, and CSS Grid.",
    },
    {
      id: "award-physics-olympiad-2019",
      title: "National Physics Olympiad Finalist – Games Category",
      issuer: "OAF (Olimpiada Argentina de Física)",
      year: "2019",
      description: "National finalist in Games category.",
    },
    {
      id: "award-metro-math-2019",
      title: "Metropolitan Mathematics Olympiad Participant",
      issuer: "OMA (Olimpiada Matemática Argentina)",
      year: "2019",
      description: "Metropolitan level competition.",
    },
    {
      id: "award-ematematica-scientific-2019",
      title: "Ematematica Champion – Scientific Challenges",
      issuer: "Colegio Emaús",
      year: "2019",
      description: "First place in scientific challenges.",
    },
    {
      id: "award-ematematica-third-2019",
      title: "Ematematica Champion – Third Round",
      issuer: "Colegio Emaús",
      year: "2019",
      description: "Champion in third round.",
    },
    {
      id: "award-ematematica-second-2019",
      title: "Ematematica Champion – Second Round",
      issuer: "Colegio Emaús",
      year: "2019",
      description: "Champion in second round.",
    },
    {
      id: "award-ematematica-first-2019",
      title: "Ematematica Runner-Up – First Round",
      issuer: "Colegio Emaús",
      year: "2019",
      description: "Second place in first round.",
    },
    {
      id: "award-mateclubes-2018",
      title: "National Runner-Up – Mateclubes Olympiad",
      issuer: "OMA (Olimpiada Matemática Argentina)",
      year: "2018",
      description: "National second runner-up.",
    },
    {
      id: "award-literature-math-2018",
      title: "National Literature & Mathematics Olympiad Finalist",
      issuer: "OMA (Olimpiada Matemática Argentina)",
      year: "2018",
      description: "National finalist.",
    },
    {
      id: "award-metro-math-2018",
      title: "Metropolitan Mathematics Olympiad Participant",
      issuer: "OMA (Olimpiada Matemática Argentina)",
      year: "2018",
      description: "Metropolitan level competition.",
    },
    {
      id: "award-ematematica-scientific-2018",
      title: "Ematematica Champion – Scientific Challenges",
      issuer: "Colegio Emaús",
      year: "2018",
      description: "First place in scientific challenges.",
    },
    {
      id: "award-ematematica-third-runner-2018",
      title: "Ematematica Second Runner-Up – Third Round",
      issuer: "Colegio Emaús",
      year: "2018",
      description: "Third place in third round.",
    },
    {
      id: "award-ematematica-second-champ-2018",
      title: "Ematematica Champion – Second Round",
      issuer: "Colegio Emaús",
      year: "2018",
      description: "Champion in second round.",
    },
    {
      id: "award-ematematica-first-runner-2018",
      title: "Ematematica Second Runner-Up – First Round",
      issuer: "Colegio Emaús",
      year: "2018",
      description: "Third place in first round.",
    },
    {
      id: "award-mateclubes-finalist-2017",
      title: "National Mateclubes Olympiad Finalist",
      issuer: "OMA (Olimpiada Matemática Argentina)",
      year: "2017",
      description: "National finalist.",
    },
    {
      id: "award-ematematica-champion-2017",
      title: "Ematematica Champion",
      issuer: "Colegio Emaús",
      year: "2017",
      description: "Champion.",
    },
  ],
  
  conclusion: [
    "I maintain a commitment to continuous learning—staying current with emerging technologies, contributing to technical discussions, mentoring teammates, and actively participating in the software engineering community. My academic background in competitive problem-solving translates directly into my approach to complex technical challenges.",
  ],
}

// ============================================================================
// PRESENT - Current focus and direction
// ============================================================================

export const present = {
  title: "Present & Direction",
  paragraphs: [
    "Today, I'm a Semi-Senior Full Stack Developer at Kovix Consulting with over 3 years of professional experience building and scaling production-grade B2C applications. I'm focused on creating software that not only works—but scales, performs, and delivers measurable business impact. I thrive in environments that demand deep technical thinking, thoughtful architecture, and close collaboration with cross-functional teams.",
  ],
  
  interests: {
    title: "I'm particularly interested in:",
    items: [
      {
        id: "interest-backend",
        title: "Backend architecture & APIs",
        description: "designing scalable Node.js/NestJS systems, BFF patterns, and reliable API contracts that serve millions of requests",
      },
      {
        id: "interest-frontend",
        title: "Frontend engineering",
        description: "building responsive, performant UIs with React, Angular, and Next.js that deliver exceptional user experiences",
      },
      {
        id: "interest-database",
        title: "Database optimization",
        description: "writing efficient SQL queries, designing schemas, and working with PostgreSQL at scale",
      },
      {
        id: "interest-performance",
        title: "Performance & scalability",
        description: "optimizing critical business flows, reducing processing times, and ensuring system stability under high traffic",
      },
      {
        id: "interest-quality",
        title: "Code quality & testing",
        description: "implementing unit tests with Jest/Vitest, conducting code reviews, and mentoring teammates to maintain high standards",
      },
    ],
  },
  
  conclusion: [
    "I'm open to remote and international opportunities where I can contribute to challenging projects, work with talented engineering teams, and continue growing as a professional. Whether it's optimizing backend flows, designing robust APIs, or building delightful user interfaces—I bring dedication, technical depth, and a results-driven mindset.",
  ],
}

// ============================================================================
// CONTACT - Call to action
// ============================================================================

export const contact = {
  title: "Let's Connect",
  description: "I'm always interested in discussing new opportunities, technical challenges, or collaborating with fellow engineers. Based in Buenos Aires, Argentina, I'm open to remote and international positions. If you're looking for a dedicated full-stack engineer who delivers results, let's talk.",
  
  cta: {
    primary: {
      text: "Send an Email",
      href: `mailto:${personalInfo.email}`,
    },
    secondary: [
      {
        text: "LinkedIn",
        href: personalInfo.linkedin,
      },
      {
        text: "GitHub",
        href: personalInfo.github,
      },
      {
        text: "GitLab",
        href: personalInfo.gitlab,
      },
    ],
  },
}
