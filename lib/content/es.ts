import type { PortfolioContent } from "./types"

export const es: PortfolioContent = {
  meta: {
    title: "Nahuel Mosse — Senior Full Stack Developer & Technical Lead",
    description:
      "Senior full stack developer y technical lead en Buenos Aires. Cuatro años construyendo sistemas de warehouse, payroll y crédito que aguantan a escala — y el método spec-driven que usan los equipos para construirlos con agentes de IA.",
    keywords: [
      "Senior Full Stack Developer",
      "Technical Lead",
      "Ingeniería de IA",
      "Spec-Driven Development",
      "TypeScript",
      "NestJS",
      "Next.js",
      "PostgreSQL",
      "Azure",
      "Kubernetes",
      "Buenos Aires",
      "Argentina",
    ],
  },

  identity: {
    name: "Nahuel Mosse",
    role: "Senior Full Stack Developer · Technical Lead",
    company: "Kovix Consulting",
    location: "Buenos Aires, Argentina",
    timezone: "America/Argentina/Buenos_Aires",
    email: "nahuelgamail@gmail.com",
    availability: "Abierto a roles remotos e internacionales",
    links: [
      { label: "GitHub", href: "https://github.com/NahuelMosse" },
      { label: "LinkedIn", href: "https://linkedin.com/in/nahuelmosse" },
      { label: "GitLab", href: "https://gitlab.com/NahuelMosse" },
    ],
  },

  boot: {
    lines: [
      "inicializando runtime",
      "montando warehouse.pipeline",
      "montando payroll.ingest",
      "montando credit.scoring",
      "cargando orquestación de agentes",
      "listo",
    ],
    skip: "click para saltear",
  },

  hero: {
    eyebrow: "Buenos Aires · Argentina",
    headline: ["NAHUEL", "MOSSE"],
    statement:
      "Construyo sistemas que aguantan a escala — warehouses moviendo decenas de millones de operaciones, onboarding de payroll reducido de meses a días — y el método spec-driven que usan los equipos para construirlos con agentes de IA.",
    ticker: [
      "40M+ operaciones de producto",
      "40k requests / día",
      "7h48m → 46m",
      "2 meses → 1 semana",
      "4+ años en producción",
      "Senior Full Stack · Technical Lead",
    ],
    scrollCue: "scroll",
    paletteHint: "la página cambia de color a medida que avanzás por el trabajo",
  },

  telemetry: {
    eyebrow: "01 / telemetría",
    title: "Los números, y de dónde salen",
    intro:
      "El impacto es fácil de afirmar y difícil de sustentar. Cada cifra de abajo está atada a un sistema específico, un período específico, y algo específico que cambió para quienes lo usan.",
    metrics: [
      {
        id: "m-operations",
        value: "40M+",
        unit: "ops",
        featured: true,
        label: "Operaciones de producto procesadas",
        source: "Jüsto — WMS multiwarehouse, picos de demanda",
        projectId: "justo",
        shape: [0.18, 0.24, 0.31, 0.29, 0.44, 0.58, 0.53, 0.72, 0.86, 1],
      },
      {
        id: "m-requests",
        value: "40k",
        unit: "req / día",
        label: "Sostenido a través del Sellers BFF",
        source: "Frávega — 1.2M requests por mes",
        projectId: "fravega",
        shape: [0.32, 0.38, 0.35, 0.49, 0.46, 0.62, 0.71, 0.68, 0.88, 0.94],
      },
      {
        id: "m-receiving",
        value: "46",
        unit: "min",
        label: "Tiempo promedio de recepción, bajando de 7h 48m",
        source: "Frávega — flujo de recepción de warehouse, ~90% de reducción",
        projectId: "fravega",
        shape: [1, 0.94, 0.79, 0.62, 0.48, 0.36, 0.27, 0.19, 0.13, 0.1],
      },
      {
        id: "m-onboarding",
        value: "1",
        unit: "semana",
        label: "Etapa de onboarding de payroll, bajando de 2 meses",
        source: "Visma — extracción y validación asistidas por IA",
        projectId: "visma",
        shape: [1, 0.86, 0.68, 0.51, 0.38, 0.26, 0.18, 0.13, 0.11, 0.09],
      },
      {
        id: "m-simplification",
        value: "80",
        unit: "%",
        label: "Pasos del proceso de negocio eliminados",
        source: "Frávega — rediseño de orquestación de fulfilment",
        projectId: "fravega",
        shape: [0.14, 0.22, 0.36, 0.41, 0.55, 0.63, 0.74, 0.81, 0.88, 0.92],
      },
      {
        id: "m-years",
        value: "4+",
        unit: "años",
        label: "Entregando software en producción en Kovix",
        source: "Junio 2022 — presente, en cinco plataformas de clientes",
        shape: [0.1, 0.22, 0.34, 0.45, 0.56, 0.66, 0.75, 0.84, 0.92, 1],
      },
    ],
    footnote:
      "Acá no hay capturas de sistemas de clientes. Los diagramas de la próxima sección fueron dibujados desde cero para este sitio.",
  },

  work: {
    eyebrow: "02 / trabajo",
    title: "Cinco sistemas, cinco problemas",
    intro:
      "Cuatro años en Kovix Consulting, integrado en equipos de ingeniería de clientes. Warehouses, payroll, crédito. Cada panel es un sistema: qué tuvo que sobrevivir, y qué tuve a mi cargo.",
    dragHint: "arrastrá o scrolleá",
    projects: [
      {
        id: "smart-warehousing",
        client: "Kovix · Smart Warehousing",
        title: "Enseñarle a una empresa a construir con agentes",
        role: "AI Engineering Enablement Lead · SDD Coach",
        period: "Sep 2026 — presente",
        palette: "lime",
        logo: "/logo-kovix.webp",
        summary:
          "Un método de desarrollo transversal para trabajo asistido por IA, aplicado a proyectos greenfield y brownfield en distintos equipos y arquitecturas.",
        body: [
          "Creé y evolucioné una metodología transversal para desarrollo asistido por IA, y después tomé un rol más cercano a un Scrum Master que a un lead engineer: coacheando equipos, destrabándolos, midiendo adopción, e incorporando su feedback de vuelta al método.",
          "El modelo operativo es deliberado sobre quién hace qué. Los agentes toman trabajo con alcance junior a semi-senior, bajo especificaciones explícitas, criterios de aceptación y gates de revisión humana. Los ingenieros senior se concentran en arquitectura, escalabilidad, mantenibilidad y las decisiones que salen caras si se equivocan.",
        ],
        stack: ["Claude Code", "Spec-Driven Development", "Orquestación multiagente", "Habilitación técnica"],
        headline: {
          id: "sw-headline",
          value: "Cross-team",
          kind: "claim",
          label: "Método adoptado en proyectos greenfield y brownfield",
          source: "Kovix Consulting, 2026",
        },
        flow: {
          title: "El loop",
          nodes: [
            { id: "spec", label: "Especificación", detail: "Alcance, criterios de aceptación, no-objetivos explícitos" },
            { id: "delegate", label: "Delegación", detail: "Trabajo dimensionado a lo que un agente puede manejar de forma segura" },
            { id: "agents", label: "Ejecución de agentes", detail: "Paralela, acotada, trazable" },
            { id: "review", label: "Revisión humana", detail: "Gate de arquitectura y calidad — nunca se saltea" },
            { id: "prod", label: "Producción", detail: "El feedback vuelve al método" },
          ],
        },
      },
      {
        id: "grupo-st",
        client: "Grupo ST",
        title: "Riesgo crediticio, con la trazabilidad que piden los reguladores",
        role: "Technical Lead",
        period: "Ago 2026 — presente",
        palette: "amber",
        summary:
          "Una plataforma de gestión documental y decisión que automatiza la aprobación de crédito manteniendo cada paso auditable.",
        body: [
          "Technical lead de una plataforma que lleva una solicitud de crédito desde el ingreso, pasando por extracción de documentos, scoring y revisión de comité, hasta una decisión final — con trazabilidad en cada salto, porque el resultado tiene que sobrevivir una auditoría.",
          "Construida AI-first: agentes orquestados con Claude Code y spec-driven development implementan el producto de punta a punta a partir de especificaciones y decisiones de arquitectura que llevo yo. Domain-driven design sobre Next.js y NestJS, con una suite de unit tests en Jest y una suite de regresión end-to-end en Playwright cuidando los flujos completos.",
        ],
        stack: ["TypeScript", "Next.js", "NestJS", "Sequelize", "PostgreSQL", "DDD", "Jest", "Playwright", "Turborepo"],
        headline: {
          id: "st-headline",
          value: "End-to-end",
          kind: "claim",
          label: "Del ingreso a la decisión, totalmente trazable",
          source: "Plataforma de riesgo crediticio de Grupo ST, en desarrollo",
        },
        flow: {
          title: "Ciclo de vida de la solicitud",
          nodes: [
            { id: "intake", label: "Ingreso", detail: "Solicitud y documentación de respaldo" },
            { id: "extract", label: "Extracción", detail: "Datos estructurados extraídos de los documentos" },
            { id: "score", label: "Scoring", detail: "Modelo de riesgo contra reglas de política" },
            { id: "committee", label: "Comité", detail: "Decisión humana, registrada" },
            { id: "decision", label: "Decisión", detail: "Aprobada, condicionada o rechazada — con motivos" },
          ],
        },
      },
      {
        id: "visma",
        client: "Visma",
        title: "Dos meses de onboarding de payroll, bajados a una semana",
        role: "Technical Lead",
        period: "Ene 2026 — presente",
        palette: "nordic",
        logo: "/logo-visma.webp",
        summary:
          "Onboarding de payroll para consultores: ingerir el payroll existente del cliente, entenderlo, validarlo y cargarlo — sin un proyecto manual de dos meses.",
        body: [
          "Lideré la parte técnica y hablé directamente con el cliente: traduciendo necesidades de negocio de payroll en alcance, arquitectura y roadmap. También manejé el calendario, las prioridades y la distribución de trabajo, mentoreé a un desarrollador junior, y estuve a cargo del design system del producto.",
          "La arquitectura es un monorepo Nx sobre Next.js y NestJS, clean architecture y DDD, integrado con APIs internas y Azure OpenAI — la integración que llevó una etapa de onboarding de dos meses a una semana. Los datos y el procesamiento asíncrono corren sobre Prisma con PostgreSQL, con BullMQ y Redis para colas, cache y rate limiting distribuido, evitando deliberadamente Redis como almacenamiento persistente para mantener costos bajos.",
          "También fui responsable de seguridad, CI/CD e infraestructura como código: deployment en Azure con Terraform y AKS, managed identities, Key Vault, networking privado y políticas de seguridad de Kubernetes.",
        ],
        stack: [
          "TypeScript",
          "Nx",
          "Next.js",
          "NestJS",
          "Prisma",
          "PostgreSQL",
          "Redis",
          "BullMQ",
          "Azure OpenAI",
          "Terraform",
          "AKS",
        ],
        headline: {
          id: "visma-headline",
          value: "1 semana",
          label: "Una etapa de onboarding, bajada de dos meses",
          source: "Onboarding de payroll de Visma, 2026",
        },
        flow: {
          title: "Pipeline de onboarding",
          nodes: [
            { id: "ingest", label: "Ingesta", detail: "Archivos de payroll existentes, con cualquier formato que lleguen" },
            { id: "extract", label: "Extracción", detail: "Azure OpenAI convierte documentos en conceptos estructurados" },
            { id: "validate", label: "Validación", detail: "Reglas y confirmación humana antes de confiar en nada" },
            { id: "queue", label: "Procesamiento asíncrono", detail: "BullMQ sobre Redis, con rate limiting" },
            { id: "sync", label: "Sincronización", detail: "Cargado en la plataforma de payroll" },
          ],
        },
      },
      {
        id: "fravega",
        client: "Frávega",
        title: "Un warehouse que tenía que seguir moviéndose",
        role: "Full Stack Developer",
        period: "Jun 2023 — Ene 2026",
        palette: "violet",
        logo: "/logo-fravega.webp",
        summary:
          "Modernizando el fulfilment de pedidos en un warehouse a gran escala: el software que orquestaba el packing y manejaba el sorter del transporte interno.",
        body: [
          "Trabajé en el sistema que armaba los paquetes y se integraba con el sorter responsable de moverlos por el edificio — la capa donde un bug no significa un request fallido, significa que la mercadería física se detiene.",
          "Implementé la arquitectura BFF completa para el módulo de Sellers, sosteniendo 40.000 requests por día y 1.2 millones por mes. Además: diseño y documentación de contratos de API entre equipos, optimización de queries, unit testing y soporte a producción.",
          "Simplificar el proceso de negocio eliminó cerca del 80% de sus pasos y llevó el tiempo promedio de recepción de 7 horas 48 minutos a 46 minutos. También planifiqué releases críticos, gestioné riesgo de calendario de forma preventiva, escribí guías de deployment y mentoreé compañeros.",
        ],
        stack: ["Node.js", "NestJS", "Angular", "React", "TypeScript", "Sequelize", "PostgreSQL", "Jest", "Vitest", "Webhooks"],
        headline: {
          id: "fravega-headline",
          value: "46 min",
          label: "Tiempo promedio de recepción, bajado de 7h 48m",
          source: "Frávega WMS B2C, 2023–2026",
        },
        flow: {
          title: "Camino de fulfilment",
          nodes: [
            { id: "receiving", label: "Recepción", detail: "Entrada de mercadería — el paso que pasó de 7h48m a 46m" },
            { id: "stock", label: "Stock", detail: "Ubicaciones y disponibilidad" },
            { id: "picking", label: "Picking", detail: "Armado de pedidos" },
            { id: "sorter", label: "Sorter", detail: "Ruteo físico por el edificio" },
            { id: "dispatch", label: "Despacho", detail: "Salida hacia el cliente" },
          ],
        },
      },
      {
        id: "justo",
        client: "Jüsto",
        title: "Multiwarehouse, y qué vence primero",
        role: "Full Stack Developer",
        period: "Nov 2022 — Dic 2023",
        palette: "green",
        logo: "/logo-justo.webp",
        summary:
          "Un WMS multiwarehouse para los centros de distribución de un supermercado online, más una versión reducida para centros de micro-fulfilment.",
        body: [
          "Diseñé un WMS multiwarehouse con aislamiento cercano a multitenancy para los centros de distribución, y una versión más liviana para los centros de micro-fulfilment que operan bajo restricciones distintas.",
          "El cambio real fue reemplazar planillas y conocimiento informal por trazabilidad real de inventario y ubicaciones, incluyendo despacho FEFO — first expired, first out — que importa cuando el producto es comida.",
          "Más de diez releases, alrededor de 50% menos tiempo de preparación, decenas de millones de operaciones, y más margen durante picos históricos de ventas. También hice diseño técnico y contratos de API, estimación de esfuerzo, seguimiento de tareas, y mentoría para mantener al equipo destrabado durante esos picos.",
        ],
        stack: ["Node.js", "NestJS", "Angular", "React", "TypeScript", "Sequelize", "PostgreSQL", "Jest", "Webhooks"],
        headline: {
          id: "justo-headline",
          value: "40M",
          label: "Operaciones de producto en pico de demanda",
          source: "Jüsto WMS multiwarehouse, 2022–2023",
        },
        flow: {
          title: "Modelo multiwarehouse",
          nodes: [
            { id: "dc", label: "Centros de distribución", detail: "Aislados como tenants" },
            { id: "mfc", label: "Micro-fulfilment", detail: "Versión reducida, restricciones más estrictas" },
            { id: "inventory", label: "Inventario", detail: "Ubicaciones y trazabilidad reemplazando planillas" },
            { id: "fefo", label: "FEFO", detail: "First expired, first out" },
            { id: "delivery", label: "Entrega", detail: "Compras del día para el mismo día" },
          ],
        },
      },
    ],
  },

  lab: {
    eyebrow: "03 / lab",
    title: "Lo que construyo cuando nadie me lo pide",
    intro:
      "El trabajo con clientes te enseña escala y consecuencia. Tus propios proyectos son donde podés ser estricto sin más motivo que querer que la cosa esté bien hecha.",
    projects: [
      {
        id: "grit",
        title: "Grit",
        tagline: "Un sistema de entrenamiento local-first. Sin cuenta, sin red, sin backend.",
        palette: "grit",
        body: [
          "Una app en Flutter para gente que entrena por su cuenta: planificar rutinas, correr una sesión en vivo, corregir historial, y ver cómo se acumulan progreso y rachas con el tiempo. Todo vive en el dispositivo — sin registro, sin servidor, sin telemetría que salga del teléfono.",
          "La construí como coacheo a los equipos a construir: catorce especificaciones formales antes del código, un roadmap trazado contra ellas, y una auditoría visual de paridad que renderiza cada pantalla en distintos idiomas, temas, tamaños de pantalla y escalas de fuente, y después compara los resultados. 1.852 capturas, para que la accesibilidad y la localización se verifiquen en vez de asumirse.",
        ],
        stack: ["Flutter", "Dart", "Riverpod", "Drift", "SQLite", "Spec-Driven Development"],
        stats: [
          { value: "53.300", label: "líneas de Dart" },
          { value: "78", label: "archivos de test" },
          { value: "14", label: "specs formales" },
          { value: "1.852", label: "capturas de paridad" },
        ],
        media: {
          poster: "/lab/grit/poster.webp",
          shots: [],
        },
      },
      {
        id: "sdd-kit",
        title: "SDD Kit",
        tagline: "El método, escrito e instalable.",
        palette: "cyan",
        body: [
          "La metodología de spec-driven development que enseño en Kovix, empaquetada para que un equipo la adopte sin que yo esté en la sala: el método escrito, plantillas de plan y snapshot, los motores que impulsan cada etapa, y evals para chequear si un agente realmente hizo lo que decía la spec.",
          "La premisa es simple y poco moderna. Un agente es bueno para implementar una decisión y malo para tomarla. Entonces escribís la decisión primero — alcance, criterios de aceptación, no-objetivos explícitos — y el gate de revisión se queda humano.",
        ],
        stack: ["Metodología", "Claude Code", "Plantillas", "Evals"],
        stats: [
          { value: "10", label: "etapas documentadas" },
          { value: "2", label: "motores" },
          { value: "1", label: "manual escrito" },
        ],
      },
    ],
    smallTitle: "Cosas más chicas",
    small: [
      {
        id: "nasa-calendar",
        title: "NASA Calendar",
        year: "2023",
        description:
          "Un calendario que trae la Astronomy Picture of the Day de la NASA y la renderiza server-side.",
        stack: ["TypeScript", "Next.js", "React", "SSR"],
        repo: "https://github.com/NahuelMosse/nasa-calendar",
      },
      {
        id: "ias-api",
        title: "CI/CD Pipeline API",
        year: "2026",
        description:
          "Una API en Flask sobre Postgres, pero lo importante es el pipeline: GitHub Actions en dev, QA y producción, con aprobación manual antes de prod y escaneo de seguridad con Bandit.",
        stack: ["Python", "Flask", "PostgreSQL", "Docker", "GitHub Actions"],
        repo: "https://github.com/NahuelMosse/ias_mosse_api",
      },
      {
        id: "node-mongo",
        title: "Node · Mongo CLI",
        year: "2026",
        description:
          "Un CLI interactivo de dominio de ventas, en capas de dominio, repositorio y servicio — algo chico construido con la disciplina de algo grande.",
        stack: ["TypeScript", "MongoDB", "Mongoose", "Inquirer"],
        repo: "https://github.com/NahuelMosse/Node-Mongo",
      },
      {
        id: "compound-interest",
        title: "Compound Interest Calculator",
        year: "2026",
        description: "Proyecciones financieras con gráficos interactivos y el detalle completo de cada período.",
        stack: ["React", "Vite", "JavaScript", "Charts"],
        repo: "https://github.com/NahuelMosse/Calculadora-de-interes-compuesto",
        demo: "https://nahuelmosse.github.io/Calculadora-de-interes-compuesto/",
      },
      {
        id: "winapi-login",
        title: "Login WinAPI",
        year: "2022",
        description:
          "Un login de escritorio construido directamente sobre la Win32 API en C++. Sin framework, sin red de seguridad — que era todo el objetivo.",
        stack: ["C++", "Win32", "Windows API"],
        repo: "https://github.com/NahuelMosse/Sign-in-log-in-WinApi",
      },
      {
        id: "git-tutorial",
        title: "Git Tutorial",
        year: "2023",
        description: "Una referencia interactiva de comandos y flujos de Git, escrita para gente que lo está aprendiendo.",
        stack: ["HTML", "CSS", "JavaScript"],
        repo: "https://github.com/NahuelMosse/Tutorial-de-Git",
        demo: "https://nahuelmosse.github.io/Tutorial-de-Git/",
      },
    ],
  },

  method: {
    eyebrow: "04 / método",
    title: "Cómo trabajo con agentes",
    intro:
      "La mayoría de los equipos apunta un agente a un codebase y espera lo mejor. Eso produce volumen, no software. El método de abajo es lo que construí en Kovix y lo que uso en mis propios proyectos — la diferencia es que la decisión viene antes que el código, y un humano es dueño del gate.",
    steps: [
      {
        id: "spec",
        title: "Especificación primero",
        body: "Alcance, criterios de aceptación y no-objetivos explícitos, escritos antes de la primera línea de código. Si no se puede especificar, no está listo para delegar.",
      },
      {
        id: "size",
        title: "Dimensionar el trabajo con honestidad",
        body: "Los agentes toman trabajo con alcance junior a semi-senior. La arquitectura, la escalabilidad y todo lo caro de revertir se queda con los ingenieros senior.",
      },
      {
        id: "orchestrate",
        title: "Orquestar, no promptear",
        body: "Agentes en paralelo con responsabilidades definidas y contexto acotado, cada uno trazable a la spec que lo autorizó.",
      },
      {
        id: "gate",
        title: "El gate humano no es opcional",
        body: "La revisión es donde el método se gana su lugar. La calidad la garantizan los tests, las suites de regresión y una persona responsable del resultado.",
      },
      {
        id: "feedback",
        title: "Devolverle el feedback al método",
        body: "Lo que el equipo encuentra en la práctica se vuelve la próxima revisión. La adopción se coachea, se mide y se ajusta — no se anuncia una vez y se abandona.",
      },
    ],
    outro:
      "Esto es lo que hago ahora como AI Engineering Enablement Lead: no escribir más código más rápido, sino hacer posible que un equipo lo escriba bien.",
  },

  arsenal: {
    eyebrow: "05 / arsenal",
    title: "Inventario",
    intro:
      "Todo lo que hay acá fue usado contra un deadline, en producción, con alguien dependiendo del resultado. Filtrá por categoría.",
    legend: "años de uso",
    categories: ["Lenguajes", "Frontend", "Backend & Data", "Arquitectura", "Cloud & DevOps", "Ingeniería de IA", "Calidad"],
    items: [
      { name: "TypeScript", category: "Lenguajes", years: 4, note: "Lenguaje principal en todas las plataformas de abajo." },
      { name: "JavaScript", category: "Lenguajes", years: 5, note: "Donde TypeScript todavía no llegó." },
      { name: "SQL", category: "Lenguajes", years: 4, note: "Optimización de queries en tablas a escala de warehouse." },
      { name: "Python", category: "Lenguajes", years: 3, note: "APIs, tooling y automatización." },
      { name: "C++", category: "Lenguajes", years: 3, note: "Escritorio con Win32 y programación de sistemas en la facultad." },
      { name: "Go", category: "Lenguajes", years: 1, note: "Servicios y tooling de CLI." },
      { name: "Java", category: "Lenguajes", years: 2, note: "Cursada de diseño orientado a objetos y servicios chicos." },
      { name: "Dart", category: "Lenguajes", years: 2, note: "Grit, y todo lo que tiene forma de Flutter." },

      { name: "React", category: "Frontend", years: 4, note: "Backoffices, dashboards y UI de producto." },
      { name: "Next.js", category: "Frontend", years: 3, note: "App Router, SSR, y este sitio." },
      { name: "Angular", category: "Frontend", years: 3, note: "Dos frontends completos de gestión de warehouse." },
      { name: "Tailwind CSS", category: "Frontend", years: 3, note: "Design tokens sobre clases utilitarias." },
      { name: "shadcn/ui · Radix", category: "Frontend", years: 2, note: "Primitivas accesibles, tematizadas por producto." },
      { name: "Flutter", category: "Frontend", years: 2, note: "Mobile local-first, offline por diseño." },

      { name: "Node.js", category: "Backend & Data", years: 4, note: "Cada backend de esta página." },
      { name: "NestJS", category: "Backend & Data", years: 4, note: "Layouts de servicio hexagonales y DDD." },
      { name: "PostgreSQL", category: "Backend & Data", years: 4, note: "Diseño de esquemas y tuning de queries a escala." },
      { name: "Prisma", category: "Backend & Data", years: 1, note: "Acceso a datos tipado en el monorepo de Visma." },
      { name: "Sequelize", category: "Backend & Data", years: 4, note: "El ORM debajo de ambas plataformas de WMS." },
      { name: "Redis · BullMQ", category: "Backend & Data", years: 1, note: "Colas, cache y rate limiting distribuido." },
      { name: "MongoDB", category: "Backend & Data", years: 2, note: "Document stores donde las relaciones no eran el punto." },
      { name: "REST · Webhooks", category: "Backend & Data", years: 4, note: "Contratos entre equipos que tenían que sostenerse." },

      { name: "Domain-Driven Design", category: "Arquitectura", years: 3, note: "Bounded contexts en dominios de crédito y warehouse." },
      { name: "Clean Architecture", category: "Arquitectura", years: 3, note: "Dirección de dependencias como regla en build time." },
      { name: "BFF", category: "Arquitectura", years: 3, note: "40k requests por día a través del backend-for-frontend de Sellers." },
      { name: "Sistemas distribuidos", category: "Arquitectura", years: 3, note: "Procesamiento asíncrono, idempotencia, caminos de falla." },
      { name: "Monorepos", category: "Arquitectura", years: 2, note: "Nx y Turborepo en productos multi-app." },

      { name: "Azure", category: "Cloud & DevOps", years: 1, note: "Deployment de producción, identidad y networking." },
      { name: "Kubernetes · AKS", category: "Cloud & DevOps", years: 1, note: "Deployment de workloads y políticas de seguridad." },
      { name: "Terraform", category: "Cloud & DevOps", years: 1, note: "Infraestructura como código, revisada como código." },
      { name: "Docker", category: "Cloud & DevOps", years: 3, note: "Paridad local y pipelines de build." },
      { name: "CI/CD", category: "Cloud & DevOps", years: 3, note: "Azure DevOps y GitHub Actions, con gates de aprobación." },
      { name: "Key Vault · Managed identities", category: "Cloud & DevOps", years: 1, note: "Secretos que nunca tocan un repo." },

      { name: "Claude Code", category: "Ingeniería de IA", years: 1, note: "Orquestación multiagente en el trabajo diario." },
      { name: "Spec-Driven Development", category: "Ingeniería de IA", years: 1, note: "El método que escribí, enseño y coacheo." },
      { name: "Azure OpenAI", category: "Ingeniería de IA", years: 1, note: "Extracción de documentos en el onboarding de payroll." },
      { name: "OpenAI", category: "Ingeniería de IA", years: 2, note: "Features de IA aplicada con resultados medibles." },

      { name: "Jest", category: "Calidad", years: 4, note: "Suites de unit tests en cada servicio." },
      { name: "Vitest", category: "Calidad", years: 2, note: "Feedback más rápido en paquetes de frontend." },
      { name: "Playwright", category: "Calidad", years: 1, note: "Regresión end-to-end cuidando los flujos completos." },
      { name: "Datadog", category: "Calidad", years: 2, note: "Observabilidad y alertas de producción." },
      { name: "OpenSearch", category: "Calidad", years: 2, note: "Búsqueda de logs cuando algo ya se está incendiando." },
    ],
  },

  origins: {
    eyebrow: "06 / orígenes",
    title: "Cómo empezó",
    intro:
      "No fue una línea recta. Un pibe con una computadora heredada, un intento fallido, y después una clase que hizo que todo hiciera clic.",
    entries: [
      {
        id: "o-2011",
        year: "2011",
        title: "La primera computadora",
        body: "Mi primera computadora llegó cuando tenía doce años. Como la mayoría de los chicos, la usé para Minecraft. Nada en eso sugería una carrera.",
        photo: { src: "/origins-photo-1.webp", alt: "Nahuel de chico" },
      },
      {
        id: "o-2015",
        year: "2015",
        title: "Jarvis, y abandonar",
        body: "A los quince años armé mi propia PC y terminé viendo un tutorial de Python. Quería mi propio asistente de IA — Jarvis, el de Iron Man. No entendí casi nada, y después de un tiempo dejé.",
        photo: { src: "/origins-photo-4.webp", alt: "Foto de infancia" },
      },
      {
        id: "o-2018",
        year: "2018–2019",
        title: "Olimpíadas",
        body: "Competencias de matemática y física, hasta finales nacionales. Años de recibir un problema sin ningún método adjunto y tener que encontrar uno. Ese resultó ser el entrenamiento real.",
        photo: { src: "/origins-photo-3.webp", alt: "Foto de infancia" },
      },
      {
        id: "o-2021",
        year: "2021",
        title: "La clase que hizo clic",
        body: "Una clase de programación en el último año del colegio, y un segundo intento. Esta vez pegó. Pasé horas ayudando a compañeros a debuguear su C — el punto y coma faltante, el off-by-one — y aprendí solo una librería de GUI para una materia que solo pedía dos while loops.",
      },
      {
        id: "o-2022",
        year: "2022",
        title: "Primer trabajo, primer cuatrimestre",
        body: "Me anoté en Ingeniería en Informática y ya tenía trabajo para mi primer cuatrimestre. Lo que empezó como un pibe jugando se convirtió en una carrera dedicada a sistemas de los que otra gente depende.",
        photo: { src: "/present-photo-2.webp", alt: "Nahuel programando en pareja en Kovix" },
      },
      {
        id: "o-2024",
        year: "2023–2026",
        title: "Warehouses, y lo que cuesta el software",
        body: "Tres años en sistemas de warehouse, incluyendo tiempo en el sitio con casco. Cuando tu código se detiene, la mercadería física se detiene. Cambia cómo pensás un deploy.",
        photo: { src: "/present-photo-3.webp", alt: "Nahuel en el warehouse" },
      },
      {
        id: "o-2026",
        year: "2026",
        title: "Enseñando el método",
        body: "Ahora lidero la habilitación de ingeniería de IA: escribiendo el método, coacheando equipos a través de él, y manteniendo el gate humano donde corresponde.",
        photo: { src: "/present-photo-4.webp", alt: "Nahuel trabajando con un compañero" },
      },
    ],
  },

  proof: {
    eyebrow: "07 / logros",
    title: "Logros",
    intro:
      "Certificaciones, títulos y una década de competencias de matemática y física. Las olimpíadas son más viejas que el código, y son la razón por la que me gustan los problemas que no vienen con un método adjunto.",
    counterLabel: "desbloqueados",
    filters: [
      { id: "all", label: "Todos" },
      { id: "certification", label: "Certificaciones" },
      { id: "olympiad", label: "Olimpíadas" },
      { id: "degree", label: "Educación" },
    ],
    items: [
      { id: "a-eng", title: "Ingeniería en Informática — 4to año", issuer: "Universidad de Morón", year: "2022–", kind: "degree", rarity: "epic" },
      { id: "a-analyst", title: "Analista de Sistemas — completo", issuer: "Universidad de Morón", year: "2025", kind: "degree", rarity: "epic" },
      { id: "a-scholar", title: "Beca al mérito — promedio superior a 8.5", issuer: "Universidad de Morón", year: "2022–", kind: "degree", rarity: "rare" },
      { id: "a-tech", title: "Técnico Electromecánico", issuer: "Colegio Emaús", year: "2021", kind: "degree", rarity: "common" },

      { id: "a-efset", title: "EF SET English — C2 Proficient", issuer: "EF Education First", year: "2026", kind: "certification", rarity: "legendary" },
      { id: "a-arch-applied", title: "Arquitectura de Software Aplicada", issuer: "Platzi", year: "2026", kind: "certification", rarity: "rare" },
      { id: "a-arch-fund-26", title: "Fundamentos de Arquitectura de Software", issuer: "Platzi", year: "2026", kind: "certification", rarity: "common" },
      { id: "a-liceo-7", title: "Inglés avanzado — Nivel 7", issuer: "Liceo Cultural Británico", year: "2025", kind: "certification", rarity: "rare" },
      { id: "a-liceo-6", title: "Inglés avanzado — Nivel 6", issuer: "Liceo Cultural Británico", year: "2025", kind: "certification", rarity: "common" },
      { id: "a-arch-fund-23", title: "Fundamentos de Arquitectura de Software", issuer: "Platzi", year: "2023", kind: "certification", rarity: "common" },
      { id: "a-eng-fund", title: "Fundamentos de Ingeniería de Software", issuer: "Platzi", year: "2023", kind: "certification", rarity: "common" },
      { id: "a-fcc", title: "Diseño Web Responsivo", issuer: "freeCodeCamp", year: "2022", kind: "certification", rarity: "common" },

      { id: "a-oaf", title: "Finalista nacional — Olimpíada de Física, categoría Juegos", issuer: "OAF Argentina", year: "2019", kind: "olympiad", rarity: "legendary" },
      { id: "a-mateclubes-18", title: "Subcampeón nacional — Mateclubes", issuer: "OMA Argentina", year: "2018", kind: "olympiad", rarity: "legendary" },
      { id: "a-lit-math", title: "Finalista nacional — Literatura y Matemática", issuer: "OMA Argentina", year: "2018", kind: "olympiad", rarity: "epic" },
      { id: "a-mateclubes-17", title: "Finalista nacional — Mateclubes", issuer: "OMA Argentina", year: "2017", kind: "olympiad", rarity: "epic" },
      { id: "a-oma-19", title: "Ronda metropolitana — Olimpíada de Matemática", issuer: "OMA Argentina", year: "2019", kind: "olympiad", rarity: "rare" },
      { id: "a-oma-18", title: "Ronda metropolitana — Olimpíada de Matemática", issuer: "OMA Argentina", year: "2018", kind: "olympiad", rarity: "rare" },
      { id: "a-emat-sci-19", title: "Campeón — Desafíos Científicos", issuer: "Colegio Emaús", year: "2019", kind: "olympiad", rarity: "rare" },
      { id: "a-emat-3-19", title: "Campeón — Tercera ronda", issuer: "Colegio Emaús", year: "2019", kind: "olympiad", rarity: "common" },
      { id: "a-emat-2-19", title: "Campeón — Segunda ronda", issuer: "Colegio Emaús", year: "2019", kind: "olympiad", rarity: "common" },
      { id: "a-emat-1-19", title: "Subcampeón — Primera ronda", issuer: "Colegio Emaús", year: "2019", kind: "olympiad", rarity: "common" },
      { id: "a-emat-sci-18", title: "Campeón — Desafíos Científicos", issuer: "Colegio Emaús", year: "2018", kind: "olympiad", rarity: "rare" },
      { id: "a-emat-2-18", title: "Campeón — Segunda ronda", issuer: "Colegio Emaús", year: "2018", kind: "olympiad", rarity: "common" },
      { id: "a-emat-3r-18", title: "Segundo subcampeón — Tercera ronda", issuer: "Colegio Emaús", year: "2018", kind: "olympiad", rarity: "common" },
      { id: "a-emat-1r-18", title: "Segundo subcampeón — Primera ronda", issuer: "Colegio Emaús", year: "2018", kind: "olympiad", rarity: "common" },
      { id: "a-emat-17", title: "Campeón — Ematemática", issuer: "Colegio Emaús", year: "2017", kind: "olympiad", rarity: "rare" },
    ],
  },

  contact: {
    eyebrow: "08 / contacto",
    title: "Hablemos",
    body:
      "Estoy abierto a roles remotos e internacionales donde los problemas sean lo bastante difíciles como para ser interesantes y el equipo le importe cómo se construyen las cosas. Radicado en Buenos Aires, ya trabajando entre husos horarios.",
    primary: { label: "Enviar un email", href: "mailto:nahuelgamail@gmail.com" },
    copyLabel: "copiar dirección",
    copiedLabel: "copiado",
    localTimeLabel: "hora local",
  },

  footer: {
    builtWith: "Construido con",
    stack: "Next.js · React · TypeScript · Tailwind · WebGL · GSAP",
    repo: "Código fuente",
    note: "Sin capturas de sistemas de clientes. Cada diagrama de este sitio fue dibujado para él.",
  },

  ui: {
    commandPalette: {
      open: "Menú",
      placeholder: "Saltá a una sección, o escribí un comando…",
      empty: "No hay coincidencias.",
      groups: { navigate: "Navegar", actions: "Acciones" },
      switchLocale: "View in English",
      downloadCv: "Descargar CV",
      close: "Cerrar",
    },
    localeLabel: "EN",
    menu: "Menú",
    sections: [
      { id: "hero", label: "Inicio" },
      { id: "telemetry", label: "Telemetría" },
      { id: "work", label: "Trabajo" },
      { id: "lab", label: "Lab" },
      { id: "method", label: "Método" },
      { id: "arsenal", label: "Arsenal" },
      { id: "origins", label: "Orígenes" },
      { id: "proof", label: "Logros" },
      { id: "contact", label: "Contacto" },
    ],
  },
}
