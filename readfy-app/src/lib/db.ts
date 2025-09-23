import { Book } from "./../app/types/book";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "books.json");

async function readBooks(): Promise<Book[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Book[]) : [];
  } catch (err: any) {
    if (err?.code === "ENOENT") return [];
    throw err;
  }
}

async function writeBooks(data: Book[]): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(DATA_PATH, json, "utf-8");
}

export const db = {
  async list(): Promise<Book[]> {
    return await readBooks();
  },
  async get(id: string) {
    const books = await readBooks();
    return books.find((b) => b.id === id) || null;
  },
  async create(data: Omit<Book, "id">) {
    const books = await readBooks();
    const id = globalThis.crypto?.randomUUID?.() ?? String(Date.now());
    const book: Book = { id, ...data } as Book;
    books.unshift(book);
    await writeBooks(books);
    return book;
  },
  async update(id: string, data: Partial<Book>) {
    const books = await readBooks();
    const i = books.findIndex((b) => b.id === id);
    if (i === -1) return null;
    books[i] = { ...books[i], ...data };
    await writeBooks(books);
    return books[i];
  },
  async remove(id: string) {
    const books = await readBooks();
    const next = books.filter((b) => b.id !== id);
    const changed = next.length !== books.length;
    if (changed) await writeBooks(next);
    return changed;
  },
};
