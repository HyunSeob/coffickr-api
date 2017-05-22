import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PlaceEvaluation } from './PlaceEvaluation';
import { PlaceComment } from './PlaceComment';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @OneToMany(type => PlaceEvaluation, evaluation => evaluation.user)
  evaluations: PlaceEvaluation[];

  @OneToMany(type => PlaceComment, comment => comment.user)
  comments: PlaceComment[];
}
