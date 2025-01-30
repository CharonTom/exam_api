import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ default: false })
  isSigned: boolean;

  @ManyToOne(() => User, (user) => user.images)
  owner: User;

  @OneToMany(() => Certificate, (certificate) => certificate.image)
  certificates: Certificate[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
