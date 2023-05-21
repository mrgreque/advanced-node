import { FacebookAuthenticationUseCase } from '@/data/usecases';
import { AuthenticationError } from '@/domain/errors';

describe('FacebookAuthenticationUseCase', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookApi = {
      loadUser: jest.fn(),
    };
    const sut = new FacebookAuthenticationUseCase(loadFacebookApi);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when call LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookApi = {
      loadUser: jest.fn(),
    };
    loadFacebookApi.loadUser.mockResolvedValueOnce(undefined);

    const sut = new FacebookAuthenticationUseCase(loadFacebookApi);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
