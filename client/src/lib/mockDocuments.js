const createDocument = (document) => ({
  ...document,
  commentsCount: document.comments.length,
});

export const knowledgeBaseSubjects = [
  "All",
  "Biology",
  "History",
  "Mathematics",
  "English",
  "Chemistry",
  "Physics",
];

export const mockDocuments = [
  createDocument({
    id: "introduction-to-photosynthesis",
    type: "PDF",
    subject: "Biology",
    title: "Introduction to Photosynthesis",
    description:
      "Learn about the process by which plants convert light energy into chemical energy, including the light-dependent and light-independent stages.",
    category: "Plant Biology",
    author: "Dr. Smith",
    date: "Apr 6, 2026",
    publishedAgo: "2 hours ago",
    views: 145,
    downloads: 62,
    comments: [
      {
        id: 1,
        author: "Linh Nguyen",
        role: "student",
        date: "Apr 6, 2026",
        content:
          "The chloroplast diagram made the lesson much easier to review before class.",
      },
      {
        id: 2,
        author: "Noah Park",
        role: "student",
        date: "Apr 7, 2026",
        content:
          "Could you also share a quick summary comparing photosynthesis and respiration?",
      },
      {
        id: 3,
        author: "Dr. Smith",
        role: "teacher",
        date: "Apr 7, 2026",
        content:
          "Yes, I will upload a comparison sheet in the biology section this week.",
      },
    ],
  }),
  createDocument({
    id: "world-war-ii-key-events-timeline",
    type: "PDF",
    subject: "History",
    title: "World War II: Key Events Timeline",
    description:
      "A comprehensive timeline of major events during World War II, from the invasion of Poland to the atomic bombings.",
    category: "Modern History",
    author: "Prof. Johnson",
    date: "Apr 5, 2026",
    publishedAgo: "5 hours ago",
    views: 89,
    downloads: 48,
    comments: [
      {
        id: 1,
        author: "Mai Tran",
        role: "student",
        date: "Apr 6, 2026",
        content:
          "The timeline layout helped me connect the European and Pacific events more clearly.",
      },
      {
        id: 2,
        author: "Daniel Scott",
        role: "student",
        date: "Apr 7, 2026",
        content:
          "Can we also get a separate map-based resource for the major campaigns?",
      },
      {
        id: 3,
        author: "Prof. Johnson",
        role: "teacher",
        date: "Apr 7, 2026",
        content:
          "That is a good idea. I will add a companion map resource after this lesson.",
      },
    ],
  }),
  createDocument({
    id: "quadratic-equations-explained",
    type: "PDF",
    subject: "Mathematics",
    title: "Quadratic Equations Explained",
    description:
      "Master the quadratic formula and learn several methods for solving quadratic equations, including factoring and completing the square.",
    category: "Algebra",
    author: "Ms. Chen",
    date: "Apr 4, 2026",
    publishedAgo: "1 day ago",
    views: 234,
    downloads: 93,
    comments: [
      {
        id: 1,
        author: "Alex Kim",
        role: "student",
        date: "Apr 5, 2026",
        content:
          "The worked examples were really helpful, especially the completing-the-square section.",
      },
      {
        id: 2,
        author: "Maria Garcia",
        role: "student",
        date: "Apr 6, 2026",
        content:
          "Could you add a few challenge exercises with answer keys for extra practice?",
      },
      {
        id: 3,
        author: "Ms. Chen",
        role: "teacher",
        date: "Apr 6, 2026",
        content:
          "I will upload a short practice worksheet tomorrow so you can review before the quiz.",
      },
    ],
  }),
  createDocument({
    id: "shakespeares-sonnets-analysis",
    type: "PDF",
    subject: "English",
    title: "Shakespeare's Sonnets Analysis",
    description:
      "Deep dive into the themes, structure, and literary devices used in Shakespeare's most famous sonnets.",
    category: "Literature",
    author: "Dr. Williams",
    date: "Apr 3, 2026",
    publishedAgo: "2 days ago",
    views: 67,
    downloads: 31,
    comments: [
      {
        id: 1,
        author: "Grace Lee",
        role: "student",
        date: "Apr 4, 2026",
        content:
          "The explanation of imagery and tone helped me understand Sonnet 18 much better.",
      },
      {
        id: 2,
        author: "Huy Pham",
        role: "student",
        date: "Apr 5, 2026",
        content:
          "Can you recommend which sonnets are best to compare for the next discussion post?",
      },
      {
        id: 3,
        author: "Dr. Williams",
        role: "teacher",
        date: "Apr 5, 2026",
        content:
          "Try comparing Sonnets 18 and 130. They work well together for theme analysis.",
      },
    ],
  }),
  createDocument({
    id: "chemical-bonding-basics",
    type: "PDF",
    subject: "Chemistry",
    title: "Chemical Bonding Basics",
    description:
      "Understand ionic, covalent, and metallic bonding with clear diagrams and classroom examples.",
    category: "Chemical Bonding",
    author: "Dr. Patel",
    date: "Apr 2, 2026",
    publishedAgo: "3 days ago",
    views: 118,
    downloads: 54,
    comments: [
      {
        id: 1,
        author: "Kevin Hoang",
        role: "student",
        date: "Apr 3, 2026",
        content:
          "The Lewis structure examples were easy to follow and useful for homework review.",
      },
      {
        id: 2,
        author: "Emma Brown",
        role: "student",
        date: "Apr 4, 2026",
        content:
          "A short section on bond polarity would make this note even more complete.",
      },
      {
        id: 3,
        author: "Dr. Patel",
        role: "teacher",
        date: "Apr 4, 2026",
        content:
          "I agree. I will extend this note with polarity examples in the next update.",
      },
    ],
  }),
  createDocument({
    id: "newtons-laws-of-motion",
    type: "VIDEO",
    subject: "Physics",
    title: "Newton's Laws of Motion",
    description:
      "Watch a concise lesson on inertia, force, and acceleration with everyday motion examples.",
    category: "Mechanics",
    author: "Prof. Davis",
    date: "Apr 1, 2026",
    publishedAgo: "4 days ago",
    views: 102,
    downloads: 40,
    comments: [
      {
        id: 1,
        author: "Tuan Bui",
        role: "student",
        date: "Apr 2, 2026",
        content:
          "The skateboard example made the first law much easier to remember.",
      },
      {
        id: 2,
        author: "Sophia White",
        role: "student",
        date: "Apr 3, 2026",
        content:
          "Could we have a follow-up video focused on free-body diagrams next?",
      },
      {
        id: 3,
        author: "Prof. Davis",
        role: "teacher",
        date: "Apr 3, 2026",
        content:
          "Yes, I am preparing one and will upload it to the physics materials section soon.",
      },
    ],
  }),
  createDocument({
    id: "calculus-fundamentals",
    type: "PDF",
    subject: "Mathematics",
    title: "Calculus Fundamentals",
    description:
      "Review limits, derivatives, and integrals with guided examples designed for first-year students.",
    category: "Calculus",
    author: "Prof. Michael Chen",
    date: "Mar 31, 2026",
    publishedAgo: "1 week ago",
    views: 156,
    downloads: 78,
    comments: [
      {
        id: 1,
        author: "Nhat Minh",
        role: "student",
        date: "Apr 1, 2026",
        content:
          "The derivative rules summary is perfect for quick revision before exercises.",
      },
      {
        id: 2,
        author: "Maria Garcia",
        role: "student",
        date: "Apr 2, 2026",
        content:
          "Can you upload another set of problems on applications of derivatives?",
      },
      {
        id: 3,
        author: "Prof. Michael Chen",
        role: "teacher",
        date: "Apr 2, 2026",
        content:
          "Yes, I will post a supplementary practice set later this week.",
      },
    ],
  }),
];

export const getSubjectSummaries = () =>
  knowledgeBaseSubjects
    .filter((subject) => subject !== "All")
    .map((subject) => {
      const subjectDocuments = mockDocuments.filter(
        (document) => document.subject === subject
      );

      return {
        subject,
        count: subjectDocuments.length,
        views: subjectDocuments.reduce(
          (sum, document) => sum + document.views,
          0
        ),
      };
    })
    .filter((summary) => summary.count > 0);

export const getDocumentById = (documentId) =>
  mockDocuments.find((document) => document.id === documentId);
