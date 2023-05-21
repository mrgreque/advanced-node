import { FacebookAuthentication } from '@/domain/features';

class FacebookAuthenticationUseCase {
  constructor(private readonly loadFacebookApi: LoadFacebookUserApi) {}

  async perform(params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookApi.loadUser(params);
  }
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>;
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token;
  }
}

describe('FacebookAuthenticationUseCase', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationUseCase(loadFacebookApi);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookApi.token).toBe('any_token');
  });
});
