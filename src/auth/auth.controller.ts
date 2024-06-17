import { Controller, Post, Body, Get, HttpCode, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CreateUserDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('check-token')
  @ApiBearerAuth()
  @Auth()
  checkAuthStatus( @GetUser() user: User ) {
    return this.authService.checkAuth( user );
  }

  @Post('register')
  createUser( @Body() createUserDto: CreateUserDto ) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  loginUser( @Body() loginUserDto: LoginUserDto ){
    return this.authService.login(loginUserDto);
  }

  @Post('forgot-password')
  forgotPassword( @Body() forgotPasswordDto: ForgotPasswordDto ) {
    return this.authService.forgotPassword( forgotPasswordDto );
  }

  @Put('change-password')
  @ApiBearerAuth()
  @Auth()
  changePassword(
    @GetUser() user: User, 
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.authService.changePassword( user, changePasswordDto );
  }

  @Put('reset-password')
  resetPassword( @Body() resetPasswordDto: ResetPasswordDto ) {
    return this.authService.resetPassword( resetPasswordDto );
  }

}
