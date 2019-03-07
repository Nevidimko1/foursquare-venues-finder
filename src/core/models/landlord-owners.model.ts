export interface IOwner {
  playerId: string,
  name: string,
  photo: string,
  shares: number
}

export interface IOwnersResponse {
  meta: {
    code: number;
  },
  response: {
      fsVenueId: string;
      owners: IOwner[];
  }
}