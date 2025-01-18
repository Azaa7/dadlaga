<template>
  <div class="space-y-16">
    <!-- Hero Section with Search -->
    <div class="relative h-[500px] flex items-center justify-center">
      <div class="absolute inset-0 overflow-hidden">
        <div class="w-full h-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600"></div>
        <div class="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div class="relative text-center space-y-8 max-w-3xl mx-auto px-4">
        <h1 class="text-5xl font-bold text-shadow">Welcome to Recipebase</h1>
        <p class="text-xl text-gray-300">Discover and share amazing recipes</p>
        
        <!-- Search Section -->
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search recipes, ingredients..."
              class="w-full px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 
                     text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/50 
                     focus:border-yellow-500 transition-all"
              @keyup.enter="handleSearch"
            />
            <button 
              @click="handleSearch"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-6 py-2 
                     rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Search
            </button>
          </div>
          
          <!-- Popular Tags -->
          <div class="flex flex-wrap gap-2 mt-4 justify-center">
            <button 
              v-for="tag in popularTags" 
              :key="tag"
              @click="searchQuery = tag; handleSearch()"
              class="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm hover:bg-white/20 
                     transition-colors"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories and All Recipes -->
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-2xl font-bold mb-6">All Recipes</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="recipe in recipes.filteredRecipes"
          :key="recipe.id"
          class="bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
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
            <p class="text-gray-400 mb-4">{{ recipe.category }}</p>
            <div class="flex justify-between items-center">
              <div class="flex gap-2">
                <button
                  @click="selectedRecipeForView = recipe"
                  class="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Recipe Detail Modal -->
  <div v-if="selectedRecipeForView" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-2xl font-bold">{{ selectedRecipeForView.name }}</h2>
        <button @click="selectedRecipeForView = null" class="text-gray-400 hover:text-white">×</button>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="aspect-video rounded-lg overflow-hidden">
          <div 
            :class="[
              'w-full h-full bg-gradient-to-br',
              selectedRecipeForView.bgColor || 'from-yellow-400 to-red-500'
            ]"
          ></div>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="font-semibold mb-2">Details</h3>
            <div class="grid grid-cols-2 gap-4 text-gray-300">
              <div>Category: <span class="text-white">{{ selectedRecipeForView.category }}</span></div>
              <div>Cuisine: <span class="text-white">{{ selectedRecipeForView.cuisine }}</span></div>
              <div>Difficulty: <span class="text-white">{{ selectedRecipeForView.difficulty }}</span></div>
              <div>Time: <span class="text-white">{{ selectedRecipeForView.cookingTime }} mins</span></div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold mb-2">Ingredients</h3>
            <ul class="list-disc list-inside space-y-1 text-gray-300">
              <li v-for="ingredient in selectedRecipeForView.ingredients" :key="ingredient">
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold mb-2">Instructions</h3>
            <ol class="list-decimal list-inside space-y-2 text-gray-300">
              <li v-for="(step, index) in selectedRecipeForView.instructions" :key="index">
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
import { ref, onMounted } from 'vue'
import { useRecipes } from '~/composables/useRecipes'
import { useAuth } from '~/composables/useAuth'
import type { Recipe } from '~/types'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const recipes = useRecipes()
const auth = useAuth()
const router = useRouter()

const { filteredRecipes, loading } = storeToRefs(recipes)

const selectedRecipeForView = ref<Recipe | null>(null)
const searchQuery = ref('')

const popularTags = [
  'Breakfast',
  'Quick & Easy',
  'Vegetarian',
  'Desserts',
  'Healthy'
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

onMounted(async () => {
  await recipes.fetchRecipes()
})
</script> 

<style scoped>
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style> 
