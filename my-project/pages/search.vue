<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <!-- Path Section -->
    <div class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <NuxtLink to="/" class="hover:text-yellow-500">Home</NuxtLink>
      <span>/</span>
      <span>Search</span>
      <span>/</span>
      <span class="text-yellow-500">"{{ searchQuery }}"</span>
    </div>

    <h1 class="text-3xl font-bold mb-8">
      Search Results for "{{ searchQuery }}"
    </h1>
    
    <div v-if="loading" class="text-center py-12">
      Loading...
    </div>
    
    <div v-else-if="!searchResults.length" class="text-center py-12">
      No recipes found for "{{ searchQuery }}"
    </div>
    
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <RecipeCard 
        v-for="recipe in filteredRecipes" 
        :key="recipe.id" 
        :recipe="recipe"
        @click="selectedRecipe = recipe"
      />
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
import { useRoute } from 'vue-router'
import { useRecipes } from '~/composables/useRecipes'
import RecipeCard from '~/components/RecipeCard.vue'
import RecipeModal from '~/components/RecipeModal.vue'

const route = useRoute()
const recipes = useRecipes()
const loading = ref(false)

const searchQuery = computed(() => route.query.q as string)

const searchResults = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return recipes.recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(query) ||
    recipe.category.toLowerCase().includes(query) ||
    recipe.ingredients.some(i => i.toLowerCase().includes(query))
  )
})

const selectedRecipe = ref<Recipe | null>(null)

// Fetch recipes when component mounts
onMounted(async () => {
  loading.value = true
  await recipes.fetchRecipes()
  loading.value = false
})

// Watch for query changes
watch(() => route.query.q, async () => {
  loading.value = true
  await recipes.fetchRecipes()
  loading.value = false
})
</script> 