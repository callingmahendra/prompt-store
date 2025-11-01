import { Router } from "express";
import { AppDataSource } from "../index";
import { Prompt } from "../entity/Prompt";
import { Comment } from "../entity/Comment";
import { Version } from "../entity/Version";
import { validatePromptInput, validateCommentInput, validateVersionInput } from "../middleware/validation";

const router = Router();


// Get all prompts
router.get("/", async (_req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    const prompts = await promptRepository.find({
      relations: ["comments", "versions"],
    });
    return res.json(prompts);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching prompts" });
  }
});

// Get a single prompt
router.get("/:id", async (req, res) => {
  try {
    const promptRepository = AppDataSource.getRepository(Prompt);
    const prompt = await promptRepository.findOne({
      where: { id: req.params.id },
      relations: ["comments", "versions"],
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
router.put("/:id", async (req, res) => {
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

export default router;