import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Comment } from "./Comment";
import { Version } from "./Version";

@Entity()
export class Prompt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column("simple-array")
  tags: string[];

  @Column("float", { default: 0 })
  rating: number;

  @Column()
  author: string;

  @CreateDateColumn()
  date: Date;

  @Column({ default: 0 })
  usageCount: number;

  @OneToMany(() => Comment, comment => comment.prompt)
  comments: Comment[];

  @OneToMany(() => Version, version => version.prompt)
  versions: Version[];
}