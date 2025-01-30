import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async createImage(data: CreateImageDto): Promise<Image> {
    const newImage = this.imageRepository.create(data);
    return this.imageRepository.save(newImage);
  }

  // uploadImage() utilise diskStorage, On doit lire le fichier depuis le disque (file.path).
  // checkCertif() utilise memoryStorage (pas de sauvegarde d'image on veut seulement lire dans le fichier), On doit lire le buffer (file.buffer).
  // Si on ne gère pas les deux, l'un des deux endpoints va planter.
  generateHash(file: Express.Multer.File): string {
    if (!file) {
      throw new Error('Le fichier est invalide ou manquant.');
    }

    let fileBuffer: Buffer;

    if (file.path) {
      fileBuffer = fs.readFileSync(file.path);
    } else if (file.buffer) {
      fileBuffer = file.buffer;
    } else {
      throw new Error('Le fichier est invalide ou ne contient pas de données.');
    }

    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  async findByHash(hash: string): Promise<Image | null> {
    return this.imageRepository.findOne({ where: { hash } });
  }
}
