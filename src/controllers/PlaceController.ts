import { Controller, Param, Get, Res, Req, Post, Body, UseBefore, QueryParam } from 'routing-controllers';
import { Repository, getEntityManager } from 'typeorm';
import { Place } from '../entity/Place';
import { PlaceEnvironment } from '../entity/PlaceEnvironment';
import { Response, Request } from 'express';
import { authUser, AuthRequest } from '../middlewares/authUser';
import { PlaceEvaluation, PlaceEvaluationResult } from '../entity/PlaceEvaluation';
import { PlaceComment } from '../entity/PlaceComment';
import * as request from 'superagent';
import { GoogleService } from '../services/GoogleService';

const ITEM_IN_PAGE = 12;

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
  async getList(
    @QueryParam('q') queryString: string,
    @QueryParam('page') page = 1,
    @QueryParam('limit') limit = ITEM_IN_PAGE,
  ): Promise<Place[]> {
    const findOptions = <any>{
      alias: 'place',
      offset: (page - 1) * ITEM_IN_PAGE,
      limit,
      orderBy: { score: 'DESC' },
    };

    if (queryString) {
      const places = await GoogleService.textSearch(queryString);
      const placeIds = places
        .map(v => `'${v.place_id}'`)
        .join(', ');

      findOptions.where = `place.googleId IN (${placeIds})`;
    }

    return await this.placeRepository.find(findOptions);
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

    console.log(req.body);

    if (result === 'POSITIVE') {
      place.score = place.score * 1.2;
    } else if (result === 'NEGATIVE') {
      place.score = place.score * 0.8;
    }

    await this.placeRepository.persist(place);
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

  @Get('/:id/photo')
  async getPhoto(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    const place = await this.placeRepository.findOneById(id);
    const photo = await GoogleService.getPhotoOfPlace(place.photoRef);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(photo);
  }

  @Post('/bulk-insert')
  async bulkInsert(
    @Body() places: { reference: string, place_id: string }[],
    @Req() req: Request,
    @Res() res: Response
  ) {
    const GOOGLE_URI = 'https://maps.googleapis.com/maps/api/place/details/json';
    const GOOGLE_KEY = 'AIzaSyC5MvSXl723DpmUHh5FpJ-UxQcAFoI43FA';

    for (const place of places) {
      console.log(`Place ID is ... ${place.place_id}`);
      console.log('Find in DB..');

      const exist = await this.placeRepository.findOne({
        googleId: place.place_id
      });

      if (exist) {
        console.log('Found. Skipping this ref..');
        continue;
      } else {
        console.log('Not found.');
        console.log('Request to Google...');
      }

      const response = await request
        .get(GOOGLE_URI)
        .query({ placeid: place.place_id })
        .query({ key: GOOGLE_KEY })
        .query({ language: 'ko' });

      const { result } = response.body;

      if (!result) {
        console.log('Request is not responding result.');
        console.log('Skipping this request...');
        continue;
      }

      if (!result.formatted_address) {
        console.log('It do not have an address.');
        console.log('Skipping this place...');
        continue;
      }

      if (result.formatted_address.indexOf('대한민국') === -1) {
        console.log('It\'s not a place in Korea');
        console.log('Skipping this place...');
        continue;
      }

      const newPlace = new Place();

      console.log(`Place name is... ${result.name}`);
      console.log(`Place Saving..`);

      newPlace.name = result.name;
      newPlace.address = result.formatted_address;
      newPlace.phone = result.international_phone_number;
      newPlace.lat = result.geometry.location.lat;
      newPlace.lng = result.geometry.location.lng;
      newPlace.googleId = result.place_id;
      newPlace.score = result.rating || 0;

      if (result.photos && result.photos[0]) {
        newPlace.photoRef = result.photos[0].photo_reference;
      }

      try {
        await this.placeRepository.persist(newPlace);
      } catch (err) {
        console.log('Ignoring error..');
        console.log(err);
      }
    }

    res.sendStatus(200);
  }
}

interface PlaceReference {
  reference: string;
}
