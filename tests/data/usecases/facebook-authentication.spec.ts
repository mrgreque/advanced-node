import { LoadFacebookUserApi } from '@/data/contracts/apis';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository,
} from '@/data/contracts/repos';
import { FacebookAuthenticationUseCase } from '@/data/usecases';
import { AuthenticationError } from '@/domain/errors';
import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthenticationUseCase', () => {
  let loadFacebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepo = mock<
    LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
  >();
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
    sut = new FacebookAuthenticationUseCase(loadFacebookApi, userAccountRepo);
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

  it('should call CreateFacebookAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined); //sobrescreve o mock do beforeEach

    await sut.perform({ token });

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id',
    });
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call UpdateFacebookAccountRepo when LoadUserAccountRepo returns data', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
    }); //sobrescreve o mock do beforeEach

    await sut.perform({ token });

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      name: 'any_name',
      facebookId: 'any_fb_id',
      id: 'any_id',
    });
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
  });

  // it('should call UpdateFacebookAccountRepo when LoadUserAccountRepo returns data whithout name', async () => {
  //   userAccountRepo.load.mockResolvedValueOnce({
  //     id: 'any_id',
  //   }); //sobrescreve o mock do beforeEach

  //   await sut.perform({ token });

  //   expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
  //     name: 'any_fb_name',
  //     facebookId: 'any_fb_id',
  //     id: 'any_id',
  //   });
  //   expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
  // });
});
