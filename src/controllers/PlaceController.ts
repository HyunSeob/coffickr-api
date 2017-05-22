import { Controller, Param, Get, Res, Req, Post, Body, UseBefore } from 'routing-controllers';
import { Repository, getEntityManager } from 'typeorm';
import { Place } from '../entity/Place';
import { PlaceEnvironment } from '../entity/PlaceEnvironment';
import { Response } from 'express';
import { authUser, AuthRequest } from '../middlewares/authUser';
import { PlaceEvaluation, PlaceEvaluationResult } from '../entity/PlaceEvaluation';
import { PlaceComment } from '../entity/PlaceComment';

@Controller('/places')
export class PlaceController {
  private placeRepository: Repository<Place>;
  private environmentRepository: Repository<PlaceEnvironment>;
  private evaluationRepository: Repository<PlaceEvaluation>;
  private commentRepository: Repository<PlaceComment>;

  constructor() {
    this.placeRepository = getEntityManager().getRepository(Place);
    this.environmentRepository = getEntityManager().getRepository(PlaceEnvironment);
    this.evaluationRepository = getEntityManager().getRepository(PlaceEvaluation);
    this.commentRepository = getEntityManager().getRepository(PlaceComment);
  }

  @Get('/')
  async getList(): Promise<Place[]> {
    return await this.placeRepository.find();
  }

  @Get('/:id')
  async getPlaceById(@Param('id') id: number): Promise<Place> {
    return await this.placeRepository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.evaluations', 'evaluations')
      .leftJoinAndSelect('evaluations.environment', 'environment')
      .leftJoinAndSelect('place.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'user')
      .where(`place.id=${id}`)
      .getOne();
  }

  @Post('/:id/eval')
  @UseBefore(authUser)
  async createEvaluation(
    @Param('id') id: number,
    @Body() { result, envId }: { result: PlaceEvaluationResult, envId: string },
    @Req() req: AuthRequest
  ): Promise<PlaceEvaluation> {
    const place = await this.placeRepository.findOneById(id);
    const environment = await this.environmentRepository.findOneById(envId);

    const evaluation = new PlaceEvaluation();
    evaluation.result = result;
    evaluation.place = place;
    evaluation.user = req.user;
    evaluation.environment = environment;

    return await this.evaluationRepository.persist(evaluation);
  }

  @Post('/:id/comment')
  @UseBefore(authUser)
  async createComment(
    @Param('id') id: number,
    @Body() { content }: { content: string },
    @Req() req: AuthRequest
  ): Promise<PlaceComment> {
    const place = await this.placeRepository.findOneById(id);

    const comment = new PlaceComment();
    comment.place = place;
    comment.content = content;
    comment.user = req.user;

    return await this.commentRepository.persist(comment);
  }
}
