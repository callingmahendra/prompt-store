import "reflect-metadata";
import { DataSource } from "typeorm";
import { Prompt } from "./entity/Prompt";
import { Comment } from "./entity/Comment";
import { Version } from "./entity/Version";
import { Star } from "./entity/Star";
import * as fs from "fs";
import * as path from "path";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [Prompt, Comment, Version, Star]
});

interface PromptMetadata {
  mode?: string;
  description?: string;
  tools?: string[];
  tested_with?: string;
  [key: string]: any;
}

function parseMarkdownFile(filePath: string): {
  metadata: PromptMetadata;
  content: string;
  title: string;
} {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Extract frontmatter if it exists
  let metadata: PromptMetadata = {};
  let content = fileContent;
  
  if (fileContent.startsWith('---')) {
    const frontmatterEnd = fileContent.indexOf('---', 3);
    if (frontmatterEnd !== -1) {
      const frontmatter = fileContent.slice(3, frontmatterEnd).trim();
      content = fileContent.slice(frontmatterEnd + 3).trim();
      
      // Parse YAML-like frontmatter
      frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.slice(0, colonIndex).trim();
          let value = line.slice(colonIndex + 1).trim();
          
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          
          // Handle arrays
          if (value.startsWith('[') && value.endsWith(']')) {
            try {
              metadata[key] = JSON.parse(value);
            } catch {
              metadata[key] = value;
            }
          } else {
            metadata[key] = value;
          }
        }
      });
    }
  }
  
  // Extract title from filename or first heading
  const fileName = path.basename(filePath, '.prompt.md');
  let title = fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Try to find a better title from the content
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    title = headingMatch[1];
  }
  
  return { metadata, content, title };
}

function extractTags(metadata: PromptMetadata, content: string): string[] {
  const tags: string[] = [];
  
  // Add tags from metadata
  if (metadata.mode) tags.push(metadata.mode);
  if (metadata.tools && Array.isArray(metadata.tools)) {
    tags.push(...metadata.tools);
  }
  
  // Extract common programming languages and technologies from content
  const techKeywords = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'c#', 'go', 'rust',
    'php', 'ruby', 'swift', 'kotlin', 'sql', 'postgresql', 'mysql', 'mongodb',
    'react', 'vue', 'angular', 'node', 'express', 'spring', 'django', 'flask',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'github', 'gitlab',
    'testing', 'jest', 'junit', 'pytest', 'documentation', 'api', 'rest',
    'graphql', 'microservices', 'devops', 'ci/cd', 'agile', 'scrum'
  ];
  
  const lowerContent = content.toLowerCase();
  techKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  // Remove duplicates and limit to reasonable number
  return [...new Set(tags)].slice(0, 10);
}

function generateAuthor(): string {
  return "system";
}

function generateRating(): number {
  // Generate ratings between 4.0 and 5.0 with bias towards higher ratings
  return Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
}

function generateUsageCount(): number {
  // Generate usage counts between 10 and 500
  return Math.floor(Math.random() * 490) + 10;
}

const seedPromptsFromFiles = async () => {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection initialized");
    }

    const promptRepository = AppDataSource.getRepository(Prompt);
    const versionRepository = AppDataSource.getRepository(Version);
    
    // Clear existing data
    await versionRepository.clear();
    await promptRepository.clear();
    console.log("Cleared existing prompt data");

    // Read all prompt files
    const promptsDir = path.join(__dirname, '../../prompts');
    const files = fs.readdirSync(promptsDir).filter(file => file.endsWith('.prompt.md'));
    
    console.log(`Found ${files.length} prompt files to process`);

    for (const file of files) {
      try {
        const filePath = path.join(promptsDir, file);
        const { metadata, content, title } = parseMarkdownFile(filePath);
        
        // Create prompt entity
        const prompt = promptRepository.create({
          title,
          description: metadata.description || `A prompt for ${title.toLowerCase()}`,
          content,
          tags: extractTags(metadata, content),
          rating: generateRating(),
          author: generateAuthor(),
          date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)), // Random date within last year
          usageCount: generateUsageCount()
        });

        const savedPrompt = await promptRepository.save(prompt);
        console.log(`✓ Created prompt: ${title}`);

        // Create initial version
        const version = versionRepository.create({
          author: savedPrompt.author,
          date: savedPrompt.date,
          changes: "Initial version",
          prompt: savedPrompt
        });
        await versionRepository.save(version);

      } catch (error) {
        console.error(`✗ Error processing file ${file}:`, error);
      }
    }

    console.log(`\n🎉 Successfully seeded database with ${files.length} prompts from files`);
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

seedPromptsFromFiles();