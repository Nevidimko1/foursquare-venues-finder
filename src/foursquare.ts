import * as fs from 'fs';

import { CountryDetailsService } from './services/countryDetails.service';
import { VenuesListService } from './services/venuesList.service';
import { FileUtils } from './utils/file.utils';
import { fscfg, files } from './cfg';

const checkAndUpdate = (venues: any[]): Promise<any> => {
    try {
        // Read used.json
        const used: string[] = FileUtils.readOrCreateSync(files.used, []);
    
        // Filter new venues
        var newVenues: any[] = [];
        venues.forEach((venue: any) => {
            const add = !newVenues.filter(v => v.id === venue.id).length && used.indexOf(venue.id) === -1;
            if (add) {
                newVenues.push(venue);
            }
        });

        // Update free.json
        let freeFileContent: any[] = FileUtils.readOrCreateSync(files.free, [])
        freeFileContent = [
            ...freeFileContent.filter((venue: any) => used.indexOf(venue.id) === -1),
            ...newVenues.map(venue => ({
                id: venue.id,
                name: venue.name,
                location: {
                    lat: venue.location.lat,
                    lng: venue.location.lng
                }
            }))
        ];
        fs.writeFileSync(files.free, JSON.stringify(freeFileContent, null, 4));

        return Promise.resolve(newVenues);
    }
    catch (e) {
        return Promise.reject(e);
    }
}

const countryDetailsService = new CountryDetailsService(),
    venuesListService = new VenuesListService();

countryDetailsService.getCountryDetails(fscfg.country)
    .then(details => {
        const minLat = Math.trunc(Math.min(details.bounds.ne.lat, details.bounds.sw.lat)),
            maxLat = Math.ceil(Math.max(details.bounds.ne.lat, details.bounds.sw.lat)),
            minLng = Math.trunc(Math.min(details.bounds.ne.lng, details.bounds.sw.lng)),
            maxLng = Math.ceil(Math.max(details.bounds.ne.lng, details.bounds.sw.lng)),
            totalLat = (maxLat - minLat + 1),
            totalLng = (maxLng - minLng + 1),
            total = totalLat * totalLng;

        let p: Promise<any[]> = Promise.resolve([]);

        for(let i = minLat, ii = 0; i <= maxLat; i++, ii++) {
            for(let j = minLng, jj = 1; j <= maxLng; j++, jj++) {
                p = p.then((totalVenues) => {
                    console.log(`In progress... ${ii * totalLng + jj}/${total}`);
                    return venuesListService.getVenuesList(details.cc, { lat: i, lng: j })
                        .then(venues => [...totalVenues, ...venues]);
                });
            }
        }
        return p;
    })
    .then((venues) => checkAndUpdate(venues))
    .catch(e => console.error(e));