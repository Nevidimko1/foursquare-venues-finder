import * as querystring from 'querystring';
import { Api } from '../core/api';
import { ILocation } from '../core/models/location.model';
import { fscfg } from '../cfg';

export class VenuesListService {
    
    public getVenuesList = (countryCode: string, location: ILocation): Promise<any[]> => {
        if (!location) {
            return Promise.reject('Location is not provided');
        }
    
        const url = fscfg.url + querystring.stringify({
            ...fscfg.params,
            ll: `${location.lat},${location.lng}`
        });
    
        return Api.get(url)
            .then((data: any) => {
                if (data.meta.errorType) {
                    return Promise.reject(new Error(data.meta.errorDetail));
                }

                try {
                    let d: any[] = data.response.venues;
                    d = d.filter((venue: any) => {
                        return venue.categories.filter((category: any) => category.id === fscfg.params.categoryId).length &&
                            venue.location.cc === countryCode;
                    });
                    return Promise.resolve(d);
                }
                catch (e) {
                    return Promise.reject(e);
                }
            });
    }
}