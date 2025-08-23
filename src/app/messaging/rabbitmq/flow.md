Erro no consumer
│
├─> Se não-retryable → DLQ
│
└─> Se retryable
│
├─> Se retry count < MAX → retry (com delay opcional)
│
└─> Se retry count ≥ MAX → DLQ
