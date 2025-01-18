<template>
  <div v-if="recipe" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-2xl font-bold">{{ recipe.name }}</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="aspect-video rounded-lg overflow-hidden">
          <div 
            :class="[
              'w-full h-full bg-gradient-to-br',
              recipe.bgColor || 'from-yellow-400 to-red-500'
            ]"
          ></div>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="font-semibold mb-2">Details</h3>
            <div class="grid grid-cols-2 gap-4 text-gray-300">
              <div>Category: <span class="text-white">{{ recipe.category }}</span></div>
              <div>Cuisine: <span class="text-white">{{ recipe.cuisine }}</span></div>
              <div>Difficulty: <span class="text-white">{{ recipe.difficulty }}</span></div>
              <div>Time: <span class="text-white">{{ recipe.cookingTime }} mins</span></div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold mb-2">Ingredients</h3>
            <ul class="list-disc list-inside space-y-1 text-gray-300">
              <li v-for="ingredient in recipe.ingredients" :key="ingredient">
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold mb-2">Instructions</h3>
            <ol class="list-decimal list-inside space-y-2 text-gray-300">
              <li v-for="(step, index) in recipe.instructions" :key="index">
                {{ step }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types'

defineProps<{
  recipe: Recipe | null
}>()

defineEmits<{
  close: []
}>()
</script> 