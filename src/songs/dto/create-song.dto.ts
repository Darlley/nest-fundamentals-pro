import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsString } from "class-validator";

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
  
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  readonly artists: string[];
  
  @IsNotEmpty()
  @IsDateString()
  readonly releasedDate: string;
  
  @IsNotEmpty()
  @IsMilitaryTime()
  readonly duration: string;
}
