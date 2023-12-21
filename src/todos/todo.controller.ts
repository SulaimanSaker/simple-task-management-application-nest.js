import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { CreateTodoDto } from './dto/todo.create.dto';
import { UpdateTodoDto } from './dto/todo.update.dto';

@UseGuards(AuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll(@Request() req) {
    const todos = await this.todoService.getAllTodo(req.user.id);

    return todos;
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return await this.todoService.getOneTodo(req.user.id, id);
  }

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    return await this.todoService.createTodo(req.user.id, createTodoDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todoService.updateTodo(id, updateTodoDto);
  }

  @Delete(':id')
  async destory(@Param('id') id: string) {
    return await this.todoService.destoryTodo(id);
  }
}
