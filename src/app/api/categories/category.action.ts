import "server-only";
import { CategoryRepository } from "./category.repository";

const repo = new CategoryRepository();

export async function getCategories() {
  return repo.findAll();
}