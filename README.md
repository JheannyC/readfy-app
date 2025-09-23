# readfy-app

Para inicializar o projeto, clone o repositório e instale as dependências:

```bash
git clone https://github.com/jeancardoso/readfy-app.git
cd readfy-app
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.


---

# API

## Livros

```GET: /api/books - lista todos os livros existentes```

---

```GET: /api/book/{id} - retorna um livro específico pelo id```

--- 

```POST: /api/book/register - cria um novo livro. O id é gerado automaticamente. Passar o body: ```

```
{
  "titulo": "string",
  "autor": "string",
  "genero": "string",
  "anoPublicacao": number,
  "avaliacao": number,
  "paginas": number,
  "status": "aberto" | "finalizado" | "fechado"
}
```
#### No POST, por default, o status do livro vem "fechado" e a avalicação vem com o valor "0". Para alterar o valor, deve ser realizado no PUT.

--- 

```PUT: /api/book/update/{id} - atualiza um livro existente. Passar o body com um ou mais campos a serem atualizados.```

Por exemplo, se quiser mudar o status do livro, basta passar o body:
```
{
  "status": "fechado" | "aberto" | "finalizado"
}
```

Significado de cada status:
- "fechado": a leitura do livro ainda não foi iniciada
- "aberto": o livro está sendo lido
- "finalizado": a leitura foi finalizada

---
```DELETE: /api/book/delete/{id} - deleta um livro existente pelo ID.```

----
## Dashboard

```GET: /api/dashboard - retorna o dashboard com as informações dos livros```

```
Body que retorna: 

{
    "livrosLendo": number,
    "livrosFinalizados": number,
    "totalPaginasLidas": number,
    "total": number
}
```