import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsResolver } from './songs/songs.resolver';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [SongsModule],
  controllers: [AppController],
  providers: [AppService, SongsResolver],
})
export class AppModule {}
