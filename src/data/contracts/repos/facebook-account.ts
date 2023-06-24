export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebookAccountRepository.Params) => Promise<SaveFacebookAccountRepository.Result>;
}

export namespace SaveFacebookAccountRepository {
  export type Params = {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  };

  export type Result = {
    id: string;
  };
}
