export interface Recipe {
  id: string
  name: string
  category: string
  cuisine: string
  dietaryType: string[]
  difficulty: string
  ingredients: string[]
  instructions: string[]
  servings: number
  bgColor: string
  userId?: string
  image?: string
  price: number
  cookingTime: number
  createdAt: string
}

export interface User {
  id: string
  uid: string
  email: string
  name: string
}

export interface CartItem {
  recipe: Recipe
  quantity: number
  notes?: string
} 