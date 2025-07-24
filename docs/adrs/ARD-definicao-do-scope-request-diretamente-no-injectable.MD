`Decisão`: Usar Scope.REQUEST diretamente no decorator @Injectable() ao invés de definir o escopo no array de providers.

`Contexto`: Projeto NestJS com necessidade de injeção de dependências com escopo por requisição.

## 🎯 Problema

Alguns serviços precisam ser instanciados a cada requisição, como o UnitOfWork, que depende do contexto de transação ou usuário. Para isso, o NestJS oferece o escopo Scope.REQUEST.

Há duas formas de declarar um escopo no NestJS:

1. Via decorator no próprio serviço:

```ts
@Injectable({ scope: Scope.REQUEST })
export class UnitOfWork { ... }
```

2. Via array de providers no módulo:

```ts
providers: [
  {
    provide: UnitOfWork,
    useClass: UnitOfWork,
    scope: Scope.REQUEST,
  },
];
```

# ✅ Decisão

Optei por declarar o escopo diretamente no decorator @Injectable, da seguinte forma:

```ts
@Injectable({ scope: Scope.REQUEST })
export class UnitOfWork { ... }
```

## 📌 Justificativas

- 🔍 Clareza na definição: A anotação no próprio arquivo da classe facilita para outros desenvolvedores entenderem rapidamente que o serviço é request-scoped, sem precisar caçar no array de providers.
- 📁 Coesão por responsabilidade: A classe UnitOfWork sabe de sua natureza request-scoped, então faz sentido declarar isso nela mesma, tornando-a autossuficiente.
- ⚠️ Menor risco de erro: Definir no provider exige lembrar de configurar escopo manualmente toda vez que usar a classe. Com o decorator, o comportamento é garantido em qualquer lugar do projeto onde ela for usada.
- 📚 Recomendação da documentação do NestJS: A própria documentação oficial usa o padrão com @Injectable({ scope: ... }).

# 🔄 Implicações

- Serviços request-scoped só podem ser injetados em escopos iguais ou maiores (por exemplo: outros serviços request ou transient).
- Ao injetar um request-scoped em um handler singleton, deve-se usar ModuleRef.resolve() para evitar erros de escopo.
- Isso impacta o uso com CQRS, onde muitos CommandHandlers são singleton por padrão.

# Exemplo com ModuleRef

```ts
@Injectable()
export class MyHandler implements ICommandHandler {
  constructor(private readonly moduleRef: ModuleRef) {}

  async execute(command: MyCommand): Promise<void> {
    const uow = await this.moduleRef.resolve(UnitOfWork, { strict: false });
    await uow.commit();
  }
}
```
