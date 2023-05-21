import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

class FacebookAuthenticationUseCase {
  constructor(private readonly loadFacebookApi: LoadFacebookUserApi) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    await this.loadFacebookApi.loadUser(params);
    return new AuthenticationError();
  }
}

interface LoadFacebookUserApi {
  loadUser: (
    params: LoadFacebookUserApi.Params,
  ) => Promise<LoadFacebookUserApi.Result>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };

  export type Result = undefined;
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  result = undefined;

  async loadUser(
    params: LoadFacebookUserApi.Params,
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    return this.result;
  }
}

describe('FacebookAuthenticationUseCase', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationUseCase(loadFacebookApi);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookApi.token).toBe('any_token');
  });

  it('should return AuthenticationError when call LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookApi = new LoadFacebookUserApiSpy();
    loadFacebookApi.result = undefined;

    const sut = new FacebookAuthenticationUseCase(loadFacebookApi);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
