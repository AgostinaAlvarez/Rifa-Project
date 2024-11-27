/* eslint-disable no-underscore-dangle */
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from '../utils/interface/user.interface';
// eslint-disable-next-line import/no-cycle
import { UsersService } from '../users/users.service';
import { BCRYPT } from '../bcrypt/bcrypt.const';
import { Bcrypt } from '../bcrypt/bcrypt.provider';
import { CreateUserResponseDto } from './dto/createUserResponse.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { User } from '../users/users.model';
import { Role } from '../utils/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(BCRYPT) public bcryptProvider: Bcrypt,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<CreateUserResponseDto> {
    const user = await this.usersService.findByEmail(email, true);
    if (user?.roles.includes(Role.BASIC_USER)) {
      throw new HttpException(
        'User exists but has not completed onboarding',
        HttpStatus.CONFLICT,
      );
    }
    if (
      user &&
      user.password &&
      this.bcryptProvider.compareSync(password, user.password)
    ) {
      return user;
    }
    return null;
  }

  async login(user: User & { plan?: any }): Promise<LoginResponseDto> {
    const plainUserObj = user.plan.toObject();
    const payload = {
      _id: user._id,
      email: user.email,
      roles: user.roles,
      planId: user.plan._id,
    };
    const token = this.jwtService.sign(payload);
    const response = {
      token,
      fullName: user.fullName,
      plan: plainUserObj,
      _id: user._id.toHexString(),
      email: user.email,
      birthday: user.birthday,
      identificationFull: user.identificationFull,
      phone: user.phone,
      isFinishedSuscription: user.isFinishedSuscription,
      finishedSuscriptionAt: user.finishedSuscriptionAt,
    };
    return response;
  }

  async logout(user: UserInterface): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(user);
  }

  async validateToken(user: UserInterface): Promise<UserInterface> {
    const userExist = await this.usersService.findByEmail(user.email);

    if (!userExist) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  sign(user: User): string {
    return this.jwtService.sign(user);
  }
}
