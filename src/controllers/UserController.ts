import { Controller, Body, Get, Post, Delete, Req, Res, UseBefore } from 'routing-controllers';
import { Repository, getEntityManager } from 'typeorm';
import { Response, Request } from 'express';
import { User } from '../entity/User';
import { AuthService } from '../services/AuthService';
import { AuthRequest, authUser } from '../middlewares/authUser';

const JWT_SECRET = 'cx@H6[_>Q4os$/)xBAXw?Ecc';

@Controller('/users')
export class UserController {
  private userRepository: Repository<User>;
  private authService: AuthService;

  constructor() {
    this.userRepository = getEntityManager().getRepository(User);
    this.authService = new AuthService(JWT_SECRET);
  }

  @Post('/')
  async register(@Body() user: User, @Res() res: Response) {
    const newUser = await this.userRepository.persist(user);
    const token = await this.authService.createToken(newUser);

    res.cookie('jwt', token, {
      maxAge: 86400 * 1000,
      secure: false,
      path: '/',
      domain: 'local.coffic.kr'
    });

    res.header('Access-Control-Allow-Credentials', 'true');
    res.json(user);
  }

  @Post('/login')
  async login(@Body() { email, password }: { email: string, password: string }, @Res() res: Response) {
    const user = await this.userRepository.findOne({ email, password });
    const token = await this.authService.createToken(user);

    res.cookie('jwt', token, {
      maxAge: 86400 * 1000,
      secure: false,
      path: '/',
      domain: 'local.coffic.kr'
    });

    res.header('Access-Control-Allow-Credentials', 'true');
    res.json(user);
  }

  @Get('/logout')
  @UseBefore(authUser)
  async logout(@Req() req: AuthRequest, @Res() res: Response) {
    res.clearCookie('jwt');
    res.sendStatus(200);
  }

  @Get('/check')
  @UseBefore(authUser)
  async check(@Req() req: AuthRequest, @Res() res: Response) {
    res.json(req.user);
  }
}