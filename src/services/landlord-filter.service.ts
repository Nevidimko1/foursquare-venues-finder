import { Api } from '../core/api';
import { llcfg } from '../cfg';
import { IVenue } from 'src/core/models/venue.model';
import { IOwnersResponse } from 'src/core/models/landlord-owners.model';

export class LandlordFilterService {
  // Assume venue has at least 50% of free share (at least 50% of venue is not bought already)
  // 1000 = 100%, 500 = 50%, 10 = 1%
  private readonly MIN_FREE_SHARE = 500;
  private readonly DELAY = 1000; // 1s

  private returnDelayed = <T>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), this.DELAY));
  }
  private venueInfoUrl = (venueId: string): string => `${llcfg.url}/assets/${venueId}/owners`;
  private isVenueFree = (data: IOwnersResponse): boolean => {
    return data.response.owners.reduce((share, owner) => share += owner.shares, 0) <= this.MIN_FREE_SHARE;
  }

  private checkVenueIsFree = (venue: IVenue): Promise<boolean> => {
    return Api.get<IOwnersResponse>(this.venueInfoUrl(venue.id), { 'x-fs-token': llcfg.xfstoken })
      .then(this.isVenueFree)
      .then(this.returnDelayed);
  }

  public freeVenuesIds = (venues: IVenue[]): Promise<string[]> => {
    return venues.reduce((p, venue, i) => p.then((freeIds) => {
      console.log(`Landlord check in progress... ${i + 1}/${venues.length}`);
      return this.checkVenueIsFree(venue)
        .then(free => [...freeIds, ...(free ? [venue.id] : [])])
        // keep venueId if REST call failed for some reason
        .catch(() => [...freeIds, venue.id]);
    }), Promise.resolve([]));
  }
}