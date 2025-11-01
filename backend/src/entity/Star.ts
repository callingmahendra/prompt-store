import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Unique } from "typeorm";
import { Prompt } from "./Prompt";

@Entity()
@Unique(["userId", "prompt"])
export class Star {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Prompt, prompt => prompt.stars)
  prompt: Prompt;
}