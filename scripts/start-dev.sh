#!/bin/bash

AWS_ENDPOINT_URL=http://localhost:8000
USER_IDENTITY_TABLE=ci-user-identity

trap ctrl_c INT

function start_local_dynamo() {
    echo "** Starting local dynamodb container $USER_IDENTITY_TABLE **"
    DYNAMO_CONTAINER_ID=`docker run -d -p 8000:8000 amazon/dynamodb-local`
    echo "done"
}

function create_local_db_tables() {
    echo "** Creating dynamodb table $USER_IDENTITY_TABLE **"
    aws dynamodb create-table --table-name $USER_IDENTITY_TABLE \
	--attribute-definitions AttributeName=userId,AttributeType=S \
	--key-schema AttributeName=userId,KeyType=HASH \
	--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
	--endpoint-url $AWS_ENDPOINT_URL > /dev/null

    echo "done"
}

function start_server() {
    echo "** Starting app **"
    AWS_ENDPOINT=$AWS_ENDPOINT_URL nodemon server.js
}

function ctrl_c() {
    echo "** Shutting down **"
    echo "- stopping local dynamodb container"
    docker stop $DYNAMO_CONTAINER_ID > /dev/null
}

start_local_dynamo
create_local_db_tables
start_server
