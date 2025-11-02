import "reflect-metadata";
import { DataSource } from "typeorm";
import { Prompt } from "./entity/Prompt";
import { Comment } from "./entity/Comment";
import { Version } from "./entity/Version";
import { Star } from "./entity/Star";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [Prompt, Comment, Version, Star]
});

const mockPrompts = [
  {
    title: "Code Review Assistant",
    description: "Comprehensive prompt for conducting thorough code reviews with focus on best practices and security",
    content: "You are an expert code reviewer. Review the following code and provide feedback on:\n1. Code quality and readability\n2. Potential bugs or security issues\n3. Performance optimizations\n4. Best practices adherence\n5. Suggested improvements\n\n[CODE HERE]",
    tags: ["code-review", "development", "quality-assurance"],
    rating: 4.8,
    author: "Sarah Chen",
    date: new Date("2024-01-15"),
    usageCount: 342,
  },
  {
    title: "Test Case Generator",
    description: "Generate comprehensive test cases for any feature or function, including edge cases and boundary conditions",
    content: "Generate comprehensive test cases for the following feature/function:\n\nFeature: [FEATURE DESCRIPTION]\n\nInclude:\n- Happy path scenarios\n- Edge cases\n- Boundary conditions\n- Error handling scenarios\n- Integration test scenarios",
    tags: ["testing", "qa", "automation"],
    rating: 4.6,
    author: "Alex Kumar",
    date: new Date("2024-01-18"),
    usageCount: 287,
  },
  {
    title: "Sprint Planning Helper",
    description: "Facilitates sprint planning by breaking down user stories and estimating effort",
    content: "Help break down the following user story into actionable tasks:\n\nUser Story: [STORY HERE]\n\nFor each task, provide:\n- Clear description\n- Estimated effort (story points)\n- Dependencies\n- Acceptance criteria\n- Potential risks",
    tags: ["agile", "scrum", "planning"],
    rating: 4.7,
    author: "Rachel Martinez",
    date: new Date("2024-01-22"),
    usageCount: 195,
  },
  {
    title: "API Documentation Generator",
    description: "Create clear and comprehensive API documentation from code or specifications",
    content: "Generate detailed API documentation for the following endpoint:\n\nEndpoint: [ENDPOINT]\nMethod: [METHOD]\nDescription: [DESCRIPTION]\n\nInclude:\n- Request format (headers, parameters, body)\n- Response format\n- Status codes\n- Error handling\n- Example requests and responses\n- Rate limiting information",
    tags: ["documentation", "api", "development"],
    rating: 4.9,
    author: "David Park",
    date: new Date("2024-01-25"),
    usageCount: 423,
  },
  {
    title: "Bug Report Generator",
    description: "Structure detailed bug reports with reproduction steps and system information",
    content: "Create a detailed bug report for the following issue:\n\nIssue: [DESCRIBE ISSUE]\n\nInclude:\n- Summary\n- Steps to reproduce\n- Expected behavior\n- Actual behavior\n- System information\n- Screenshots/logs if applicable\n- Priority level\n- Suggested fix (if known)",
    tags: ["testing", "bug-tracking", "qa"],
    rating: 4.5,
    author: "Emma Wilson",
    date: new Date("2024-01-28"),
    usageCount: 256,
  }
];

const seedDatabase = async () => {
  try {
    // Only initialize if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection initialized");
    }

    const promptRepository = AppDataSource.getRepository(Prompt);
    const commentRepository = AppDataSource.getRepository(Comment);
    const versionRepository = AppDataSource.getRepository(Version);
    const starRepository = AppDataSource.getRepository(Star);
    
    // Clear existing data in correct order (child tables first)
    await commentRepository.clear();
    await versionRepository.clear();
    await starRepository.clear();
    await promptRepository.clear();
    console.log("Cleared existing data");

    // Insert mock prompts
    
    for (const prompt of mockPrompts) {
      const entity = promptRepository.create(prompt);
      const savedPrompt = await promptRepository.save(entity);
      console.log(`Created prompt: ${prompt.title}`);
      
      // Add initial version for each prompt
      const version = versionRepository.create({
        author: prompt.author,
        date: prompt.date,
        changes: "Initial version",
        prompt: savedPrompt
      });
      await versionRepository.save(version);
      console.log(`Created initial version for: ${prompt.title}`);
    }
    
    console.log("Successfully seeded database with mock prompts");
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
};

seedDatabase();