// All portfolio content lives here.

export const profile = {
  name: 'Reddy Lakshman Revanth',
  handle: '', // e.g. your GitHub username — shown as @handle when set
  timezone: 'Asia/Kolkata',
  avatar: '', // e.g. '/avatar.jpg' placed in /public — falls back to initials
  roles: ['Specialist Programmer @ Infosys', 'Agentic AI Developer', 'Flutter Developer', 'Full-Stack Developer'],
  bio: 'Specialist Programmer at Infosys. I work across agentic AI (Python, FastAPI, LangChain, LangGraph) and Flutter & full-stack development, building apps end to end.',
  highlights: [
    'Specialist Programmer at Infosys — promoted to full-time after training',
    'Engineer Intern at Samsung PRISM — image captioning & hashtag generation with CNN-LSTM and T5',
    'Building dsarecx (spaced-repetition DSA tracker), Kosh (Android finance app) and CheckLater (Chrome extension)',
    'B.Tech CSE (Software Engineering), SRM IST · CGPA 8.65/10',
  ],
  email: 'revanth3527@gmail.com',
  calLink: '', // e.g. 'https://cal.com/yourhandle' — shows "Book an intro call" when set
  resume: 'resume.pdf', // file lives in public/ — set to '' to hide the Résumé section
  github: '', // GitHub username — enables the contribution heatmap
}

export const socials = [
  { label: 'Email', href: 'mailto:revanth3527@gmail.com', icon: 'mail' },
  // { label: 'GitHub', href: 'https://github.com/yourhandle', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/reddy-lakshman-revanth-796040247/', icon: 'linkedin' },
  { label: 'Resume', href: 'resume.pdf', icon: 'resume' },
]

export const experiences = [
  {
    company: 'Infosys',
    logo: 'I',
    role: 'Trainee → Specialist Programmer · Full-time',
    mode: 'On-site',
    period: 'Jun 2026 — Present',
    // Current role — details of ongoing work are kept confidential; only training is described
    points: [
      'Completed intensive technical training at Infosys Mysore (Jun — Aug 2026), strengthening core engineering skills and professional practices.',
      'Promoted to a full-time Specialist Programmer after successfully completing training.',
    ],
    project: {
      title: 'Discharge Summary Agent',
      context: 'Training project · Infosys Mysore',
      points: [
        'Built a generative & agentic AI application using Python, LangChain and LangGraph.',
        'Designed RAG-based workflows with document retrieval, tool calling, structured outputs, conditional routing and state-based agent orchestration.',
        'Gained hands-on experience with LLMs, prompt engineering, tool integration, evaluation and Langfuse-based observability for enterprise-oriented AI solutions.',
      ],
      tags: ['Python', 'LangChain', 'LangGraph', 'FastAPI'],
    },
    tags: ['Python', 'FastAPI', 'LangChain', 'LangGraph', 'Agentic AI', 'RAG', 'LLMs', 'Langfuse'],
    stats: [
      { value: '3 mo', label: 'Training at Mysore' },
      { value: '→ SP', label: 'Promoted to full-time' },
    ],
    link: 'https://www.linkedin.com/feed/update/urn:li:activity:7507681419779989506/',
  },
  {
    company: 'Infosys',
    logo: 'I',
    role: 'Intern · Agentic AI',
    mode: 'On-site',
    period: 'Jan 2026 — Apr 2026',
    points: [
      'Went through an intensive learning phase at Infosys Mysore covering Python, FastAPI, LangChain, LLMs and agentic AI, with regular assessments.',
      'In the project phase, explored and extended DeepWiki — modifying it and evaluating how it could be adapted for real-world enterprise use cases.',
      'Worked in a production-style environment under mentorship, learning to break down problems and build like a real engineering team.',
    ],
    tags: ['Python', 'FastAPI', 'LangChain', 'LLMs', 'Agentic AI', 'DeepWiki'],
    stats: [
      { value: '3.5 mo', label: 'Internship' },
      { value: '1', label: 'Enterprise project: DeepWiki' },
    ],
    link: '',
  },
  {
    company: 'Samsung',
    logo: 'S',
    role: 'Engineer Intern · Samsung PRISM',
    mode: 'Remote',
    period: 'May 2024 — Jan 2025',
    points: [
      'Worked on an AI system that generates image captions using a CNN-LSTM model (InceptionV3 + LSTM), then extracts hashtags from those captions with a Transformer model (T5).',
      'Assisted in training the models and preprocessing image and text data.',
      'Tuned the Transformer model for improved hashtag prediction accuracy.',
    ],
    tags: ['Python', 'InceptionV3', 'LSTM', 'T5 Transformer', 'Computer Vision', 'NLP'],
    stats: [
      { value: '9 mo', label: 'Internship' },
      { value: '2', label: 'Models: CNN-LSTM + T5' },
    ],
    link: '',
  },
]

export const projects = [
  {
    title: 'dsarecx · DSA Recall',
    status: 'Live',
    description: 'Open-source spaced-repetition tracker for interview prep. Add a problem once and it schedules reviews at growing intervals (3 → 7 → 14 → 30 days), adjusting to how well you recalled it. Auto-fills details from 18,000+ LeetCode, Codeforces, GFG, HackerRank and CodeChef problems, and includes a 58-concept system design library with AI-generated recall questions.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Neon Postgres', 'Vercel'],
    href: 'https://github.com/lakshmanrevanth/dsarecx',
    live: 'https://dsarecx.vercel.app',
    hue: 150,
  },
  {
    title: 'Kosh · Personal Finance',
    status: 'In progress',
    ongoing: true,
    description: 'Offline-first Android app that tracks expenses, bank balances, EMIs and loans in one place. It records UPI and bank transactions automatically from SMS and includes budgets, net worth, reports and a home-screen widget. Data backs up to Firebase and can sync to Google Sheets.',
    tags: ['Kotlin', 'Jetpack Compose', 'Room', 'WorkManager', 'Firebase'],
    href: 'https://github.com/lakshmanrevanth/kosh-finance',
    hue: 30,
  },
  {
    title: 'CheckLater · Save Links',
    status: 'Live',
    description: 'Chrome extension and installable web app (PWA) for saving links now and opening them later on any device. One sync code replaces passwords. It sorts links into categories automatically, removes tracking parameters, syncs live and works offline.',
    tags: ['JavaScript', 'Chrome Extension', 'PWA', 'Firebase'],
    href: 'https://github.com/lakshmanrevanth/check-later-extension',
    live: 'https://laterbeam.web.app/',
    hue: 240,
  },
  {
    title: 'Play-T · Transfer Music',
    status: 'Completed',
    description: 'Cross-platform app to transfer playlists between music streaming platforms via a shareable link, backed by secure REST APIs with token-based access control and validated playlist mappings.',
    tags: ['Flutter', 'Supabase', 'Provider', 'REST API', 'MVC'],
    href: 'https://github.com/lakshmanrevanth/PlayT-A-Platform-To-Transfer-Playlists',
    hue: 280,
  },
  {
    title: 'NoteMate',
    status: 'Completed',
    description: 'Finance management app that tracks payment data and EMI history, with SQL aggregation, CRUD REST APIs and dashboards summarising lender–borrower transactions.',
    tags: ['Flutter', 'Supabase', 'SQL', 'REST API', 'MVC'],
    href: 'https://github.com/lakshmanrevanth/NoteMate',
    hue: 160,
  },
  {
    title: 'Handy Cursor',
    status: 'Completed',
    description: 'Windows app that turns your webcam into a touchless, hand-gesture controlled virtual mouse using real-time hand tracking.',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'PyAutoGUI'],
    href: '',
    hue: 20,
  },
]

// Sections below are hidden while empty — fill them in to show them.
export const hackathons = []
export const dsa = []

export const skills = {
  Languages: ['C++', 'Python', 'JavaScript', 'C', 'SQL'],
  Frameworks: ['Flutter', 'Node.js', 'Express.js', 'FastAPI', 'LangChain', 'LangGraph', 'HTML', 'CSS'],
  'Databases & Backend': ['Supabase', 'Firebase', 'MongoDB', 'PostgreSQL', 'MySQL'],
  Tools: ['Git', 'Figma', 'Postman'],
  'AI / ML & Vision': ['Agentic AI', 'InceptionV3', 'LSTM', 'T5', 'OpenCV', 'MediaPipe'],
}

export const education = {
  school: 'SRM Institute of Science and Technology, Kattankulathur',
  degree: 'B.Tech · Computer Science and Engineering — Software Engineering · CGPA 8.65/10',
  period: 'Class of 2026',
  coursework: ['Data Structures & Algorithms', 'OOPS', 'Software Design Principles', 'DBMS', 'Operating Systems', 'Machine Learning', 'Software Engineering'],
}

export const certifications = [
  { name: 'The Web Developer Bootcamp 2025', issuer: 'Udemy · Jul 2025', href: '' },
  { name: 'Flutter & Dart — The Complete Guide [2024 Edition]', issuer: 'Udemy · Jun 2024', href: '' },
  { name: 'DBMS Course — Master the Fundamental and Advanced Concepts', issuer: 'Scaler · May 2024', href: '' },
]

export const interests = { watching: [], music: [] }
export const highlights = []

export const quote = {
  text: 'Simplicity is prerequisite for reliability.',
  author: 'Edsger W. Dijkstra',
}
