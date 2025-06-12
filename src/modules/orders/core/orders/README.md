### Sobre o Schema

- `billingAddressSnapshot`:
  - O endereço de cobrança pode mudar no sistema do cliente depois que o pedido foi feito (ex.: cliente atualiza cadastro).
  - Se o pedido só guardar um ID ou referência ao endereço, e esse endereço mudar depois, o histórico do pedido fica inconsistente — você perde o estado original daquela compra.
