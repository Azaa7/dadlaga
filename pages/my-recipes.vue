<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">My Recipes</h1>
      <NuxtLink 
        to="/create-recipe" 
        class="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
      >
        Create New Recipe
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      Loading...
    </div>

    <!-- Empty State -->
    <div v-else-if="!userRecipes.length" class="text-center py-12">
      <p class="text-gray-400 mb-4">You haven't created any recipes yet</p>
      <NuxtLink 
        to="/create-recipe" 
        class="text-yellow-500 hover:text-yellow-400"
      >
        Create your first recipe
      </NuxtLink>
    </div>

    <!-- Recipe Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RecipeCard 
        v-for="recipe in userRecipes" 
        :key="recipe.id" 
        :recipe="recipe"
        @click="selectedRecipeForView = recipe"
        @edit="selectedRecipeForEdit = recipe"
      />
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRecipes } from '~/composables/useRecipes'
import type { Recipe } from '~/types'

const recipes = useRecipes()
const loading = ref(false)
const selectedRecipeForView = ref<Recipe | null>(null)
const selectedRecipeForEdit = ref<Recipe | null>(null)

const userRecipes = computed(() => recipes.userRecipes)

const handleRecipeSaved = async () => {
  await recipes.fetchRecipes()
}

onMounted(async () => {
  loading.value = true
  await recipes.fetchRecipes()
  loading.value = false
})
</script> 