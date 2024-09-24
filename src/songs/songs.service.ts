import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
  private songs: any[] = [];
  private nextId = 1;

  create(createSongDto: CreateSongDto) {
    const newSong = {
      id: this.nextId++,
      ...createSongDto,
    };
    this.songs.push(newSong);
    return newSong;
  }

  findAll() {
    try {
      return this.songs;
    } catch (e) {
      console.log('Controller@findAll', e);
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return this.songs.find((song) => song.id === id);
  }

  update(id: number, updateSongDto: UpdateSongDto) {
    const index = this.songs.findIndex((song) => song.id === id);
    if (index !== -1) {
      this.songs[index] = { ...this.songs[index], ...updateSongDto };
      return this.songs[index];
    }
    return null;
  }

  remove(id: number) {
    const index = this.songs.findIndex((song) => song.id === id);
    if (index !== -1) {
      const removedSong = this.songs[index];
      this.songs.splice(index, 1);
      return removedSong;
    }
    return null;
  }
}
