# # Localstack
# brew install localstack/tap/localstack-cli

# # AWS Clients
# npm i -g @aws-sdk/client-sns

# # Nest.js
# npm i -g @nestjs/cli

# export AWS_DEFAULT_REGION=us-east-1 # Or eu-west-1, or whatever you prefer

# awslocal sns create-topic --name order_creation
# awslocal sns subscribe --topic-arn
# \ arn:aws:sns:eu-west-1:000000000000:app_events
# \ --protocol http
# \ --notification-endpoint http://host.docker.internal:3000/_sns/onEvent

# # Create topic and capture ARN
# TOPIC_ARN=$(awslocal sns create-topic --name order_creation | grep -oP '(?<="TopicArn": ")[^"]+')

# # Check if ARN was captured
# if [ -z "$TOPIC_ARN" ]; then
#   echo "Error: Could not retrieve Topic ARN."
#   exit 1
# fi

# echo "Created Topic ARN: $TOPIC_ARN"

# # Subscribe to the captured ARN
# awslocal sns subscribe \
#   --topic-arn "$TOPIC_ARN" \
#   --protocol http \
#   --notification-endpoint http://host.docker.internal:3000/_sns/onEvent
