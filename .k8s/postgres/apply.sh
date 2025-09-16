kubectl apply -f postgres-svc.yaml,postgres-config.yaml,postgres-deployment.yaml
kubectl apply -f postgres-secret.yaml
kubectl port-forward deployment/postgres 5432:5432 -n spark-apps