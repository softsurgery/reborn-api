import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  GoogleTokenResponse,
  GoogleUserInfo,
} from '../interfaces/google.interface';
import {
  GithubEmail,
  GithubUserResponse,
} from '../interfaces/github.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthProvidersService {
  constructor(private readonly configService: ConfigService) {}

  async googleOAuth(
    code: string,
    codeVerifier: string = '',
    redirectUri?: string,
  ) {
    const tokenResponse: GoogleTokenResponse = await fetch(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          code_verifier: codeVerifier,
          client_id: process.env.GOOGLE_ID!,
          client_secret: process.env.GOOGLE_SECRET!,
          redirect_uri: redirectUri!,
          grant_type: 'authorization_code',
        }).toString(),
      },
    ).then((res) => res.json());

    if (!tokenResponse.access_token) {
      throw new Error(
        `Token exchange failed: ${JSON.stringify(tokenResponse)}`,
      );
    }

    const userInfo: GoogleUserInfo = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      },
    ).then((res) => res.json());

    return userInfo;
  }

  async githubOAuth(idToken: string) {
    const userResponse: GithubUserResponse = await fetch(
      'https://api.github.com/user',
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    ).then((res) => res.json());

    let email = userResponse.email;
    const username = userResponse.login;

    if (!email) {
      const emails: GithubEmail[] = await fetch(
        'https://api.github.com/user/emails',
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      ).then((res) => res.json());

      const primary = emails.find((e) => e.primary && e.verified);
      email = primary?.email || null;
    }

    return {
      email,
      username,
    };
  }

  async linkedinOauth(idToken: string, redirectUri?: string) {
    let accessToken = idToken;

    if (!idToken.includes('.')) {
      const tokenResponse: { access_token?: string } = await fetch(
        'https://www.linkedin.com/oauth/v2/accessToken',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: idToken,
            client_id: process.env.LINKEDIN_CLIENT_ID || '',
            client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
            redirect_uri:
              redirectUri ||
              `${this.configService.get<string>('app.mobile.scheme') || 'instanctmobileapp'}://`,
          }).toString(),
        },
      ).then((res) => res.json());

      if (!tokenResponse.access_token) {
        throw new UnauthorizedException(
          'Failed to exchange LinkedIn authorization code',
        );
      }
      accessToken = tokenResponse.access_token;
    }

    // Use the access token to get user info
    const userInfoResponse: {
      email?: string;
      name?: string;
      given_name?: string;
      picture?: string;
    } = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());

    return {
      email: userInfoResponse.email,
      username:
        userInfoResponse.name ||
        userInfoResponse.given_name ||
        userInfoResponse.email?.split('@')[0],
      picture: userInfoResponse.picture,
    };
  }
}
