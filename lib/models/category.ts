export interface Category {
  id?: string;
  rank: number;
  name: string;
  active: boolean;
  created_at?: Date;
}

export interface UpdateCategoryForm {
  id: string;
  category: Category;
}

export type Categories = Category[]
