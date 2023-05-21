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

export interface UpdateFacebookAccountRepository {
  updateWithFacebook: (params: UpdateFacebookAccountRepository.Params) => Promise<void>;
}

export namespace UpdateFacebookAccountRepository {
  export type Params = {
    id: string;
    name: string;
    facebookId: string;
  };
}
