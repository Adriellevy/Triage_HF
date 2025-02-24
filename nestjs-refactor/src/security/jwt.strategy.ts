// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { TokenPayload } from 'src/domain/login.domain';
import { environment } from 'src/environment';
import { UserRepository } from 'src/repositories/user.repository';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environment.jwt.secret
    });
  }

  async validate(payload: TokenPayload) {
    return this.userRepository.findOneById(payload.sub);
  }
}
