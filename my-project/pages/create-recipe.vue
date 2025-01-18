<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Create New Recipe</h1>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Recipe Name -->
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
          <option value="">Select Category</option>
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
            placeholder="Add ingredient"
            class="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600"
          />
          <button 
            @click="removeIngredient(index)" 
            type="button"
            class="px-3 text-red-500 hover:text-red-400"
          >×</button>
        </div>
        <button 
          @click="addIngredient" 
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
            :placeholder="`Step ${index + 1}`"
            class="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600"
          />
          <button 
            @click="removeInstruction(index)" 
            type="button"
            class="px-3 text-red-500 hover:text-red-400"
          >×</button>
        </div>
        <button 
          @click="addInstruction" 
          type="button"
          class="text-yellow-500 hover:text-yellow-400"
        >+ Add Step</button>
      </div>

      <!-- Image Upload Section -->
      <div class="mb-6">
        <label class="block text-gray-300 mb-2">Recipe Image</label>
        <div class="flex items-center gap-4">
          <!-- Preview -->
          <div 
            class="w-32 h-32 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center"
            :class="{ 'border-2 border-dashed border-gray-600': !imagePreview }"
          >
            <img 
              v-if="imagePreview" 
              :src="imagePreview" 
              alt="Preview" 
              class="w-full h-full object-cover"
            />
            <span v-else class="text-gray-400 text-4xl">🖼️</span>
          </div>

          <!-- Upload Controls -->
          <div class="flex-1">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageSelect"
            />
            <div class="space-y-2">
              <button
                type="button"
                @click="$refs.fileInput.click()"
                class="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Select Image
              </button>
              <button 
                v-if="imagePreview"
                type="button"
                @click="clearImage"
                class="px-4 py-2 text-red-500 hover:text-red-400 transition-colors text-sm"
              >
                Remove Image
              </button>
              <p class="text-sm text-gray-400">
                Supported formats: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit"
        :disabled="loading"
        class="w-full bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-400 
               disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Creating...' : 'Create Recipe' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { addDoc, collection } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useNuxtApp } from 'nuxt/app'

const auth = useAuth()
const router = useRouter()
const loading = ref(false)
const { $firestore } = useNuxtApp()

// Redirect if not authenticated
onMounted(() => {
  if (!auth.isAuthenticated) {
    router.push('/login')
  }
})

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert']

const form = ref({
  name: '',
  category: '',
  ingredients: [''],
  instructions: [''],
  userId: auth.user?.uid || '',
  createdAt: new Date().toISOString()
})

const addIngredient = () => form.value.ingredients.push('')
const removeIngredient = (index: number) => form.value.ingredients.splice(index, 1)
const addInstruction = () => form.value.instructions.push('')
const removeInstruction = (index: number) => form.value.instructions.splice(index, 1)

const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string | null>(null)
const imageFile = ref<File | null>(null)

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB')
    return
  }

  // Create preview
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  imagePreview.value = null
  imageFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const uploadImage = async (): Promise<string | null> => {
  if (!imageFile.value) return null

  try {
    const storage = getStorage()
    const imageRef = storageRef(storage, `recipe-images/${Date.now()}-${imageFile.value.name}`)
    await uploadBytes(imageRef, imageFile.value)
    return await getDownloadURL(imageRef)
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

const handleSubmit = async () => {
  if (!auth.user?.uid) {
    alert('Please login to create recipes')
    return
  }

  try {
    loading.value = true
    
    // Upload image if selected
    let imageUrl = null
    if (imageFile.value) {
      imageUrl = await uploadImage()
    }

    const recipeData = {
      name: form.value.name,
      category: form.value.category,
      ingredients: form.value.ingredients.filter(i => i.trim()),
      instructions: form.value.instructions.filter(i => i.trim()),
      userId: auth.user.uid,
      createdAt: new Date().toISOString(),
      image: imageUrl, // Add image URL to recipe data
      // Add required fields from your Recipe type
      cuisine: '',
      dietaryType: [],
      difficulty: 'Easy',
      servings: 1,
      bgColor: 'from-green-400 to-blue-500',
      price: 0,
      cookingTime: 30
    }

    await addDoc(collection($firestore, 'recipes'), recipeData)
    alert('Recipe created successfully!')
    router.push('/')
  } catch (error) {
    console.error('Error creating recipe:', error)
    alert('Failed to create recipe')
  } finally {
    loading.value = false
  }
}
</script> 