export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebookAccountRepository.Params) => Promise<void>;
}

export namespace SaveFacebookAccountRepository {
  export type Params = {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  };
}
