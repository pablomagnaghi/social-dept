import { NextResponse } from "next/server";
import { CategoriesHandler } from "./category.handler";
import { CategoryRepository } from "./category.repository";

export async function GET() {
  const handler = new CategoriesHandler(new CategoryRepository());
  const categories = await handler.execute();
  return NextResponse.json(categories);
}