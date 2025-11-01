export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  rating: number;
  author: string;
  date: string;
  usageCount: number;
  comments: Comment[];
  versions: Version[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  rating: number;
}

export interface Version {
  id: string;
  author: string;
  date: string;
  changes: string;
}

export const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "Code Review Assistant",
    description: "Comprehensive prompt for conducting thorough code reviews with focus on best practices and security",
    content: "You are an expert code reviewer. Review the following code and provide feedback on:\n1. Code quality and readability\n2. Potential bugs or security issues\n3. Performance optimizations\n4. Best practices adherence\n5. Suggested improvements\n\n[CODE HERE]",
    tags: ["code-review", "development", "quality-assurance"],
    rating: 4.8,
    author: "Sarah Chen",
    date: "2024-01-15",
    usageCount: 342,
    comments: [
      {
        id: "c1",
        author: "Mike Johnson",
        content: "This prompt has been incredibly helpful for our team's code review process. Saved us hours!",
        date: "2024-01-20",
        rating: 5
      }
    ],
    versions: [
      {
        id: "v1",
        author: "Sarah Chen",
        date: "2024-01-15",
        changes: "Initial version"
      }
    ]
  },
  {
    id: "2",
    title: "Test Case Generator",
    description: "Generate comprehensive test cases for any feature or function, including edge cases and boundary conditions",
    content: "Generate comprehensive test cases for the following feature/function:\n\nFeature: [FEATURE DESCRIPTION]\n\nInclude:\n- Happy path scenarios\n- Edge cases\n- Boundary conditions\n- Error handling scenarios\n- Integration test scenarios",
    tags: ["testing", "qa", "automation"],
    rating: 4.6,
    author: "Alex Kumar",
    date: "2024-01-18",
    usageCount: 287,
    comments: [],
    versions: [
      {
        id: "v1",
        author: "Alex Kumar",
        date: "2024-01-18",
        changes: "Initial version"
      }
    ]
  },
  {
    id: "3",
    title: "Sprint Planning Helper",
    description: "Facilitates sprint planning by breaking down user stories and estimating effort",
    content: "Help break down the following user story into actionable tasks:\n\nUser Story: [STORY HERE]\n\nFor each task, provide:\n- Clear description\n- Estimated effort (story points)\n- Dependencies\n- Acceptance criteria\n- Potential risks",
    tags: ["agile", "scrum", "planning"],
    rating: 4.7,
    author: "Rachel Martinez",
    date: "2024-01-22",
    usageCount: 195,
    comments: [],
    versions: [
      {
        id: "v1",
        author: "Rachel Martinez",
        date: "2024-01-22",
        changes: "Initial version"
      }
    ]
  },
  {
    id: "4",
    title: "API Documentation Generator",
    description: "Create clear and comprehensive API documentation from code or specifications",
    content: "Generate detailed API documentation for the following endpoint:\n\nEndpoint: [ENDPOINT]\nMethod: [METHOD]\nDescription: [DESCRIPTION]\n\nInclude:\n- Request format (headers, parameters, body)\n- Response format\n- Status codes\n- Error handling\n- Example requests and responses\n- Rate limiting information",
    tags: ["documentation", "api", "development"],
    rating: 4.9,
    author: "David Park",
    date: "2024-01-25",
    usageCount: 423,
    comments: [],
    versions: [
      {
        id: "v1",
        author: "David Park",
        date: "2024-01-25",
        changes: "Initial version"
      }
    ]
  },
  {
    id: "5",
    title: "Bug Report Generator",
    description: "Structure detailed bug reports with reproduction steps and system information",
    content: "Create a detailed bug report for the following issue:\n\nIssue: [DESCRIBE ISSUE]\n\nInclude:\n- Summary\n- Steps to reproduce\n- Expected behavior\n- Actual behavior\n- System information\n- Screenshots/logs if applicable\n- Priority level\n- Suggested fix (if known)",
    tags: ["testing", "bug-tracking", "qa"],
    rating: 4.5,
    author: "Emma Wilson",
    date: "2024-01-28",
    usageCount: 256,
    comments: [],
    versions: [
      {
        id: "v1",
        author: "Emma Wilson",
        date: "2024-01-28",
        changes: "Initial version"
      }
    ]
  },
  {
    id: "6",
    title: "Marketing Copy Creator",
    description: "Generate engaging marketing copy for various channels and audiences",
    content: "Create compelling marketing copy for:\n\nProduct/Service: [NAME]\nTarget Audience: [AUDIENCE]\nChannel: [email/social/web/ad]\nTone: [professional/casual/urgent/friendly]\n\nInclude:\n- Attention-grabbing headline\n- Value proposition\n- Key benefits (3-5)\n- Call to action\n- Optional: Social proof",
    tags: ["marketing", "content", "copywriting"],
    rating: 4.4,
    author: "Lisa Thompson",
    date: "2024-02-01",
    usageCount: 312,
    comments: [],
    versions: [
      {
        id: "v1",
        author: "Lisa Thompson",
        date: "2024-02-01",
        changes: "Initial version"
      }
    ]
  }
];

export const popularTags = [
  "code-review",
  "testing",
  "development",
  "documentation",
  "agile",
  "scrum",
  "qa",
  "marketing",
  "api",
  "automation",
  "bug-tracking",
  "planning",
  "copywriting",
  "content"
];
