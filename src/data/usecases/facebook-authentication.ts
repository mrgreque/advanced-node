import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationUseCase {
  constructor(private readonly loadFacebookApi: LoadFacebookUserApi) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    await this.loadFacebookApi.loadUser(params);
    return new AuthenticationError();
  }
}
