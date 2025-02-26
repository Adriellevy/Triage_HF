import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TokenEntity } from "src/entities/token.entity";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class TokenRepository{
    constructor(
        @InjectRepository(TokenEntity)
        private readonly tokenRepository:Repository<TokenEntity>
    ){}

    async create(user: UserEntity, refreshToken: string,issuedAt?:Date): Promise<TokenEntity>{
        const token = new TokenEntity();
        token.refresh_token = refreshToken;
        token.user = user;
        token.issued_at = issuedAt || new Date();
        return await this.tokenRepository.save(token);
    }

    async findByUser(user: UserEntity): Promise<TokenEntity | null>{
        return await this.tokenRepository.findOne({where:{id_user: user.id}});
    }

    async findByUserAndToken(userId: string, token: string): Promise<TokenEntity | null>{
        return await this.tokenRepository.findOne({where:{id_user: userId, refresh_token: token},relations:['user']});
    }

    async update(token: TokenEntity): Promise<TokenEntity>{
        return await this.tokenRepository.save(token);
    }

}