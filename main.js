"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateTags = void 0;
const credential_providers_1 = require("@aws-sdk/credential-providers");
var Attribute;
(function (Attribute) {
    Attribute["accessKeyId"] = "accessKeyId";
    Attribute["secretAccessKey"] = "secretAccessKey";
    Attribute["sessionToken"] = "sessionToken";
})(Attribute || (Attribute = {}));
const cachedCredentials = {};
exports.templateTags = [
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
        run(context, profileName, attribute) {
            return __awaiter(this, void 0, void 0, function* () {
                if (profileName in cachedCredentials) {
                    return cachedCredentials[profileName][attribute];
                }
                const credentialProvider = (0, credential_providers_1.fromNodeProviderChain)({
                    profile: profileName,
                });
                const creds = yield credentialProvider();
                cachedCredentials[profileName] = creds;
                setTimeout(() => {
                    delete cachedCredentials[profileName];
                }, creds.expiration.getMilliseconds() - new Date().getMilliseconds());
                return creds[attribute];
            });
        }
    }
];
