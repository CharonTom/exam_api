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

@Controller('image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly certificateService: CertificateService,
    private readonly userService: UsersService,
  ) {}

  // Route Public afin de voir si une image est bien certifiée
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

    // Puis on vérifie si le hash existe en base de données
    const existingImage = await this.imageService.findByHash(fileHash);

    if (!existingImage) {
      return {
        message: "L'image n'existe pas en base de données",
        certified: false,
      };
    }
    // On incrémente le nombre de vérif pour voir si l'image à du succès
    await this.imageService.incrementVerificationCount(existingImage);

    // Retourner si l’image est certifiée ou non
    if (existingImage.certificate) {
      return {
        message: "L'image est certifiée",
        verificationCount: existingImage.verificationCount,
        owner: {
          firstName: existingImage.owner.firstName,
          lastName: existingImage.owner.lastName,
          email: existingImage.owner.email,
        },
        certificationData: existingImage.certificate,
      };
    } else {
      throw new NotFoundException(
        'Pas de certification connu pour cette image',
      );
    }
  }

  //-------------------------Route privé qui permet de signer une image
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

    // il faut maintenant Modifier l’image par stéganographie
  }
}
