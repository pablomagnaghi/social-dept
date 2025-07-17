import { CategoryRepositoryInterface } from "./category.repository.interface";
import type { Category } from "./category.type"; // your type from schema

export class CategoriesHandler {
  constructor(private readonly repo: CategoryRepositoryInterface) {}

  async execute(): Promise<Category[]> {
    return this.repo.findAll();
  }
}