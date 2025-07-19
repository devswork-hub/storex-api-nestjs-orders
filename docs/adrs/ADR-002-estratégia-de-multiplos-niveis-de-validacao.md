## 1. Título

Aplicação de Validações em Múltiplos Níveis da Arquitetura.

## 2. Status

Aceito.

## 3. Contexto

Identificamos a necessidade de uma estratégia clara para a aplicação de validações em diferentes camadas da aplicação. A ausência de um padrão pode levar a validações duplicadas, inconsistência no tratamento de erros e um acoplamento desnecessário entre as camadas. Atualmente, a validação de entrada é feita no Command Handler e validações de domínio ocorrem na OrderModel.

## 4. Decisão

Implementaremos um padrão de validação em múltiplos níveis:

- Nível de Aplicação/Entrada (Command Side/Controllers): Responsável pela validação do contrato da entrada externa (formato, tipo, presença de campos obrigatórios).

- Nível de Domínio (Modelos e Value Objects): Responsável pela validação das regras de negócio intrínsecas e invariantes dos agregados e objetos de valor.

- Nível de Use Case (Camada de Aplicação): Responsável por orquestrar validações de alto nível (ex: existência de entidades relacionadas) e traduzir/mapear exceções de domínio ou infraestrutura para um formato compreensível pelas camadas superiores.

## 5. Motivações

As principais motivações para esta decisão são:

- Validação em "Fail Fast": As validações de entrada, sendo as primeiras a serem executadas, permitem um feedback rápido e evitam que dados malformados ou inválidos cheguem às camadas mais profundas e complexas da aplicação.

- Garantia de Invariantes de Domínio: Ao manter as validações de regras de negócio dentro do domínio (OrderModel, Value Objects), garantimos que os objetos de domínio estejam sempre em um estado válido, independentemente de como são criados ou manipulados.

- Separação de Responsabilidades: Cada camada se concentra em seu tipo específico de validação, evitando que a lógica de validação se misture indevidamente. O Command Handler não se preocupa com regras de negócio intrínsecas, e o Domínio não se preocupa com formatos de entrada HTTP.

- Clareza na Origem dos Erros: Facilita a identificação da origem de um erro de validação (se é um problema na entrada do cliente ou uma violação de regra de negócio).

- Manutenibilidade e Reusabilidade: A lógica de validação é encapsulada onde pertence, tornando-a mais fácil de manter e reutilizar.

## 6. Consequências

Positivas:

Melhor feedback para o cliente em caso de erros de validação de entrada.

- Maior integridade dos dados e estado dos objetos de domínio.
- Código mais organizado e fácil de entender.
- Redução do acoplamento entre validações e lógica de negócio.

Negativas:

- Necessidade de implementar e manter classes de validação em diferentes camadas.
- Pode exigir atenção para evitar validações duplicadas desnecessariamente.
