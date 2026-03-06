import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { TrackingModule } from './tracking/tracking.module';

@Module({
  imports: [AuthModule, UsersModule, ShipmentsModule, TrackingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
