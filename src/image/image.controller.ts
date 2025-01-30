import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CertificateService } from '../certificate/certificate.service';
import { UsersService } from '../users/users.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Controller('image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly certificateService: CertificateService,
    private readonly userService: UsersService,
  ) {}

  //------------------Route Public à fin de voir si le fichier est bien signé si oui retourner le seau
  @Public()
  @Post('check-certif')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(
            new Error('Seuls les fichiers images sont autorisés !'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async checkCertif(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucune image fournie');
    }

    // Utilisation du service pour générer le hash
    const fileHash = this.imageService.generateHash(file);

    // 🔍 Vérifier si l’image existe en base via son hash
    const existingImage = await this.imageService.findByHash(fileHash);

    if (!existingImage) {
      return {
        message: "L'image n'existe pas en base de données",
        certified: false,
      };
    }

    // Retourner si l’image est certifiée ou non
    return {
      message: existingImage.certificate
        ? "L'image est certifiée"
        : "L'image existe, mais elle n'est pas certifiée",
      certified: !!existingImage.certificate,
      certification: existingImage.certificate || null,
    };
  }

  //-------------------------Route privé qui permet de signer une image
  @Public()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/assets',
        filename: (req, file, callback) => {
          const dateAndRandomNumber =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${dateAndRandomNumber}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('email') email: string,
  ) {
    if (!file) {
      throw new BadRequestException('Aucune image fournie');
    }

    // J'utilise le service find by email qui était déjà utiliser pour login
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Créer l'enregistrement de l'image en base
    await this.imageService.createImage({
      filePath: file.path,
      hash: this.imageService.generateHash(file),
      owner: user,
    });

    return {
      message: 'Image uploadée avec succès',
      filePath: file.path,
      fileName: file.filename,
    };
  }
}
