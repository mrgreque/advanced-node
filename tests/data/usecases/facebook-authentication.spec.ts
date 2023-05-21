import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationUseCase } from '@/data/usecases';
import { AuthenticationError } from '@/domain/errors';
import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthenticationUseCase', () => {
  let loadFacebookApi: MockProxy<LoadFacebookUserApi>;
  let sut: FacebookAuthenticationUseCase;

  beforeEach(() => {
    loadFacebookApi = mock();
    sut = new FacebookAuthenticationUseCase(loadFacebookApi);
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' });

    expect(loadFacebookApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when call LoadFacebookUserApi returns undefined', async () => {
    loadFacebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
