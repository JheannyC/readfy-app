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

```GET: /api/books - lista todos os livros existentes```

---

```GET: /api/book/[id] - retorna um livro específico pelo id```

--- 

```POST: /api/book/register-book - cria um novo livro. O id é gerado automaticamente. Passar o body: ```

```
{
  "titulo": "string",
  "autor": "string",
  "genero": "string",
  "anoPublicacao": number,
  "avaliacao": number
}
```
--- 
