import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinTable } from 'typeorm';
import { PlaceEvaluation } from './PlaceEvaluation';

@Entity()
export class PlaceEnvironment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  positiveLabel: string;

  @Column()
  negativeLabel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @OneToMany(type => PlaceEvaluation, evaluation => evaluation.environment)
  evaluations: PlaceEvaluation[];
}