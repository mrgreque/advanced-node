export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<void>;
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    email: string;
    name: string;
    facebookId: string;
  };
}
