const ApiBuilder = require('claudia-api-builder');
const api = new ApiBuilder();

const { swaggerJsonLambda } = require('./swagger/swaggerJsonLambda');
const { swaggerLambda } = require('./swagger/swaggerLambda');

api.get('/swagger', async function () {
  const { body, headers, statusCode } = await swaggerLambda();
  return new ApiBuilder.ApiResponse(JSON.parse(body), headers, statusCode);
});

api.get('/swagger.json', async function (request) {
  const { body, headers, statusCode } = await swaggerJsonLambda(request);
  return new ApiBuilder.ApiResponse(JSON.parse(body), headers, statusCode);
});

// api.registerAuthorizer('MyCognitoAuth', {
//     providerARNs: [`arn:aws:cognito-idp:us-east-1:${process.env.ACCOUNT_ID}:userpool/us-east-1_1u9pmY03e`]
// });

module.exports = api;
