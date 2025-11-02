import { Router } from "express";
import { AppDataSource } from "../index";
import { Prompt } from "../entity/Prompt";
import { Comment } from "../entity/Comment";
import { Version } from "../entity/Version";
import { Star } from "../entity/Star";
import { validatePromptInput, validatePromptUpdateInput, validateCommentInput, validateVersionInput } from "../middleware/validation";

const router = Router();


// Get all prompts
router.get("/", async (_req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    const prompts = await promptRepository.find({
      relations: ["comments", "versions", "stars"],
    });
    return res.json(prompts);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching prompts" });
  }
});

// Search prompts (must come before /:id route)
router.get("/search", async (req, res) => {
  try {
    const { q, tag } = req.query;
    const promptRepository = AppDataSource.getRepository(Prompt);
    
    let queryBuilder = promptRepository.createQueryBuilder("prompt")
      .leftJoinAndSelect("prompt.comments", "comments")
      .leftJoinAndSelect("prompt.versions", "versions")
      .leftJoinAndSelect("prompt.stars", "stars");

    if (q && typeof q === 'string') {
      queryBuilder = queryBuilder.where(
        "prompt.title LIKE :search OR prompt.description LIKE :search OR prompt.content LIKE :search",
        { search: `%${q}%` }
      );
    }

    if (tag && typeof tag === 'string') {
      queryBuilder = queryBuilder.andWhere("prompt.tags LIKE :tag", { tag: `%${tag}%` });
    }

    const prompts = await queryBuilder.getMany();
    return res.json(prompts);
  } catch (error) {
    return res.status(500).json({ error: "Error searching prompts" });
  }
});

// Get popular tags
router.get("/tags/popular", async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const promptRepository = AppDataSource.getRepository(Prompt);
    const prompts = await promptRepository.find();

    const tagFrequency: { [key: string]: number } = {};

    // Count tag frequency
    prompts.forEach(prompt => {
      if (prompt.tags && Array.isArray(prompt.tags)) {
        prompt.tags.forEach(tag => {
          if (tag && tag.trim()) {
            const cleanTag = tag.trim().toLowerCase();
            tagFrequency[cleanTag] = (tagFrequency[cleanTag] || 0) + 1;
          }
        });
      }
    });

    // Sort tags by frequency and return top tags
    const sortedTags = Object.entries(tagFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, Number(limit))
      .map(([tag, count]) => ({ tag, count }));

    return res.json(sortedTags);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching popular tags" });
  }
});

// Get a single prompt
router.get("/:id", async (req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    const prompt = await promptRepository.findOne({
      where: { id: req.params.id },
      relations: ["comments", "versions", "stars"],
    });
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    return res.json(prompt);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching prompt" });
  }
});

// Create a new prompt
router.post("/", validatePromptInput, async (req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    const prompt = promptRepository.create(req.body);
    await promptRepository.save(prompt);
    return res.status(201).json(prompt);
  } catch (error) {
    return res.status(500).json({ error: "Error creating prompt" });
  }
});

// Update a prompt
router.put("/:id", validatePromptUpdateInput, async (req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    const prompt = await promptRepository.findOneBy({ id: req.params.id });
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    promptRepository.merge(prompt, req.body);
    const result = await promptRepository.save(prompt);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Error updating prompt" });
  }
});

// Delete a prompt
router.delete("/:id", async (req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    const result = await promptRepository.delete(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Error deleting prompt" });
  }
});

// Add a comment to a prompt
router.post("/:id/comments", validateCommentInput, async (req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    const commentRepository = AppDataSource.getRepository(Comment);
    const prompt = await promptRepository.findOneBy({ id: req.params.id });
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    const comment = commentRepository.create({
      ...req.body,
      prompt,
    });
    await commentRepository.save(comment);
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error: "Error adding comment" });
  }
});

// Add a version to a prompt
router.post("/:id/versions", validateVersionInput, async (req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    const versionRepository = AppDataSource.getRepository(Version);
    const prompt = await promptRepository.findOneBy({ id: req.params.id });
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    const version = versionRepository.create({
      ...req.body,
      prompt,
    });
    await versionRepository.save(version);
    return res.status(201).json(version);
  } catch (error) {
    return res.status(500).json({ error: "Error adding version" });
  }
});

// Star/unstar a prompt
router.post("/:id/star", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const promptRepository = AppDataSource.getRepository(Prompt);
    const starRepository = AppDataSource.getRepository(Star);
    
    const prompt = await promptRepository.findOneBy({ id: req.params.id });
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    // Check if already starred
    const existingStar = await starRepository.findOne({
      where: { userId, prompt: { id: req.params.id } }
    });

    if (existingStar) {
      // Unstar
      await starRepository.remove(existingStar);
      return res.json({ starred: false, message: "Prompt unstarred" });
    } else {
      // Star
      const star = starRepository.create({ userId, prompt });
      await starRepository.save(star);
      return res.json({ starred: true, message: "Prompt starred" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error toggling star" });
  }
});

// Get star status for a user
router.get("/:id/star/:userId", async (req, res) => {
  try {
    const starRepository = AppDataSource.getRepository(Star);
    const star = await starRepository.findOne({
      where: { userId: req.params.userId, prompt: { id: req.params.id } }
    });
    return res.json({ starred: !!star });
  } catch (error) {
    return res.status(500).json({ error: "Error checking star status" });
  }
});

// Track prompt usage (increment usage count)
router.post("/:id/use", async (req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    const prompt = await promptRepository.findOneBy({ id: req.params.id });
    
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    // Increment usage count
    prompt.usageCount = (prompt.usageCount || 0) + 1;
    await promptRepository.save(prompt);

    return res.json({ 
      success: true, 
      usageCount: prompt.usageCount,
      message: "Usage tracked successfully" 
    });
  } catch (error) {
    return res.status(500).json({ error: "Error tracking usage" });
  }
});

export default router;