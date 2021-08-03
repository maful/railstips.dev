export interface Category {
  id?: string;
  rank: number;
  name: string;
  active: boolean;
  created_at?: Date;
}

export type Categories = Category[]
