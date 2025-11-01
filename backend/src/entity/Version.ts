import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Prompt } from "./Prompt";

@Entity()
export class Version {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  author: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  changes: string;

  @ManyToOne(() => Prompt, prompt => prompt.versions)
  prompt: Prompt;
}