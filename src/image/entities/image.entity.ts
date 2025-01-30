import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Certificate } from 'src/certificate/entities/certificate.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filePath: string;

  @Column()
  hash: string;

  @ManyToOne(() => User, (user) => user.images)
  owner: User;

  @OneToOne(() => Certificate, { cascade: true, nullable: true })
  @JoinColumn()
  certificate: Certificate;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
