<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">All Recipes</h1>
      <p class="text-gray-400">Browse our collection of delicious recipes</p>
    </div>

    <!-- Advanced Filters -->
    <div class="mb-8 space-y-6">
      <!-- Search Bar -->
      <div class="relative max-w-xl">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search recipes by name, ingredients..."
          class="w-full px-6 py-3 bg-gray-800 rounded-xl border border-gray-700 text-white 
                 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500"
        />
        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      <!-- Filter Pills -->
      <div class="flex flex-wrap gap-3">
        <!-- Categories -->
        <div class="relative group">
          <button class="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors">
            Category
            <span class="ml-1">▼</span>
          </button>
          <div class="absolute top-full left-0 mt-2 w-48 py-2 bg-gray-800 rounded-xl shadow-xl 
                      border border-gray-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 
                      transition-all z-10">
            <label 
              v-for="category in categories" 
              :key="category"
              class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer"
            >
              <input 
                type="checkbox" 
                v-model="selectedCategories"
                :value="category"
                class="rounded border-gray-600 text-yellow-500 focus:ring-yellow-500"
              >
              <span class="text-sm text-gray-300">{{ category }}</span>
            </label>
          </div>
        </div>

        <!-- Difficulty -->
        <div class="relative group">
          <button class="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors">
            Difficulty
            <span class="ml-1">▼</span>
          </button>
          <div class="absolute top-full left-0 mt-2 w-48 py-2 bg-gray-800 rounded-xl shadow-xl 
                      border border-gray-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 
                      transition-all z-10">
            <label 
              v-for="level in difficulties" 
              :key="level"
              class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer"
            >
              <input 
                type="checkbox" 
                v-model="selectedDifficulties"
                :value="level"
                class="rounded border-gray-600 text-yellow-500 focus:ring-yellow-500"
              >
              <span class="text-sm text-gray-300">{{ level }}</span>
            </label>
          </div>
        </div>

        <!-- Cooking Time -->
        <div class="relative group">
          <button class="px-4 py-2 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors">
            Time
            <span class="ml-1">▼</span>
          </button>
          <div class="absolute top-full left-0 mt-2 w-48 py-2 bg-gray-800 rounded-xl shadow-xl 
                      border border-gray-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 
                      transition-all z-10">
            <label 
              v-for="time in cookingTimes" 
              :key="time.value"
              class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer"
            >
              <input 
                type="checkbox" 
                v-model="selectedTimes"
                :value="time.value"
                class="rounded border-gray-600 text-yellow-500 focus:ring-yellow-500"
              >
              <span class="text-sm text-gray-300">{{ time.label }}</span>
            </label>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="flex items-center gap-2">
          <button 
            @click="clearFilters"
            class="px-4 py-2 bg-yellow-500 text-black rounded-full text-sm hover:bg-yellow-400 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Recipe Grid -->
    <div>
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin text-yellow-500 text-2xl">⌛</div>
        <p class="mt-2 text-gray-400">Loading recipes...</p>
      </div>
      
      <div v-else-if="!filteredRecipes.length" class="text-center py-12">
        <p class="text-gray-400">No recipes found matching your filters</p>
        <button 
          @click="clearFilters"
          class="mt-4 text-yellow-500 hover:text-yellow-400"
        >
          Clear all filters
        </button>
      </div>
      
      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecipeCard 
          v-for="recipe in filteredRecipes" 
          :key="recipe.id" 
          :recipe="recipe"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecipes } from '~/composables/useRecipes'

const recipes = useRecipes()
const loading = ref(false)
const searchQuery = ref('')

// Filter options
const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert']
const difficulties = ['Easy', 'Medium', 'Hard']
const cookingTimes = [
  { label: 'Quick (< 30min)', value: 30 },
  { label: 'Medium (30-60min)', value: 60 },
  { label: 'Long (> 60min)', value: 61 }
]

// Selected filters
const selectedCategories = ref<string[]>([])
const selectedDifficulties = ref<string[]>([])
const selectedTimes = ref<number[]>([])

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 || 
         selectedDifficulties.value.length > 0 || 
         selectedTimes.value.length > 0 ||
         searchQuery.value.trim() !== ''
})

// Computed filtered recipes
const filteredRecipes = computed(() => {
  let result = recipes.recipes

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(recipe => 
      recipe.name.toLowerCase().includes(query) ||
      recipe.category.toLowerCase().includes(query) ||
      recipe.ingredients.some(i => i.toLowerCase().includes(query))
    )
  }

  // Category filter
  if (selectedCategories.value.length) {
    result = result.filter(recipe => selectedCategories.value.includes(recipe.category))
  }

  // Difficulty filter
  if (selectedDifficulties.value.length) {
    result = result.filter(recipe => selectedDifficulties.value.includes(recipe.difficulty))
  }

  // Time filter
  if (selectedTimes.value.length) {
    result = result.filter(recipe => {
      return selectedTimes.value.some(time => {
        if (time === 30) return recipe.cookingTime <= 30
        if (time === 60) return recipe.cookingTime > 30 && recipe.cookingTime <= 60
        return recipe.cookingTime > 60
      })
    })
  }

  return result
})

const clearFilters = () => {
  selectedCategories.value = []
  selectedDifficulties.value = []
  selectedTimes.value = []
  searchQuery.value = ''
}

// Fetch recipes on mount
onMounted(async () => {
  loading.value = true
  await recipes.fetchRecipes()
  loading.value = false
})
</script> 