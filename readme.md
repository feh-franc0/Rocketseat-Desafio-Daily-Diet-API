# RF - Req. funcionais

- [x] O usuário deve poder registrar uma refeição
- [x] O usuário deve poder manipular suas refeições
- [x] O usuário deve ter acesso as suas métricas

# RN - Regra de negócios

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível identificar o usuário entre as requisições
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações: `As refeições devem ser relacionadas a um usuário.`
    ```node
      {
        Nome,
        Descrição,
        Data e Hora,
        Está dentro ou não da dieta
      }
    ```
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
    ```node
      {
        Quantidade total de refeições registradas,
        Quantidade total de refeições dentro da dieta,
        Quantidade total de refeições fora da dieta,
        Melhor sequência de refeições dentro da dieta
      }
    ```
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

# RNF - Req. ñ/ funcionais