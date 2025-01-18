<template>
  <div>
    <h1>Your Saved Recipes</h1>
    <div v-for="recipe in savedRecipes" :key="recipe.id">
      <h2>{{ recipe.name }}</h2>
      <p>{{ recipe.instructions }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'

const cart = useCart()
const savedRecipes = cart.savedRecipes
</script> 