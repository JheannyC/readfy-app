# readfy-app

Para inicializar o projeto, clone o repositório e instale as dependências:

```bash
git clone https://github.com/jeancardoso/readfy-app.git
cd readfy-app
npm install
```

Configure um arquivo `.env` na raiz do projeto com a URL do banco de dados:

```
DATABASE_URL="URL_DO_BANCO"
```

Para configurar o banco de dados, execute as migrações:

```bash
npm run prisma:generate && npm run prisma:migrate
```

Para visualizar a interface do banco, utilize o comando:

```bash
npm run prisma:studio
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

```GET: /api/book/genres - retorna todos os gêneros existentes```

```GET: /api/book/genres?name={name} - retorna livros de um gênero específico```


```bash
{
    "totalGeneros": Int,
    "generos": [
        "{genero}"
    ],
    "totalLivros": Int,
    "livros": [
        {
            "id": Int,
            "titulo": "String",
            "autor": "String",
            "genero": "String",
            "anoPublicacao": Int,
            "paginas": Int,
            "status": "String",
            "avaliacao": Int,
            "imgURL": String
        }
    ]
}
```

--- 

```POST: /api/book/register - cria um novo livro. O id é gerado automaticamente. Passar o body: ```

```bash
{
  "titulo": "String",
  "autor": "String",
  "genero": "String",
  "anoPublicacao": Int,
  "paginas": Int,
  "imgURL": String
}
```
#### No POST, por default, o status do livro vem "fechado" e a avalicação vem com o valor "0". Para alterar o valor, deve ser realizado no PUT.

--- 

```PUT: /api/book/update/{id} - atualiza um livro existente. Passar o body com um ou mais campos a serem atualizados.```

Enviando todos os campos:

```bash
{
  "titulo": "String",
  "autor": "String",
  "genero": "String",
  "anoPublicacao": Int,
  "avaliacao": Int,
  "paginas": Int,
  "status": "String" - "aberto" | "finalizado" | "fechado",
  "imgURL": String
}
```
#### No PUT, os campos são opcionais. Se não for passado um campo, ele não será atualizado.

---
Ou atualizando campos individualmente:
Por exemplo, se quiser mudar o status do livro, basta passar o body:
```bash
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

```bash
Body que retorna: 

{
    "totalLivrosRegistrados": Int,
    "livrosNaoIniciados": Int,
    "livrosAbertos": Int,
    "livrosFinalizados": Int
    "totalPaginasLidas": Int
}
```