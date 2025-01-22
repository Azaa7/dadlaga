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
        <div class="max-w-2xl mx-auto space-y-4">
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
          
          <!-- Filters -->
          <div class="flex flex-wrap gap-4 justify-center">
            <select 
              v-model="selectedCategory"
              class="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white"
            >
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>

            <select 
              v-model="selectedDifficulty"
              class="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white"
            >
              <option value="">All Difficulties</option>
              <option v-for="diff in difficulties" :key="diff" :value="diff">{{ diff }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Results Section (scrolls to this when searching) -->
    <div ref="resultsSection" class="max-w-7xl mx-auto px-4">
      <div v-if="loading" class="text-center py-12">
        Loading...
      </div>
      
      <template v-else>
        <h2 class="text-2xl font-bold mb-6">
          {{ searchQuery ? `Search Results (${filteredRecipes.length})` : 'All Recipes' }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecipeCard 
            v-for="recipe in filteredRecipes" 
            :key="recipe.id" 
            :recipe="recipe"
            @click="selectedRecipeForView = recipe"
            @edit="selectedRecipeForEdit = recipe"
          />
        </div>
      </template>
    </div>
  </div>

  <!-- Modals -->
  <RecipeModal 
    :recipe="selectedRecipeForView"
    @close="selectedRecipeForView = null"
  />

  <EditRecipeModal
    v-if="selectedRecipeForEdit"
    :recipe="selectedRecipeForEdit"
    @close="selectedRecipeForEdit = null"
    @saved="handleRecipeSaved"
  />
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRecipes } from '~/composables/useRecipes'
import { useAuth } from '~/composables/useAuth'
import type { Recipe } from '~/types'

const recipes = useRecipes()
const auth = useAuth()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedDifficulty = ref('')
const selectedRecipeForView = ref<Recipe | null>(null)
const selectedRecipeForEdit = ref<Recipe | null>(null)
const loading = ref(false)

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert']
const difficulties = ['Easy', 'Medium', 'Hard']

const resultsSection = ref<HTMLElement | null>(null)

const searchTimeout = ref<NodeJS.Timeout | null>(null)

const filteredRecipes = computed(() => {
  let results = recipes.recipes

  // Text search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(recipe => 
      recipe.name.toLowerCase().includes(query) ||
      recipe.ingredients.some(i => i.toLowerCase().includes(query)) ||
      recipe.category.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (selectedCategory.value) {
    results = results.filter(recipe => recipe.category === selectedCategory.value)
  }

  // Difficulty filter
  if (selectedDifficulty.value) {
    results = results.filter(recipe => recipe.difficulty === selectedDifficulty.value)
  }

  return results
})

const handleSearch = () => {
  // Clear any existing timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // Immediately scroll if there's a search query
  if (searchQuery.value.trim()) {
    resultsSection.value?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

const handleRecipeSaved = async () => {
  await recipes.fetchRecipes()
}

onMounted(async () => {
  loading.value = true
  await recipes.fetchRecipes()
  loading.value = false
})

// Clean up timeout on component unmount
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

<style scoped>
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style> 
