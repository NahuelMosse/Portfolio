/**
 * Portfolio Content Configuration
 * 
 * Centralized content management for the portfolio.
 * Edit this file to update all personal information across the site.
 */

// ============================================================================
// PERSONAL INFORMATION
// ============================================================================

export const personalInfo = {
  name: "Nahuel Mosse",
  role: "Software Engineer – Full Stack",
  email: "nahuelgamail@gmail.com",
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
      title: "Computer Engineering",
      institution: "University of Morón",
      period: "March 2022 – Present",
      status: "In Progress – 4th Year",
      description: "Currently pursuing advanced coursework in software architecture, distributed systems, and computational theory. Maintaining a GPA above 8.5 with a merit-based scholarship. Leading study groups and collaborating on complex engineering challenges.",
    },
    {
      title: "Computer Systems Analyst",
      institution: "University of Morón",
      period: "Completed December 2025",
      status: "Completed",
      description: "Completed comprehensive studies in systems analysis, software development, database design, and project management. Graduated with a merit-based scholarship for academic excellence (GPA above 8.5). Developed strong foundations in full-stack development and system architecture.",
    },
    {
      title: "Electromechanical Technician",
      institution: "Colegio Emaús",
      period: "2015 – 2021",
      status: "Completed",
      description: "Technical foundation in electromechanics, electronics, and systems. This early technical training developed my problem-solving mindset and hands-on approach to understanding how systems work—skills that later translated naturally into software engineering.",
    },
  ],
  
  conclusion: [
    "I'm deliberately building a professional career in software engineering—not as a side pursuit, but as a focused, long-term commitment. I'm investing in expertise, craftsmanship, and the continuous refinement of my skills, with a strong academic foundation backing my practical experience.",
  ],
}

// ============================================================================
// PROJECTS - Professional work
// ============================================================================

export const projects = {
  title: "Professional Projects",
  intro: "Each project represents growth, responsibility, and the evolution of my technical expertise. Working at Kovix Consulting for over 3 years, I've contributed to large-scale B2C platforms serving millions of users, focusing on performance, scalability, and business impact.",
  
  items: [
    {
      title: "Frávega B2C – Large-Scale E-Commerce Platform",
      period: "Jun 2022 – Present",
      description: "Full Stack Developer working on a major Argentine e-commerce platform. Designed and maintained API contracts across multiple teams, optimized critical database queries, and planned high-impact production releases. Implemented complete Backend-for-Frontend (BFF) architecture for the Sellers module, actively mentored teammates, and improved code quality through comprehensive unit testing.",
      technologies: ["Node.js", "NestJS", "Angular", "React", "TypeScript", "PostgreSQL", "Jest", "Vitest", "Tailwind CSS", "Webhooks"],
      impact: "Simplified business processes by ~80%, reduced average processing time from several hours to under one hour (1026% improvement in receiving operations: from 7:48h to 46m average), implemented BFF supporting 40,000+ daily requests (1.2M monthly), and maintained system stability during peak traffic periods.",
    },
    {
      title: "Jüsto B2C – Grocery Delivery Platform",
      period: "2022 – 2023",
      description: "Collaborated on technical design decisions and API contracts for core business workflows at a fast-growing grocery delivery startup. Estimated development efforts, coordinated task execution within the team, and supported multiple successful production deployments with a strong focus on stability and performance. Helped scale systems to handle massive growth without downtime.",
      technologies: ["Node.js", "NestJS", "Angular", "React", "TypeScript", "PostgreSQL", "Jest", "Webhooks"],
      impact: "Delivered 10+ production releases without major incidents, reduced end-to-end preparation time for key workflows by ~50%, and helped scale systems processing tens of millions of product operations during peak demand periods—turning historical sales peaks into normal operational days.",
    },
    {
      title: "NASA Calendar – Personal Project",
      period: "2023",
      description: "A dynamic calendar-based web application that consumes NASA's Astronomy Picture of the Day API to render an interactive UI. Built with modern frontend technologies focusing on server-side rendering, responsive design, and seamless user experience. This personal project showcases my ability to work with external APIs and create polished, production-ready applications.",
      technologies: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Server-Side Rendering"],
      impact: "Demonstrates proficiency in modern frontend development, API integration, and creating intuitive user interfaces. Open source project available on GitHub.",
    },
  ],
}

// ============================================================================
// CERTIFICATIONS - Learning and growth
// ============================================================================

export const certifications = {
  title: "Achievements & Certifications",
  intro: "Beyond technical skills, I've demonstrated consistent excellence in academics and professional development. From national-level competitions to language proficiency, these achievements reflect my commitment to continuous learning and pushing boundaries.",
  
  items: [
    {
      title: "EF SET English Certificate – C2 Proficient",
      issuer: "EF Education First",
      year: "2026",
      description: "Achieved C2 level proficiency (highest level on CEFR scale), demonstrating advanced English communication skills essential for international collaboration and technical documentation in global software teams.",
    },
    {
      title: "National Mathematics & Physics Olympiad Finalist",
      issuer: "OMA / OAF – Argentina",
      year: "2017 – 2019",
      description: "National runner-up in Mateclubes 2018, national finalist in Physics Olympiad (Games category, 2019), and finalist in Literature and Mathematics Olympiad 2018. Also competed at metropolitan level (2018, 2019) and achieved champion/runner-up positions in multiple Ematemática competitions at Colegio Emaús (2017-2019). These achievements demonstrate strong analytical thinking, problem-solving abilities, and competitive excellence.",
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
        title: "Backend architecture & APIs",
        description: "designing scalable Node.js/NestJS systems, BFF patterns, and reliable API contracts that serve millions of requests",
      },
      {
        title: "Frontend engineering",
        description: "building responsive, performant UIs with React, Angular, and Next.js that deliver exceptional user experiences",
      },
      {
        title: "Database optimization",
        description: "writing efficient SQL queries, designing schemas, and working with PostgreSQL at scale",
      },
      {
        title: "Performance & scalability",
        description: "optimizing critical business flows, reducing processing times, and ensuring system stability under high traffic",
      },
      {
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
