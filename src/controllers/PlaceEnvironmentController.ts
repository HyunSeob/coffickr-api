import { Controller, Get, QueryParam } from 'routing-controllers';
import { PlaceEnvironment } from '../entity/PlaceEnvironment';
import { Repository, getEntityManager } from 'typeorm';
import { chain } from 'lodash';

@Controller('/place-envs')
export class PlaceEnvironmentController {
  private environmentRepository: Repository<PlaceEnvironment>;

  constructor() {
    this.environmentRepository = getEntityManager().getRepository(PlaceEnvironment);
  }

  @Get('/random')
  async getPlaceEnvironmentByRandom(@QueryParam('n') num: number): Promise<PlaceEnvironment[]> {
    return chain(await this.environmentRepository.find())
      .shuffle()
      .take(num || 1)
      .value();
  }
}