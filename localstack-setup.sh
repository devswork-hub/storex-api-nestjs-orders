#!/bin/sh
echo "Initializing localstack s3"

awslocal s3 mb s3://incircl
awslocal sqs create-queue --queue-name my-app-queue
awslocal ses verify-email-identity --email-address app@demo.com
awslocal rds create-db-instance --db-instance-identifier mydb --db-instance-class db.t2.micro --engine mysql --master-username admin --master-user-password password --allocated-storage 20
awslocal rds wait db-instance-available --db-instance-identifier mydb
awslocal rds describe-db-instances --db-instance-identifier mydb
awslocal rds describe-db-instances --db-instance-identifier mydb --query "DBInstances[0].Endpoint.Address" --output text >db_endpoint.txt
DB_ENDPOINT=$(cat db_endpoint.txt)
echo "DB Endpoint: $DB_ENDPOINT"