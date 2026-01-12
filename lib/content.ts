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
  name: "Your Name",
  role: "Software Engineer",
  email: "your.email@example.com",
  linkedin: "https://linkedin.com/in/yourprofile",
  github: "https://github.com/yourusername",
  
  // Hero section
  hero: {
    tagline: "Building thoughtful software solutions with intention, precision, and a commitment to continuous growth. This is the story of how curiosity became craft.",
  },
  
  // Footer
  footer: {
    tagline: "Built with intention.",
  },
}

// ============================================================================
// ORIGINS - How you started in software
// ============================================================================

export const origins = {
  title: "How It Started",
  paragraphs: [
    "My journey into software began with curiosity—a question about how things work beneath the surface. What started as tinkering with code snippets quickly evolved into a deeper exploration of logic, problem-solving, and the art of building systems that matter.",
    
    "I was drawn to the elegance of well-structured code and the satisfaction of solving complex problems. Each project taught me something new, and each challenge reinforced my commitment to this craft.",
    
    "What began as experimentation became a deliberate pursuit—a realization that software engineering is not just about writing code, but about creating meaningful solutions that stand the test of time.",
  ],
}

// ============================================================================
// EDUCATION - Academic background
// ============================================================================

export const education = {
  title: "Education & Foundations",
  intro: [
    "My formal education provided the theoretical foundation—data structures, algorithms, software architecture, and systems thinking. But more importantly, it taught me how to learn, how to approach problems methodically, and how to think like an engineer.",
  ],
  
  degree: {
    title: "Bachelor of Science in Computer Science",
    institution: "University Name",
    period: "20XX - 20XX",
    description: "Completed comprehensive coursework in software engineering, systems design, database management, and computational theory. Graduated with honors, focusing on building scalable and maintainable software solutions.",
  },
  
  conclusion: [
    "Now, I'm deliberately building a professional career in software engineering—not as a side pursuit, but as a focused, long-term commitment. I'm investing in expertise, craftsmanship, and the continuous refinement of my skills.",
  ],
}

// ============================================================================
// PROJECTS - Professional work
// ============================================================================

export const projects = {
  title: "Professional Projects",
  intro: "Each project represents growth, responsibility, and the evolution of my technical expertise. These are not just features—they're solutions to real problems, built with intention and care.",
  
  items: [
    {
      title: "Enterprise Dashboard Platform",
      period: "2024",
      description: "Built a comprehensive analytics dashboard serving 10,000+ users daily. Focused on performance optimization, real-time data synchronization, and intuitive user experience.",
      technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
      impact: "Reduced load times by 60% and improved user engagement metrics significantly.",
    },
    {
      title: "Distributed Task Processing System",
      period: "2023",
      description: "Designed and implemented a scalable microservices architecture for handling asynchronous job processing across multiple services with fault tolerance.",
      technologies: ["Python", "RabbitMQ", "Docker", "Kubernetes"],
      impact: "Successfully processes over 1M tasks daily with 99.9% uptime.",
    },
    {
      title: "Mobile-First E-Commerce Platform",
      period: "2023",
      description: "Led the frontend development of a responsive e-commerce platform with advanced filtering, real-time inventory updates, and optimized checkout flows.",
      technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
      impact: "Achieved 40% increase in mobile conversions and maintained 95+ Lighthouse scores.",
    },
    {
      title: "Real-Time Collaboration Tool",
      period: "2022",
      description: "Developed a WebSocket-based collaborative editing platform enabling teams to work together seamlessly with conflict resolution and persistent state management.",
      technologies: ["Vue.js", "WebSockets", "MongoDB", "Express"],
      impact: "Supported 500+ concurrent users with sub-100ms latency.",
    },
  ],
}

// ============================================================================
// CERTIFICATIONS - Learning and growth
// ============================================================================

export const certifications = {
  title: "Continuous Learning",
  intro: "Learning is not a phase—it's a practice. I invest in staying current, deepening expertise, and expanding my understanding of both emerging technologies and fundamental principles.",
  
  items: [
    {
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2024",
      description: "Validated expertise in designing distributed systems on AWS with focus on security, scalability, and cost optimization.",
    },
    {
      title: "Professional Scrum Master I",
      issuer: "Scrum.org",
      year: "2023",
      description: "Demonstrated understanding of Scrum framework and ability to facilitate agile development processes effectively.",
    },
    {
      title: "Advanced React Development",
      issuer: "Meta",
      year: "2023",
      description: "Comprehensive training in React patterns, performance optimization, and modern frontend architecture.",
    },
  ],
  
  conclusion: [
    "Beyond formal certifications, I maintain a commitment to continuous education—reading technical literature, contributing to open source, experimenting with new frameworks, and engaging with the broader engineering community.",
  ],
}

// ============================================================================
// PRESENT - Current focus and direction
// ============================================================================

export const present = {
  title: "Present & Direction",
  paragraphs: [
    "Today, I'm focused on building software that scales—not just technically, but in terms of impact. I'm drawn to projects that require deep technical thinking, thoughtful architecture, and attention to both the engineering and the end-user experience.",
  ],
  
  interests: {
    title: "I'm particularly interested in:",
    items: [
      {
        title: "Distributed systems",
        description: "that solve complex coordination and scalability challenges",
      },
      {
        title: "Developer tooling",
        description: "that improves productivity and reduces friction in the development process",
      },
      {
        title: "Performance optimization",
        description: "at both the application and infrastructure levels",
      },
      {
        title: "Systems architecture",
        description: "that balances flexibility, maintainability, and reliability",
      },
    ],
  },
  
  conclusion: [
    "I'm looking for opportunities where I can contribute meaningfully to challenging projects, collaborate with talented engineers, and continue growing both technically and professionally.",
  ],
}

// ============================================================================
// CONTACT - Call to action
// ============================================================================

export const contact = {
  title: "Let's Connect",
  description: "I'm always interested in discussing new opportunities, technical challenges, or simply connecting with fellow engineers. If you're building something meaningful or looking for someone who approaches software with intention and care, let's talk.",
  
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
    ],
  },
}
