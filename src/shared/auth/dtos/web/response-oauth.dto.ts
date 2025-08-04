import { ApiProperty } from '@nestjs/swagger';
import { OAuthProvider } from '../../enums/oauth.enum';

export class OAuthRequestDto {
  @ApiProperty({
    enum: OAuthProvider,
    description: 'OAuth provider (e.g., google, github)',
    example: 'google',
  })
  provider: OAuthProvider;

  @ApiProperty({
    description: 'ID token or access token from the OAuth provider',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  idToken: string;
}
