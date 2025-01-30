import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738247063365 implements MigrationInterface {
    name = 'Migration1738247063365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`certificates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NULL, \`dateSignature\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filePath\` varchar(255) NOT NULL, \`hash\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`verificationCount\` int NOT NULL DEFAULT '0', \`ownerId\` int NULL, \`certificateId\` int NULL, UNIQUE INDEX \`REL_836df424b92613e793e3b9982c\` (\`certificateId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`certificates\` ADD CONSTRAINT \`FK_7d072194aef1ecb98664c83e861\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_28bb3c8c8b043b096b63a45eb81\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_836df424b92613e793e3b9982ce\` FOREIGN KEY (\`certificateId\`) REFERENCES \`certificates\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_836df424b92613e793e3b9982ce\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_28bb3c8c8b043b096b63a45eb81\``);
        await queryRunner.query(`ALTER TABLE \`certificates\` DROP FOREIGN KEY \`FK_7d072194aef1ecb98664c83e861\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_836df424b92613e793e3b9982c\` ON \`images\``);
        await queryRunner.query(`DROP TABLE \`images\``);
        await queryRunner.query(`DROP TABLE \`certificates\``);
    }

}
