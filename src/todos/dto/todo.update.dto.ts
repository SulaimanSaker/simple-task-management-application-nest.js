import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(500)
  text: string;
}
