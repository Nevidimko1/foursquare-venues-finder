const categoryIds = [
    '530e33ccbcbc57f1066bbff3', // 23kkk
    '5345731ebcbc57f1066c39b2'  // 33kkk
]

export const fscfg = {
    url: "https://api.foursquare.com/v2/venues/search?",
    params: {
        categoryId: categoryIds[0],
        radius: 100000,
        client_id: "",      // Foursquare API client_id
        client_secret: "",  // Foursquare API client_secret
        v: 20190212
    }
};
