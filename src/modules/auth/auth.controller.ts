import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signin-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { Public } from './../../decorators/publicRoutes.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Res() res: Response, @Body() signInUser: SignInUserDto) {
    const token = await this.authService.signIn(signInUser);
    return res.status(200).json(token);
  }

  @Get('profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const reqId = req.user.id;

    const user = await this.authService.getProfile(reqId);
    return res.json(user);
  }
}
