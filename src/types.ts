export type Category = 'breakfast' | 'first' | 'second' | 'dessert'

export interface Step {
    id: number
    text: string
}

export interface Recipe {
  id: string
  title: string
  category: Category
  ingredients: string[]
  steps: Step[]
  archived: boolean
  createdAt: number
}