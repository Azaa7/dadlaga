<template>
  <div v-if="props.recipe" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-2xl font-bold">{{ props.recipe.name }}</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="aspect-video rounded-lg overflow-hidden">
          <img 
            v-if="props.recipe.image"
            :src="props.recipe.image"
            :alt="props.recipe.name"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div 
            v-else
            :class="[
              'w-full h-full bg-gradient-to-br',
              props.recipe.bgColor || 'from-yellow-400 to-red-500'
            ]"
          ></div>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="font-semibold mb-2">Details</h3>
            <div class="grid grid-cols-2 gap-4 text-gray-300">
              <div>Category: <span class="text-white">{{ props.recipe.category }}</span></div>
              <div>Cuisine: <span class="text-white">{{ props.recipe.cuisine }}</span></div>
              <div>Difficulty: <span class="text-white">{{ props.recipe.difficulty }}</span></div>
              <div>Time: <span class="text-white">{{ props.recipe.cookingTime }} mins</span></div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold mb-2">Ingredients</h3>
            <ul class="list-disc list-inside space-y-1 text-gray-300">
              <li v-for="ingredient in props.recipe.ingredients" :key="ingredient">
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold mb-2">Instructions</h3>
            <ol class="list-decimal list-inside space-y-2 text-gray-300">
              <li v-for="(step, index) in props.recipe.instructions" :key="index">
                {{ step }}
              </li>
            </ol>
          </div>

          <div class="flex justify-end">
            <button
              @click="addToCart"
              class="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': isInCart }"
              :disabled="isInCart"
            >
              {{ isInCart ? 'In Cart' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Recipe } from '~/types'
import { useCart } from '~/composables/useCart'

const cart = useCart()

const props = defineProps<{
  recipe: Recipe | null
}>()

defineEmits<{
  close: []
}>()

const isInCart = computed(() => 
  props.recipe?.id ? cart.items.some(item => item.recipe.id === props.recipe.id) : false
)

const addToCart = () => {
  if (props.recipe && !isInCart.value) {
    cart.addToCart(props.recipe)
  }
}

const hasImageError = ref(false)

const handleImageError = () => {
  hasImageError.value = true
}
</script> 