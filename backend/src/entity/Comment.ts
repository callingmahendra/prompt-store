import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Prompt } from "./Prompt";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  author: string;

  @Column()
  content: string;

  @CreateDateColumn()
  date: Date;



  @ManyToOne(() => Prompt, prompt => prompt.comments)
  prompt: Prompt;
}