# foursquare-venues-finder
Find foursquare venues by country and categoryId

## Installation

```sh
1) npm install
```

## Usage

```sh
2) Update tokens in src/fscfg.ts file
3) npm run foursquare
3) npm run landlord
```

./data/free.json will contain list of venues (id, name, location). Ex.
```json
[
  {
    "id": "57dd7c53498e8c523457368e",
    "name": "Sigulda",
    "location": {
        "lat": 57.158142,
        "lng": 24.846725
    }
  }
]
```

./data/used.json is manually populated list of ignored venueId's (venues with such ids won't be added into free.json). Ex.
```json
[
  "57dd7c53498e8c523457368e"
]
```