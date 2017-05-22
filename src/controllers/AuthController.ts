import { Controller, Req, Res, Get, Post } from 'routing-controllers';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

const SECRET = 'TOP_SECRET!';

@Controller('/auth')
export class AuthController {
  @Post('/')
  async creeateToken(@Req() req: Request, @Res() res: Response) {
    const { id } = req.body;
    const token = jwt.sign({ id, name: 'hello' }, req.app.get('jwt-secret'));
    res.cookie('jwt', token, { maxAge: 900000, httpOnly: true });
    res.json({ token });
  }

  @Get('/check')
  async checkToken(@Req() req: Request, @Res() res: Response) {
    const token = req.header('x-access-token');
    const info = await jwt.verify(token, req.app.get('jwt-secret'));
    res.json(info);
  }
}