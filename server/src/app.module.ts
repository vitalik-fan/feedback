import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/role.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { Session } from './session/session.model';
import { MessageModule } from './message/message.module';
import { Message } from './message/message.model';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';
import {MessageGateway} from "./message.gateway";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [User, Role, UserRoles, Session, Message],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    SessionModule,
    MessageModule,
    MessageGateway,
    NestEmitterModule.forRoot(new EventEmitter())
  ],
})
export class AppModule {}
