import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';

import { User } from './entities/user.entity';
import { ChangePasswordDto, CreateUserDto, ForgotPasswordDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ResetToken } from './entities/reset-token.entity';
import { MailService } from 'src/common/services/mail/mail.service';


@Injectable()
export class AuthService {

  private logger: Logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResetToken)
    private readonly resetTokenRepository: Repository<ResetToken>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async create( createUserDto: CreateUserDto ) {

    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });

      await this.userRepository.save( user );
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
      
    } catch (error) {
      this.handleDBErrors( error );
    }

  }

  async login( loginUserDto: LoginUserDto ) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, roles: true }
    });

    if (!user)
      throw new UnauthorizedException('Invalid credentials');

    if (!bcrypt.compareSync( password, user.password ))
      throw new UnauthorizedException('Invalid credentials');

    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  async checkAuth( user: User ) {

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  async changePassword( user: User, changePasswordDto: ChangePasswordDto ) {
    
    const { id } = user;
    const userDB = await this.userRepository.findOne({ where: { id } });

    const { oldPassword, newPassword } = changePasswordDto;
    const passwordMatch = bcrypt.compareSync( oldPassword, userDB.password );
    if ( !passwordMatch )
      throw new UnauthorizedException('Invalid credentials (old password)');

    const newPasswordHash = bcrypt.hashSync( newPassword, 10 );
    userDB.password = newPasswordHash;
    await this.userRepository.save( userDB );
  }

  async forgotPassword( forgotPasswordDto: ForgotPasswordDto ) {
    
    const { email } = forgotPasswordDto; 
    const userDB = await this.userRepository.findOne({ where: { email } });
    if (!userDB)
      throw new BadRequestException(`The email ${email} is not registered`);

    const resetToken = uuid();
    const resetTokenDB = this.resetTokenRepository.create({
      token: resetToken,
      user: userDB
    });
    this.resetTokenRepository.save( resetTokenDB );

    this.mailService.sendPasswordResetEmail( email, resetToken );
  }

  async resetPassword( resetPasswordDto: { token: string, newPassword: string } ) {
      
      const { token, newPassword } = resetPasswordDto;
      const resetTokenDB = await this.resetTokenRepository.findOne({ where: { token }, relations: ['user'] });
      if (!resetTokenDB)
        throw new BadRequestException('Invalid token');

      const oneDayAgo = DateTime.local().minus({ days: 1 });
      const past1Day = DateTime.fromJSDate(resetTokenDB.createdAt) < oneDayAgo;
      if ( past1Day ) {
        await this.resetTokenRepository.delete( resetTokenDB.id );
        throw new BadRequestException('Reset token expired, please request a new one');
      }
  
      const newPasswordHash = bcrypt.hashSync( newPassword, 10 );
      resetTokenDB.user.password = newPasswordHash;
      await this.userRepository.save( resetTokenDB.user );  
      await this.resetTokenRepository.delete( resetTokenDB.id );
    }

  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDBErrors(error: any): never {
    
    if (error.code === '23505')
      throw new BadRequestException( error.detail );

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs for more details');
  }

}
