import * as request from 'superagent';

const GOOGLE_URI_BASE = 'https://maps.googleapis.com/maps/api/place';
const GOOGLE_API_KEY = 'AIzaSyC5MvSXl723DpmUHh5FpJ-UxQcAFoI43FA';

export class GoogleService {
  public static async textSearch(text: string): Promise<any[]> {
    const response = await request
      .get(`${GOOGLE_URI_BASE}/textsearch/json `)
      .query({ key : GOOGLE_API_KEY })
      .query({ query: text })
      .query({ language: 'ko' })
      .query({ type: 'cafe' });

    return response.body.results;
  }

  public static async getPhotoOfPlace(ref: string): Promise<any> {
    const response = await request
      .get(`${GOOGLE_URI_BASE}/photo`)
      .query({ key : GOOGLE_API_KEY })
      .query({ photoreference: ref })
      .query({ maxwidth: 400 });

    return response.body;
  }

  public static async getDetailOfPlace(id: string): Promise<any> {
    const response = await request
      .get(`${GOOGLE_URI_BASE}/details/json`)
      .query({ key: GOOGLE_API_KEY })
      .query({ placeid: id })
      .query({ language: 'ko' });

    return response.body;
  }
}