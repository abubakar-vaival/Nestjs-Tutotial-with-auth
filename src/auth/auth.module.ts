import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtGaurd } from './gaurds/jwt.gaurd';
import { JwtStrategy } from './gaurds/jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'secret',
        signOptions: {
          expiresIn: '300s',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGaurd, JwtStrategy],
})
export class AuthModule {}
