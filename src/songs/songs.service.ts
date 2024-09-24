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
    let updatedSong = null;
    this.songs = this.songs.map((song) => {
      if (song.id === id) {
        updatedSong = { ...song, ...updateSongDto };
        return updatedSong;
      }
      return song;
    });
    return updatedSong;
  }

  remove(id: number) {
    const songToRemove = this.songs.find((song) => song.id === id);
    if (songToRemove) {
      this.songs = this.songs.filter((song) => song.id !== id);
      return songToRemove;
    }
    return null;
  }
}
