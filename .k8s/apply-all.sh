#!/bin/bash

# For Unix-like operating systems (Linux Distros, Mac OS ...)
# /> chmod +x apply-all.sh

# Apply all files (including subdirectories)
kubectl apply -f namespace.yaml
kubectl apply -f config-map.yaml
kubectl apply -f nestjs-app.yaml
kubectl apply -f postgres.yaml
kubectl apply -f redis.yaml
kubectl apply -f secrets.yaml
kubectl apply -f redis-nodeport.yaml
