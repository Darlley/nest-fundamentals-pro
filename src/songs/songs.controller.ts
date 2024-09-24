import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  /**
   * Cria uma nova música.
   * 
   * @param createSongDto Os dados da música a ser criada.
   */
  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  /**
   * Lista todas as músicas.
   */
  @Get()
  findAll() {
    return this.songsService.findAll();
  }

  /**
   * Busca uma música específica por ID.
   * 
   * @param id O ID da música a ser buscada.
   * 
   * Nota: O ParseIntPipe pode ser passado diretamente sem instanciar
   * se não houver necessidade de customizar o erro da requisição.
   */
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.songsService.findOne(+id);
  }

  /**
   * Atualiza uma música existente.
   * 
   * @param id O ID da música a ser atualizada.
   * @param updateSongDto Os dados atualizados da música.
   */
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(+id, updateSongDto);
  }

  /**
   * Remove uma música.
   * 
   * @param id O ID da música a ser removida.
   */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.songsService.remove(+id);
  }
}
