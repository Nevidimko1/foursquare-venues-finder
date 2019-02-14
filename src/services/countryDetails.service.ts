import * as querystring from 'querystring';
import { ICountryDetails } from '../core/models/countryDetails.model';
import { Api } from '../core/api';

import { fscfg } from '../fscfg';

export class CountryDetailsService {
    
    public getCountryDetails = (name: string): Promise<ICountryDetails> => {
        if (!name) {
            return Promise.reject('Country is not provided');
        }

        const url = fscfg.url + querystring.stringify({
            ...fscfg.params,
            limit: 1,
            near: name,
        });

        return Api.get(url)
            .then((data: any) => {
                if (data.meta.errorType) {
                    return Promise.reject(new Error(data.meta.errorDetail));
                }

                try {
                    const info = data.response.geocode.feature;
                    return Promise.resolve({
                        cc: info.cc,
                        bounds: info.geometry.bounds
                    });
                }
                catch (e) {
                    return Promise.reject(e);
                }
            });
    }
}