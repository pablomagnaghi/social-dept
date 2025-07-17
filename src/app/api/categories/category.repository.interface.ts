import { Category } from "./category.type";

export interface CategoryRepositoryInterface {
  findAll(): Promise<Category[]>;
}
