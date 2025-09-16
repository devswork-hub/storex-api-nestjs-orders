# kubectl delete namespace argocd
# kubectl create namespace argocd
# kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
# kubectl get all -n argocd
# # // Issso
# kubectl patch svc argocd-server -n argocd -p '{"spec": { "type": "NodePort"}}'

# # Ou isso
# # kubectl get svc
# # kubectl edit svc/argocd-server -n argocd
# # kubectl -n argocd patch secret argocd-secret \
# #   -p '{"stringData": {
# #     "admin.password": "$2a$10$rRyBsGSHK6.uc8fntPwVIuLVHgsAhAX7TcdrqW/RADU0uh7CaChLa",
# #     "admin.passwordMtime": "'$(date +%FT%T%Z)'"
# #   }}'
# argocd admin initial-password -n argocd

# # POD=$(kubectl get pods -n argocd -l app.kubernetes.io/name=argocd-server -o jsonpath='{.items[0].metadata.name}')
# # kubectl -n argocd exec -it $POD -- argocd account update-password --account admin --new-password 'admin'
# # kubectl -n argocd get secret argocd-secret -o jsonpath="{.data.admin\.password}" | base64 -d

# # # kubectl port-forward svc/argocd-server -n argocd 8080:443

# kind create cluster --config kind/config.yaml
# kind load docker-image quote-backend --name kube-lab-cluster

# kubectl create namespace pg-operator
# kubectl apply --server-side -f https://raw.githubusercontent.com/percona/percona-postgresql-operator/v2.6.0/deploy/cw-bundle.yaml -n pg-operator

# kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/deploy-ingress-nginx.yaml

kubectl create namespace argocd

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
argocd admin initial-password -n argocd
kubectl port-forward svc/argocd-server -n argocd 9500:443