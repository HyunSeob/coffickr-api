import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinTable } from 'typeorm';
import { Place } from './Place';
import { User } from './User';
import { PlaceEnvironment } from './PlaceEnvironment';

@Entity()
export class PlaceEvaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  result: PlaceEvaluationResult;

  @ManyToOne(type => Place, place => place.evaluations)
  place: Place;

  @ManyToOne(type => User, user => user.evaluations)
  user: User;

  @ManyToOne(type => PlaceEnvironment, environment => environment.evaluations)
  environment: PlaceEnvironment;
}

export type PlaceEvaluationResult = 'POSITIVE' | 'NEGATIVE' | 'UNKNOWN';