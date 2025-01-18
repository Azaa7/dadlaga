<template>
  <div 
    :class="[
      'recipe-card cursor-pointer',
      { featured }
    ]"
    @click="$emit('click')"
  >
    <div class="aspect-video relative overflow-hidden">
      <div 
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
      <div class="flex justify-between items-center">
        <button
          class="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types'

defineProps<{
  recipe: Recipe
  featured?: boolean
}>()

defineEmits<{
  click: []
}>()
</script> 