import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, Equal, FindOneOptions, IsNull } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PaginateQuery, paginate } from 'nestjs-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  findUserById(id: string) {
    return this.usersRepository.findOneBy({
      id: Equal(id),
    });
  }

  findUserByEmail(email: string) {
    return this.usersRepository.findOneBy({
      email: Equal(email),
    });
  }

  findUserByPhone(phone: string) {
    return this.usersRepository.findOneBy({
      phone: Equal(phone),
    });
  }

  async getMyProfile(userId: string) {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateMyProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);

    return user;
  }

  createUser(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }

  async findAllUsers(query: PaginateQuery) {
    return paginate(query, this.usersRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
    });
  }

  findUser(findOneOptions: FindOneOptions<User>) {
    return this.usersRepository.findOne(findOneOptions);
  }

  async removeUser(userId: string) {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.usersRepository.remove(user);
  }

  async register(registerDto: CreateUserDto) {
    let user = await this.findUserByEmail(registerDto.email);

    if (user) {
      throw new BadRequestException('This email is already registered');
    }

    user = await this.findUserByPhone(registerDto.phone);

    if (user) {
      throw new BadRequestException('This phone is already registered');
    }

    user = await this.createUser(registerDto);

    const token = await this.getJwtToken(user);

    return {
      user,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.findUser({
      where: {
        email: Equal(loginDto.email),
        deletedAt: IsNull(),
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = await this.getJwtToken(user);

    return {
      user,
      token,
    };
  }

  async getJwtToken(user: User) {
    const payload = { id: user.id, email: user.email };

    return await this.jwtService.signAsync(payload);
  }
}
