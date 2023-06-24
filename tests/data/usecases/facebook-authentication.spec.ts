import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { TokenGenerator } from '@/data/contracts/crypto';
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos';
import { FacebookAuthenticationUseCase } from '@/data/usecases';
import { AuthenticationError } from '@/domain/errors';

import { mock, MockProxy } from 'jest-mock-extended';

jest.mock('@/domain/models/facebook-account', () => ({
  FacebookAccount: jest.fn().mockImplementation(() => ({ any: 'any' })),
}));

describe('FacebookAuthenticationUseCase', () => {
  let loadFacebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepo = mock<LoadUserAccountRepository & SaveFacebookAccountRepository>();
  let crypto: MockProxy<TokenGenerator>;
  let sut: FacebookAuthenticationUseCase;
  const token = 'any_token';

  beforeEach(() => {
    loadFacebookApi = mock();
    loadFacebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    userAccountRepo = mock();
    userAccountRepo.load.mockResolvedValue(undefined);
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' });
    crypto = mock();
    sut = new FacebookAuthenticationUseCase(loadFacebookApi, userAccountRepo, crypto);
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(loadFacebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when call LoadFacebookUserApi returns undefined', async () => {
    loadFacebookApi.loadUser.mockResolvedValueOnce(undefined); //sobrescreve o mock do beforeEach

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserAccountRepo when call LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    await sut.perform({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'any_account_id' });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });
});
