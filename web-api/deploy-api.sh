#!/bin/bash -e
ENV=$1
REGION=$2

pushd ./terraform/main
  ../bin/deploy-init.sh "${ENV}"
  ELASTICSEARCH_ENDPOINT="$(terraform output elasticsearch_endpoint)"
  export ELASTICSEARCH_ENDPOINT
popd

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "us-east-1")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

USER_POOL_IRS_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-irs-${ENV}'].Id | [0]" --max-results 30 --region "us-east-1")
USER_POOL_IRS_ID="${USER_POOL_IRS_ID%\"}"
USER_POOL_IRS_ID="${USER_POOL_IRS_ID#\"}"

mkdir -p dist/deploy

# npx parcel build --no-minify --no-source-maps --bundle-node-modules --target node src/api.js
cd dist
cp api.js deploy
cd deploy

rm claudia.json || true

EXIT_CODE=0
aws s3 cp s3://claudia-deploys.$EFCMS_DOMAIN/claudia_${ENV}_${REGION}.json ./claudia.json --region us-east-1 || EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ] ; then 
  echo "making claudia.json"
  npm init -y
  mkdir -p node_modules
  claudia create --name "api-${ENV}" --use-local-dependencies --role "lambda_role_${ENV}" --region "${REGION}" --api-module api --set-env "S3_ENDPOINT=s3.us-east-1.amazonaws.com,DOCUMENTS_BUCKET_NAME=${EFCMS_DOMAIN}-documents-${ENV}-us-east-1,TEMP_DOCUMENTS_BUCKET_NAME=${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1,DYNAMODB_ENDPOINT=dynamodb.${REGION}.amazonaws.com,MASTER_DYNAMODB_ENDPOINT=dynamodb.us-east-1.amazonaws.com,ELASTICSEARCH_ENDPOINT=${ELASTICSEARCH_ENDPOINT},MASTER_REGION=us-east-1,STAGE=${ENV},USER_POOL_ID=${USER_POOL_ID},NODE_ENV=production,EMAIL_SOURCE=noreply@mail.efcms-${ENV}.${EFCMS_DOMAIN},EMAIL_DOCUMENT_SERVED_TEMPLATE=document_served_${ENV},EMAIL_SERVED_PETITION_TEMPLATE=petition_served_${ENV},EFCMS_DOMAIN=${EFCMS_DOMAIN},CLAMAV_DEF_DIR=/opt/var/lib/clamav,CIRCLE_HONEYBADGER_API_KEY=${CIRCLE_HONEYBADGER_API_KEY},IRS_SUPERUSER_EMAIL=${IRS_SUPERUSER_EMAIL}"
  cp claudia.json claudia_${ENV}_${REGION}.json
  aws s3 cp claudia_${ENV}_${REGION}.json s3://claudia-deploys.${EFCMS_DOMAIN} --region us-east-1
else
  echo "updating claudia.json"
  claudia update --use-local-dependencies --set-env "S3_ENDPOINT=s3.us-east-1.amazonaws.com,DOCUMENTS_BUCKET_NAME=${EFCMS_DOMAIN}-documents-${ENV}-us-east-1,TEMP_DOCUMENTS_BUCKET_NAME=${EFCMS_DOMAIN}-temp-documents-${ENV}-us-east-1,DYNAMODB_ENDPOINT=dynamodb.${REGION}.amazonaws.com,MASTER_DYNAMODB_ENDPOINT=dynamodb.us-east-1.amazonaws.com,ELASTICSEARCH_ENDPOINT=${ELASTICSEARCH_ENDPOINT},MASTER_REGION=us-east-1,STAGE=${ENV},USER_POOL_ID=${USER_POOL_ID},NODE_ENV=production,EMAIL_SOURCE=noreply@mail.efcms-${ENV}.${EFCMS_DOMAIN},EMAIL_DOCUMENT_SERVED_TEMPLATE=document_served_${ENV},EMAIL_SERVED_PETITION_TEMPLATE=petition_served_${ENV},EFCMS_DOMAIN=${EFCMS_DOMAIN},CLAMAV_DEF_DIR=/opt/var/lib/clamav,CIRCLE_HONEYBADGER_API_KEY=${CIRCLE_HONEYBADGER_API_KEY},IRS_SUPERUSER_EMAIL=${IRS_SUPERUSER_EMAIL}"
fi
