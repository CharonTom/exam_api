import { UUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Image } from '../image/entities/image.entity';
import { Certificate } from '../certificate/entities/certificate.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id?: UUID;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  // Un utilisateur peut avoir plusieurs images et certificats
  @OneToMany(() => Image, (image) => image.owner)
  images: Image[];

  @OneToMany(() => Certificate, (certificate) => certificate.user)
  certificates: Certificate[];
}
