# Esse YAML contém o PodSpec dentro do campo spec
# pod.yaml → é o arquivo que contém o PodSpec que você quer rodar.
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml # cria um arquivo pod.yaml

# O API Server lê o YAML e cria um objeto Pod no etcd (estado desejado do cluster).
# Nesse momento, o Pod ainda não está rodando em nenhum nó.
# O Scheduler vai decidir em qual nó ele será executado.
kubectl apply -f pod.yaml # executa o pod


# Aqui você está pegando a representação real do Pod que o cluster criou.
# Esse YAML também tem um campo spec, que é o mesmo PodSpec que o Kubelet vai usar para criar o container no nó
# Em ambos, a parte spec descreve o PodSpec, que é o que o Kubelet vai ler.
kubectl get pod nginx -o yaml > pod-criado.yaml # faz um print dos dados, mas em formato de yaml
# k9s -c po # lista os pods


# Como testar um POD?
# port-forward
# kubectl proxy
# atraves de outro POD

kubectl port-forward pod/nginx -n default 4200:80
kubectl proxy 
http://localhost:8001/api/v1/namespaces/default/pods/nginx
kubectl run test-network --image=nicolaka/netshoot -i --tty --rm # tem que rodar o k9s pra pegar o ip e fazer um culr dentro do terminal iniciado chamando o endpoit mapeado