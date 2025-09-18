1. Título

Armazenamento de Value Objects (Money, Currency) como JSON em colunas/documentos, em vez de tabelas relacionadas.

2. Status

Proposto

3. Contexto

No desenvolvimento do sistema, estamos utilizando Value Objects (VOs) como Money e Currency para representar conceitos intrínsecos e imutáveis (ex: um valor monetário com sua moeda). A questão central é como persistir esses VOs em um banco de dados, especificamente em um cenário onde estamos usando o TypeORM (com jsonb no PostgreSQL) e considerando a transição ou compatibilidade com bancos de dados não relacionais.

Atualmente, a abordagem inicial tem sido armazenar o VO Money (que encapsula amount e currency) como um tipo jsonb em uma coluna de uma tabela existente (order_items). Surge a dúvida se esta é a abordagem correta ou se seria mais apropriado separar os atributos do VO em colunas distintas ou até mesmo em tabelas relacionadas.

4. Decisão

Decidimos manter e formalizar a abordagem de armazenar Value Objects como um documento JSON completo (ou seu equivalente em bancos não relacionais) dentro de uma única coluna (em DBs relacionais como jsonb) ou como um subdocumento/campo em um documento principal (em DBs não relacionais).

Isso significa que o VO Money (com seus atributos amount e currency) será serializado e armazenado como um único objeto JSON no campo price (e discount, se aplicável) da entidade OrderItem. A desserialização ocorrerá no momento da leitura para reconstruir a instância do Value Object.

5. Racional

Esta decisão é fundamentada nos seguintes princípios e benefícios:

Preservação da Integridade e Coerência do Value Object: Um VO é uma unidade conceitual. Money(100, BRL) é um conceito coeso. Separar 100 e BRL em colunas ou tabelas distintas quebraria essa coerência, permitindo estados inválidos ou incompletos (e.g., um valor sem sua moeda). Armazenar como JSON garante que o VO seja sempre salvo e recuperado em sua totalidade e validade.

Encapsulamento e Imutabilidade: VOs são imutáveis e encapsulam sua lógica de negócio. Ao armazená-los como um todo, mantemos o encapsulamento. A lógica de manipulação do Money reside na classe Money, não sendo necessário espalhar essa lógica para partes que lidam com a persistência de seus atributos individuais.

Simplicidade do Modelo de Dados e Consultas:

Sem JOINs Desnecessários: Em bancos de dados relacionais, armazenar o VO em uma única coluna jsonb elimina a necessidade de JOINs adicionais para reconstituir o objeto completo, simplificando as consultas e potencialmente melhorando o desempenho de leitura.

Sem Chaves Estrangeiras Artificiais: VOs não possuem identidade. Criar tabelas separadas para eles introduziria chaves primárias e estrangeiras artificiais, adicionando complexidade e um overhead de gerenciamento desnecessário, desvirtuando a natureza do VO.

Compatibilidade com NoSQL: Esta abordagem é intrinsecamente alinhada com a forma como bancos de dados orientados a documentos (como MongoDB) operam, onde objetos complexos são naturalmente armazenados como subdocumentos. Isso facilita uma possível transição ou um modelo de dados híbrido no futuro.

Reflexo Direto do Domínio: O modelo de persistência espelha diretamente o modelo de domínio, onde Money é um objeto único. Isso torna o código mais intuitivo e mais fácil de entender para outros desenvolvedores.

6. Alternativas Consideradas

Separar VOs em Colunas Distintas (e.g., price_amount, price_currency_code):

Prós: Pode facilitar consultas pontuais a um único atributo (ex: todos os itens com price_amount > X).

Contras: Quebra o encapsulamento do VO. Não garante a coerência (você poderia ter um amount sem um currency). Adiciona mais colunas e complexidade ao esquema da tabela para algo que é uma unidade. A lógica de reconstrução do VO ficaria espalhada.

Separar VOs em Tabelas Relacionadas:

Prós: Poderia ser usado se o VO tivesse uma identidade e fosse compartilhado por muitas entidades (tornando-se, na verdade, uma Entidade).

Contras: VOs não possuem identidade própria. Introduz JOINs desnecessários. Aumenta a complexidade do esquema, exige chaves primárias/estrangeiras e gerenciamento de relacionamentos para algo que é uma parte intrínseca de outra entidade. Não se alinha com a natureza do VO.

7. Implicações

Serialização/Desserialização: Será necessário garantir que a serialização do VO para JSON (antes de persistir) e a desserialização de JSON para a instância do VO (após a recuperação) sejam tratadas de forma consistente e robusta pela camada de persistência (ORM ou repositórios).

Consultas por Atributos Internos do VO: Consultas que precisam filtrar ou ordenar por atributos internos do VO (ex: "todos os itens com preço maior que X na moeda Y") exigirão o uso de operadores específicos para jsonb (no PostgreSQL) ou consultas em subdocumentos (em NoSQL). Isso é geralmente suportado pelos bancos de dados modernos e ORMs.

Evolução do VO: Mudanças na estrutura do VO (adição/remoção de atributos) precisarão ser gerenciadas com cuidado, possivelmente exigindo migrações de dados se a estrutura do JSON se tornar incompatível com versões antigas. No entanto, isso é um desafio comum em qualquer alteração de esquema.
