import { Router } from "express";
import { AppDataSource } from "../index";
import { Prompt } from "../entity/Prompt";

const router = Router();

// Get platform statistics
router.get("/", async (_req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    
    // Get all prompts with basic info
    const prompts = await promptRepository.find({
      select: ["author", "usageCount"]
    });

    // Calculate stats
    const totalPrompts = prompts.length;
    const totalAuthors = new Set(prompts.map(p => p.author)).size;
    const totalUsage = prompts.reduce((sum, p) => sum + (p.usageCount || 0), 0);

    return res.json({
      totalPrompts,
      totalAuthors,
      totalUsage
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: "Error fetching statistics" });
  }
});

export default router;