const tokens = {
    foursquareClientId: '',     // Foursquare API client_id
    foursquareClientSecret: '', // Foursquare API client_secret
    landlordXFSToken: ''        // x-fs-token
}

const categoryIds = [
    '530e33ccbcbc57f1066bbff3', // 23kkk
    '5345731ebcbc57f1066c39b2'  // 33kkk
]

export const files = {
    free: './data/free.json',
    used: './data/used.json'
}

export const fscfg = {
    url: 'https://api.foursquare.com/v2/venues/search?',
    country: 'Latvia',
    params: {
        categoryId: categoryIds[0],
        radius: 100000,
        client_id: tokens.foursquareClientId,
        client_secret: tokens.foursquareClientSecret,
        v: 20190212
    }
};

export const llcfg = {
    url: 'https://api.wearerealitygames.com/landlord',
    xfstoken: tokens.landlordXFSToken
};
