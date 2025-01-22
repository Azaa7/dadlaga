<template>
  <div v-if="recipe" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-2xl font-bold">Edit Recipe</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white text-2xl">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Name -->
        <div>
          <label class="block text-gray-300 mb-2">Recipe Name</label>
          <input 
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-gray-300 mb-2">Category</label>
          <select 
            v-model="form.category"
            required
            class="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Ingredients -->
        <div>
          <label class="block text-gray-300 mb-2">Ingredients</label>
          <div v-for="(ing, index) in form.ingredients" :key="index" class="flex gap-2 mb-2">
            <input 
              v-model="form.ingredients[index]"
              type="text"
              class="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600"
            />
            <button 
              @click="form.ingredients.splice(index, 1)" 
              type="button"
              class="text-red-500 hover:text-red-400"
            >×</button>
          </div>
          <button 
            @click="form.ingredients.push('')" 
            type="button"
            class="text-yellow-500 hover:text-yellow-400"
          >+ Add Ingredient</button>
        </div>

        <!-- Instructions -->
        <div>
          <label class="block text-gray-300 mb-2">Instructions</label>
          <div v-for="(inst, index) in form.instructions" :key="index" class="flex gap-2 mb-2">
            <input 
              v-model="form.instructions[index]"
              type="text"
              class="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600"
            />
            <button 
              @click="form.instructions.splice(index, 1)" 
              type="button"
              class="text-red-500 hover:text-red-400"
            >×</button>
          </div>
          <button 
            @click="form.instructions.push('')" 
            type="button"
            class="text-yellow-500 hover:text-yellow-400"
          >+ Add Step</button>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Recipe } from '~/types'
import { useRecipes } from '~/composables/useRecipes'

const props = defineProps<{
  recipe: Recipe | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const recipes = useRecipes()
const loading = ref(false)
const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert']

const form = reactive({
  name: props.recipe?.name || '',
  category: props.recipe?.category || '',
  ingredients: [...(props.recipe?.ingredients || [])],
  instructions: [...(props.recipe?.instructions || [])]
})

const handleSubmit = async () => {
  if (!props.recipe) return
  
  try {
    loading.value = true
    await recipes.updateRecipe(props.recipe.id, {
      name: form.name,
      category: form.category,
      ingredients: form.ingredients.filter(i => i.trim()),
      instructions: form.instructions.filter(i => i.trim())
    })
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Error updating recipe:', error)
    alert('Failed to update recipe')
  } finally {
    loading.value = false
  }
}
</script> 