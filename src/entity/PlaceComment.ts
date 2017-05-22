import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Place } from './Place';
import { User } from './User';

@Entity()
export class PlaceComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @ManyToOne(type => Place, place => place.comments)
  place: Place;

  @ManyToOne(type => User, user => user.comments)
  user: User;
}