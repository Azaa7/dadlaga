import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Recipe, CartItem } from '~/types'

export const useCart = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const savedRecipes = ref<Recipe[]>([])

  const addToCart = (recipe: Recipe) => {
    const existingItem = items.value.find(item => item.recipe.id === recipe.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ recipe, quantity: 1 })
    }
  }

  const saveRecipe = (recipe: Recipe) => {
    if (!savedRecipes.value.some(saved => saved.id === recipe.id)) {
      savedRecipes.value.push(recipe)
    }
  }

  const removeSavedRecipe = (recipeId: string) => {
    savedRecipes.value = savedRecipes.value.filter(recipe => recipe.id !== recipeId)
  }

  const updateQuantity = (recipe: Recipe, quantity: number) => {
    const item = items.value.find(item => item.recipe.id === recipe.id)
    if (item) {
      item.quantity = quantity
    }
  }

  const removeFromCart = (recipe: Recipe) => {
    items.value = items.value.filter(item => item.recipe.id !== recipe.id)
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    savedRecipes,
    addToCart,
    saveRecipe,
    removeSavedRecipe,
    updateQuantity,
    removeFromCart,
    clearCart
  }
}) 