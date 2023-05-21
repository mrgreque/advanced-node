import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos';

export class FacebookAuthenticationUseCase {
  constructor(
    private readonly loadFacebookApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createFacebookAccountRepo: CreateFacebookAccountRepository,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookApi.loadUser(params);
    if (fbData !== undefined) {
      await this.loadUserAccountRepo.load({ email: fbData?.email });
      await this.createFacebookAccountRepo.createFromFacebook(fbData);
    }

    return new AuthenticationError();
  }
}
