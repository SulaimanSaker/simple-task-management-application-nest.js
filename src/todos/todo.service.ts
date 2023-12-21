import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/todo.create.dto';
import { UpdateTodoDto } from './dto/todo.update.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  async getAllTodo(ownerId: string) {
    const todos = await this.todoRepo.find({
      where: {
        ownerId: Equal(ownerId),
      },
    });

    return todos;
  }

  async getOneTodo(ownerId: string, id: string) {
    const todo = await this.todoRepo.findOne({
      where: { id, ownerId: ownerId },
    });

    if (!todo) {
      throw new HttpException(
        `Todo list doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return todo;
  }

  async createTodo(ownerId, createTodoDto: CreateTodoDto) {
    const todo = this.todoRepo.create({
      ...createTodoDto,
      ownerId,
    });

    await this.todoRepo.save(todo);

    return todo;
  }

  async updateTodo(id: string, updateTodoDto: UpdateTodoDto) {
    let todo: Todo = await this.todoRepo.findOne({ where: { id } });

    if (!todo) {
      throw new HttpException(
        `Todo list doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.todoRepo.update({ id }, updateTodoDto);

    todo = await this.todoRepo.findOne({
      where: { id },
    });

    return todo;
  }

  async destoryTodo(id: string) {
    const todo: Todo = await this.todoRepo.findOne({
      where: { id },
    });

    if (!todo) {
      throw new HttpException(
        `Todo list doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.todoRepo.delete({ id });

    return todo;
  }
}
