// All portfolio content lives here.

export const profile = {
  name: 'Reddy Lakshman Revanth',
  handle: '', // e.g. your GitHub username — shown as @handle when set
  location: 'Chennai, India',
  timezone: 'Asia/Kolkata',
  avatar: '', // e.g. '/avatar.jpg' placed in /public — falls back to initials
  roles: ['Software Engineer', 'Flutter Developer', 'Full-Stack Developer', 'ML Enthusiast'],
  bio: 'Computer Science (Software Engineering) student at SRM IST building cross-platform apps with Flutter, Node.js and Supabase — with hands-on AI experience from Samsung PRISM.',
  highlights: [
    'Engineer Intern at Samsung PRISM — image captioning & hashtag generation with CNN-LSTM and T5',
    'Built cross-platform apps (Play-T, NoteMate) and a gesture-controlled virtual mouse',
    'B.Tech CSE (Software Engineering), SRM IST · CGPA 8.65/10',
  ],
  email: 'lr3782@srmist.edu.in',
  calLink: '', // e.g. 'https://cal.com/yourhandle' — shows "Book an intro call" when set
  resume: '/resume.pdf',
  github: '', // GitHub username — enables the contribution heatmap
}

export const socials = [
  { label: 'Email', href: 'mailto:lr3782@srmist.edu.in', icon: 'mail' },
  // { label: 'GitHub', href: 'https://github.com/yourhandle', icon: 'github' },
  // { label: 'LinkedIn', href: 'https://linkedin.com/in/yourhandle', icon: 'linkedin' },
  { label: 'Resume', href: '/resume.pdf', icon: 'resume' },
]

export const experiences = [
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
    title: 'Play-T · Transfer Music',
    status: 'Completed',
    description: 'Cross-platform app to transfer playlists between music streaming platforms via a shareable link, backed by secure REST APIs with token-based access control and validated playlist mappings.',
    tags: ['Flutter', 'Supabase', 'Provider', 'REST API', 'MVC'],
    href: '', // add the GitHub repo URL
    hue: 280,
  },
  {
    title: 'NoteMate',
    status: 'Completed',
    description: 'Finance management app that tracks payment data and EMI history, with SQL aggregation, CRUD REST APIs and dashboards summarising lender–borrower transactions.',
    tags: ['Flutter', 'Supabase', 'SQL', 'REST API', 'MVC'],
    href: '', // add the GitHub repo URL
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
  Languages: ['C++', 'JavaScript', 'Python', 'C', 'C#', 'SQL'],
  'Frameworks & Web': ['Flutter', 'Node.js', 'Express.js', '.NET', 'HTML', 'CSS'],
  'Databases & Backend': ['Supabase', 'Firebase', 'MongoDB', 'PostgreSQL', 'MySQL'],
  Tools: ['Git', 'Figma', 'Postman'],
  'AI / ML & Vision': ['InceptionV3', 'LSTM', 'T5', 'OpenCV', 'MediaPipe'],
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
