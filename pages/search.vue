<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <!-- Search Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search recipes..."
          class="flex-1 px-6 py-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
          @keyup.enter="handleSearch"
        />
        <button
          @click="handleSearch"
          class="px-6 py-3 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400"
        >
          Search
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4">
        <select 
          v-model="selectedCategory"
          class="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <select 
          v-model="selectedDifficulty"
          class="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
        >
          <option value="">All Difficulties</option>
          <option v-for="diff in difficulties" :key="diff" :value="diff">{{ diff }}</option>
        </select>
      </div>
    </div>

    <!-- Results -->
    <div v-if="loading" class="text-center py-12">
      Loading...
    </div>
    
    <div v-else>
      <h2 class="text-2xl font-bold mb-6">
        {{ searchResults.length ? `Found ${searchResults.length} recipes` : 'No recipes found' }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecipeCard 
          v-for="recipe in searchResults" 
          :key="recipe.id" 
          :recipe="recipe"
          @click="selectedRecipe = recipe"
        />
      </div>
    </div>

    <!-- Recipe Modal -->
    <RecipeModal 
      :recipe="selectedRecipe"
      @close="selectedRecipe = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipes } from '~/composables/useRecipes'
import type { Recipe } from '~/types'

const route = useRoute()
const router = useRouter()
const recipes = useRecipes()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedDifficulty = ref('')
const selectedRecipe = ref<Recipe | null>(null)
const loading = ref(false)

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert']
const difficulties = ['Easy', 'Medium', 'Hard']

// Initialize search query from URL
searchQuery.value = route.query.q?.toString() || ''

const searchResults = computed(() => {
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
  if (searchQuery.value.trim()) {
    router.push({ 
      query: { 
        ...route.query,
        q: searchQuery.value.trim() 
      }
    })
  }
}

// Fetch recipes when component mounts
onMounted(async () => {
  loading.value = true
  await recipes.fetchRecipes()
  loading.value = false
})

// Watch for query parameter changes
watch(() => route.query.q, (newQuery) => {
  searchQuery.value = newQuery?.toString() || ''
})
</script> 