import { promises as fs } from "fs";
import path from "path";
import { Book } from "@/app/types/book";

export async function PUT(request: Request, { params }: { params: { id: string} }) {
    try {
        const {id} = params;
        const body = await request.json();

        const filePath = path.join(process.cwd(), "data", "books.json");
        const data = await fs.readFile(filePath, "utf-8");
        let books: Book[] = JSON.parse(data);

        const index = books.findIndex((b) => b.id === id);
        if (index === -1) {
            return Response.json({ error: "Livro não encontrado" }, { status: 404 });
        }
        
        const { id: _, ...updateFields } = body;
        books[index] = { ...books[index], ...updateFields };

        await fs.writeFile(filePath, JSON.stringify(books, null, 2));

        return Response.json({
            message: "Livro atualizado com sucesso!",
            book: books[index],
        });

    } catch(error: any){

    }

}
