import { Controller, Param, Get } from 'routing-controllers';
import { Repository, getEntityManager } from 'typeorm';
import { Place } from '../entity/Place';

@Controller('/places')
export class PlaceController {
  private placeRepository: Repository<Place>;

  constructor() {
    this.placeRepository = getEntityManager().getRepository(Place);
  }

  @Get('/')
  async getList(): Promise<Place[]> {
    return await this.placeRepository.find();
  }

  @Get('/:id')
  async getPlaceById(@Param('id') id: number): Promise<Place> {
    return await this.placeRepository.findOneById(id);
  }
}
