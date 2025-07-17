import "server-only";
import { db } from "@/db";
import { categoriesTable } from "@/db/schema";
import { CategoryRepositoryInterface } from "./category.repository.interface";
import { Category } from "./category.type";

export class CategoryRepository implements CategoryRepositoryInterface {
  async findAll(): Promise<Category[]> {
    return db.select().from(categoriesTable);
  }
}