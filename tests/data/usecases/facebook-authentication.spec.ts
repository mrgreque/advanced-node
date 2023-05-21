import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationUseCase } from '@/data/usecases';
import { AuthenticationError } from '@/domain/errors';
import { mock } from 'jest-mock-extended';

describe('FacebookAuthenticationUseCase', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookApi = mock<LoadFacebookUserApi>();
    const sut = new FacebookAuthenticationUseCase(loadFacebookApi);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when call LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookApi = mock<LoadFacebookUserApi>();
    loadFacebookApi.loadUser.mockResolvedValueOnce(undefined);

    const sut = new FacebookAuthenticationUseCase(loadFacebookApi);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
