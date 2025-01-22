<template>
  <div 
    :class="[
      'recipe-card cursor-pointer bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300',
      { featured }
    ]"
    @click="$emit('click')"
  >
    <div class="aspect-video relative overflow-hidden">
      <img 
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div 
        v-else
        :class="[
          'w-full h-full bg-gradient-to-br',
          recipe.bgColor || 'from-yellow-400 to-red-500'
        ]"
      ></div>
    </div>
    <div class="p-4">
      <h3 class="text-xl font-bold mb-2">{{ recipe.name }}</h3>
      <div class="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <span>{{ recipe.category }}</span>
        <span>•</span>
        <span>{{ recipe.cookingTime }}min</span>
      </div>
      <div class="flex justify-between items-center gap-2">
        <button
          class="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          View Details
        </button>
        
        <div class="flex items-center gap-2">
          <button
            v-if="isUserRecipe"
            @click.stop="$emit('edit')"
            class="text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            Edit
          </button>
          
          <div v-else class="flex items-center gap-1">
            <button
              v-if="isInCart"
              @click.stop="updateQuantity(-1)"
              class="px-2 py-1 bg-gray-700 rounded-l text-white hover:bg-gray-600"
            >-</button>
            
            <button
              @click.stop="addToCart"
              class="bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
              :class="{ 'rounded-none': isInCart }"
            >
              {{ isInCart ? `Piece: ${cartItem?.quantity || 0}` : 'Add to Cart' }}
            </button>
            
            <button
              v-if="isInCart"
              @click.stop="updateQuantity(1)"
              class="px-2 py-1 bg-gray-700 rounded-r text-white hover:bg-gray-600"
            >+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Recipe } from '~/types'
import { useAuth } from '~/composables/useAuth'
import { useCart } from '~/composables/useCart'

const auth = useAuth()
const cart = useCart()

const props = defineProps<{
  recipe: Recipe
  featured?: boolean
}>()

defineEmits<{
  click: []
  edit: []
}>()

const isUserRecipe = computed(() => {
  return auth.user?.uid === props.recipe.userId
})

const isInCart = computed(() => {
  return cart.items.some(item => item.recipe.id === props.recipe.id)
})

const addToCart = () => {
  if (!isInCart.value) {
    cart.addToCart(props.recipe)
  }
}

const hasImageError = ref(false)

const handleImageError = () => {
  hasImageError.value = true
}

const cartItem = computed(() => {
  return cart.items.find(item => item.recipe.id === props.recipe.id)
})

const updateQuantity = (change: number) => {
  if (cartItem.value) {
    const newQty = Math.max(0, cartItem.value.quantity + change)
    if (newQty === 0) {
      cart.removeFromCart(props.recipe)
    } else {
      cart.updateQuantity(props.recipe, newQty)
    }
  }
}
</script> 