import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  getFirestore,
  query,
  where
} from 'firebase/firestore'
import type { Recipe } from '~/types'
import { useAuth } from '~/composables/useAuth'

export const useRecipes = defineStore('recipes', () => {
  const db = getFirestore()
  const recipes = ref<Recipe[]>([])
  const searchQuery = ref('')
  const loading = ref(false)
  const selectedCategory = ref('')
  const selectedCuisine = ref('')
  const selectedDietary = ref('')
  const selectedDifficulty = ref('')
  const timeRange = ref([0, 100])
  const recipesCollection = 'recipes' // Collection name in Firestore

  const fetchRecipes = async () => {
    try {
      loading.value = true
      console.log('Fetching recipes...')
      const recipesRef = collection(db, recipesCollection)
      const snapshot = await getDocs(recipesRef)
      console.log('Recipes fetched:', snapshot.docs.length)
      recipes.value = snapshot.docs.map(doc => ({ 
        ...(doc.data() as Omit<Recipe, 'id'>), 
        id: doc.id 
      }))
      console.log('Recipes processed:', recipes.value)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      recipes.value = []
    } finally {
      loading.value = false
    }
  }

  const filteredRecipes = computed(() => {
    return recipes.value.filter(recipe => {
      // Search query filter
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.value.toLowerCase()))

      // Category filter
      const matchesCategory = !selectedCategory.value || recipe.category === selectedCategory.value

      // Cuisine filter
      const matchesCuisine = !selectedCuisine.value || recipe.cuisine === selectedCuisine.value

      // Dietary filter
      const matchesDietary = !selectedDietary.value || recipe.dietaryType.includes(selectedDietary.value)

      // Difficulty filter
      const matchesDifficulty = !selectedDifficulty.value || recipe.difficulty === selectedDifficulty.value

      // Cooking time filter
      const matchesTime = recipe.cookingTime <= timeRange.value[1]

      return matchesSearch && matchesCategory && matchesCuisine && 
             matchesDietary && matchesDifficulty && matchesTime
    })
  })

  const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
    if (!useAuth().isAuthenticated) {
      throw new Error('Authentication required')
    }

    try {
      loading.value = true
      const recipesRef = collection(db, recipesCollection)
      const docRef = await addDoc(recipesRef, recipe)
      await fetchRecipes()
      return docRef.id
    } catch (error) {
      console.error('Error adding recipe:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateRecipe = async (id: string, data: Partial<Recipe>) => {
    const auth = useAuth()
    const recipe = recipes.value.find(r => r.id === id)
    
    if (!recipe || recipe.userId !== auth.user?.id) {
      throw new Error('Unauthorized: You can only edit your own recipes')
    }

    try {
      await updateDoc(doc(db, 'recipes', id), data)
      const index = recipes.value.findIndex(r => r.id === id)
      if (index !== -1) {
        recipes.value[index] = { ...recipes.value[index], ...data }
      }
    } catch (error) {
      console.error('Error updating recipe:', error)
      throw error
    }
  }

  const deleteRecipe = async (id: string) => {
    const auth = useAuth()
    const recipe = recipes.value.find(r => r.id === id)
    
    if (!recipe || recipe.userId !== auth.user?.id) {
      throw new Error('Unauthorized: You can only delete your own recipes')
    }

    try {
      await deleteDoc(doc(db, 'recipes', id))
      recipes.value = recipes.value.filter(r => r.id !== id)
    } catch (error) {
      console.error('Error deleting recipe:', error)
      throw error
    }
  }

  const userRecipes = computed(() => {
    const auth = useAuth()
    return recipes.value.filter(recipe => recipe.userId === auth.user?.id)
  })

  const deleteAllRecipes = async () => {
    const auth = useAuth()
    if (!auth.user?.uid) {
      throw new Error('Authentication required')
    }

    try {
      loading.value = true
      // Get all recipes by current user
      const recipesRef = collection(db, recipesCollection)
      const q = query(recipesRef, where('userId', '==', auth.user.uid))
      const snapshot = await getDocs(q)
      
      // Delete each recipe
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
      
      // Refresh recipes list
      await fetchRecipes()
    } catch (error) {
      console.error('Error deleting all recipes:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    recipes,
    searchQuery,
    loading,
    selectedCategory,
    selectedCuisine,
    selectedDietary,
    selectedDifficulty,
    timeRange,
    fetchRecipes,
    filteredRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    userRecipes,
    deleteAllRecipes
  }
}) 