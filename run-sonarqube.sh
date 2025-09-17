docker compose -f docker-compose.sonarqube up -d
npm install -g sonarqube-scanner 
wait 5000
npm run test:cov
npm install -D jest-sonar-reporter

