import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc,
  doc,
  getFirestore 
} from 'firebase/firestore'
import type { Recipe } from '~/types'

export const useSavedRecipes = defineStore('savedRecipes', () => {
  const db = getFirestore()
  const savedRecipesCollection = 'savedRecipes'
  const savedRecipes = ref<Recipe[]>([])
  const loading = ref(false)

  const fetchSavedRecipes = async (userId: string) => {
    try {
      loading.value = true
      const savedRef = collection(db, savedRecipesCollection)
      const q = query(savedRef, where('userId', '==', userId))
      const snapshot = await getDocs(q)
      savedRecipes.value = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Recipe[]
    } catch (error) {
      console.error('Error fetching saved recipes:', error)
      savedRecipes.value = []
    } finally {
      loading.value = false
    }
  }

  const saveRecipe = async (recipe: Recipe, userId: string) => {
    try {
      loading.value = true
      const savedRef = collection(db, savedRecipesCollection)
      await addDoc(savedRef, {
        recipeId: recipe.id,
        userId,
        recipe: recipe,  // Store the entire recipe
        savedAt: new Date().toISOString()
      })
      savedRecipes.value.push(recipe)
    } catch (error) {
      console.error('Error saving recipe:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const unsaveRecipe = async (recipeId: string) => {
    try {
      loading.value = true
      const savedRef = collection(db, savedRecipesCollection)
      const q = query(savedRef, where('recipeId', '==', recipeId))
      const snapshot = await getDocs(q)
      
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref)
      }
      
      savedRecipes.value = savedRecipes.value.filter(r => r.id !== recipeId)
    } catch (error) {
      console.error('Error removing saved recipe:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    savedRecipes,
    loading,
    fetchSavedRecipes,
    saveRecipe,
    unsaveRecipe
  }
}) 