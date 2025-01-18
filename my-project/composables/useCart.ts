import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Recipe, CartItem } from '~/types'

export const useCart = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const addToCart = (recipe: Recipe) => {
    const existingItem = items.value.find(item => item.recipe.id === recipe.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ recipe, quantity: 1 })
    }
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

  return {
    items,
    addToCart,
    updateQuantity,
    removeFromCart
  }
}) 