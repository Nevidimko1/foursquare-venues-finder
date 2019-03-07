import * as fs from 'fs';

import { FileUtils } from './utils/file.utils';
import { LandlordFilterService } from './services/landlordFilter.service';
import { IVenue } from './core/models/venue.model';
import { files } from './cfg';

const landlordFilterService = new LandlordFilterService();

let freeFileContent: IVenue[] = FileUtils.readOrCreateSync(files.free, []);
landlordFilterService.freeVenuesIds(freeFileContent)
    .then(freeIds => {
        const freeVenues = freeFileContent.filter(venue => freeIds.some(id => venue.id === id));
        fs.writeFileSync(files.free, JSON.stringify(freeVenues, null, 4));

        let usedVenuesIds = freeFileContent
            .filter(venue => !freeIds.some(id => venue.id === id))
            .map(venue => venue.id);
        
        let usedFileContent: string[] = FileUtils.readOrCreateSync(files.used, []);
        usedVenuesIds = usedVenuesIds.filter(id => !usedFileContent.some(used => used === id));

        if (usedVenuesIds.length) {
            usedFileContent = [ ...usedFileContent, ...usedVenuesIds ];
            fs.writeFileSync(files.used, JSON.stringify(usedFileContent, null, 4));
        }
    })
    .catch(e => console.error(e));