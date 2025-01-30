import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  async createCertificate(data: Partial<Certificate>): Promise<Certificate> {
    const newCert = this.certificateRepository.create(data);
    return this.certificateRepository.save(newCert);
  }
}
