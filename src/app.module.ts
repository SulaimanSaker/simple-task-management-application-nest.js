import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomClassSerializerInterceptor } from './shared/interceptors/class-serializer.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './shared/configs/constants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'hss1',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
