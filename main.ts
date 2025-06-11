import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { AwsCredentialIdentity } from '@smithy/types';
enum Attribute {
  accessKeyId = 'accessKeyId',
  secretAccessKey = 'secretAccessKey',
  sessionToken = 'sessionToken'
}

const cachedCredentials: { [profile: string]: AwsCredentialIdentity } = {};

export const templateTags = [
  {
    name: 'awsprofile',
    displayName: 'awsprofile',
    description: 'Insomnia plugin - AWS IAM credential loader from an AWS profile',
    args: [
      {
        displayName: 'Profile name',
        help: 'Specify the AWS profile name for fetching credentials.',
        type: 'string',
        placeholder: 'Specify the AWS profile name for fetching credentials.'
      },
      {
        displayName: 'Attribute',
        type: 'enum',
        options: [
          {
            displayName: Attribute.accessKeyId,
            value: Attribute.accessKeyId,
          },
          {
            displayName: Attribute.secretAccessKey,
            value: Attribute.secretAccessKey,
          },
          {
            displayName: Attribute.sessionToken,
            value: Attribute.sessionToken,
          }
        ]
      }
    ],
    async run(context: unknown, profileName: string, attribute: Attribute) {
      if (profileName in cachedCredentials) {
        return cachedCredentials[profileName][attribute];
      }
      
      const credentialProvider = fromNodeProviderChain({
        profile: profileName,
      });

      const creds = await credentialProvider();

      cachedCredentials[profileName] = creds;

      setTimeout(() => {
        delete cachedCredentials[profileName];
      }, creds.expiration!.getMilliseconds() - new Date().getMilliseconds());

      return creds[attribute];
    }
  }
];
