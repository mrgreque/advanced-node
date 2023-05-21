import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationUseCase } from '@/data/usecases';
import { AuthenticationError } from '@/domain/errors';
import { mock, MockProxy } from 'jest-mock-extended';

type SutTypes = {
  sut: FacebookAuthenticationUseCase;
  loadFacebookApi: MockProxy<LoadFacebookUserApi>;
};

const makeSut = (): SutTypes => {
  const loadFacebookApi = mock<LoadFacebookUserApi>();
  const sut = new FacebookAuthenticationUseCase(loadFacebookApi);

  return { sut, loadFacebookApi };
};

describe('FacebookAuthenticationUseCase', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookApi } = makeSut();

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when call LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookApi } = makeSut();
    loadFacebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token: 'any_token' });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
