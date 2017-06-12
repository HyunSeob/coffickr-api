import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinTable } from 'typeorm';
import { PlaceEvaluation } from './PlaceEvaluation';
import { PlaceComment } from './PlaceComment';

@Entity()
export class Place {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  score: number;

  @Column('text')
  address: string;

  @Column()
  googleId: string;

  @Column({ nullable: true })
  photoRef: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  opening: string;

  @Column({ nullable: true })
  closing: string;

  @Column({ nullable: true })
  plug: string;

  @Column({ nullable: true })
  wifi: string;

  @Column({ nullable: true })
  seat: string;

  @Column({ nullable: true })
  crowdedness: string;

  @Column({ nullable: true })
  coffee: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @OneToMany(type => PlaceEvaluation, evaluation => evaluation.place)
  evaluations: PlaceEvaluation[];

  @OneToMany(type => PlaceComment, comment => comment.place)
  comments: PlaceComment[];
}
