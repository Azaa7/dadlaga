<template>
  <div class="min-h-screen bg-gray-800 text-white">
    <!-- Navigation -->
    <nav class="bg-black/50 backdrop-blur-md fixed w-full z-10 border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/recipe.png" alt="Logo" class="w-10 h-10" />
            <span class="text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 text-transparent bg-clip-text">
              Recipebase
            </span>
          </NuxtLink>

          <!-- Center Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <NuxtLink 
              v-for="link in navLinks" 
              :key="link.to" 
              :to="link.to"
              class="text-sm font-medium text-gray-300 hover:text-yellow-500 transition-colors"
              :class="{ 'text-yellow-500': route.path === link.to }"
            >
              {{ link.text }}
            </NuxtLink>
          </div>

          <!-- Right Side -->
          <div class="flex items-center gap-4">
            <!-- Cart -->
            <NuxtLink 
              to="/cart" 
              class="relative p-2 text-gray-300 hover:text-yellow-500 transition-colors"
            >
              <span class="text-xl">🛒</span>
              <span 
                v-if="cartItemsCount" 
                class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center 
                       bg-yellow-500 text-black text-xs font-bold rounded-full"
              >
                {{ cartItemsCount }}
              </span>
            </NuxtLink>

            <!-- Auth Section -->
            <ClientOnly>
              <template v-if="auth?.isAuthenticated">
                <NuxtLink 
                  to="/create-recipe" 
                  class="hidden md:flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 
                         rounded-lg hover:bg-yellow-400 transition-colors text-sm font-medium"
                >
                  <span>Create Recipe</span>
                  <span>+</span>
                </NuxtLink>
                
                <div class="relative group">
                  <button class="flex items-center gap-2 p-2 text-gray-300 hover:text-white">
                    <span class="text-xl">👤</span>
                    <span class="text-sm hidden md:block">{{ auth.user?.email }}</span>
                  </button>
                  <div class="absolute right-0 mt-2 w-48 py-2 bg-gray-800/95 backdrop-blur-sm rounded-xl 
                            shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 
                            group-hover:visible transition-all">
                    <button 
                      @click="handleLogout" 
                      class="w-full px-4 py-2 text-left text-gray-300 hover:text-white 
                             hover:bg-gray-700/50 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </template>

              <NuxtLink 
                v-else 
                to="/login" 
                class="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg 
                       hover:bg-yellow-400 transition-colors text-sm font-medium"
              >
                <span>Login</span>
                <span>→</span>
              </NuxtLink>
            </ClientOnly>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-16 bg-gray-900">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="mt-24 bg-black/50 border-t border-white/10">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-300 
                       text-transparent bg-clip-text">Recipebase</h3>
            <p class="text-gray-400">Discover and share amazing recipes with our community.</p>
          </div>
          
          <div>
            <h4 class="font-semibold mb-4">Categories</h4>
            <div class="space-y-2">
              <a href="#" class="block text-gray-400 hover:text-yellow-500">Breakfast</a>
              <a href="#" class="block text-gray-400 hover:text-yellow-500">Lunch</a>
              <a href="#" class="block text-gray-400 hover:text-yellow-500">Dinner</a>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold mb-4">Connect</h4>
            <div class="flex gap-4">
              <a href="#" class="text-gray-400 hover:text-yellow-500 text-xl">📱</a>
              <a href="#" class="text-gray-400 hover:text-yellow-500 text-xl">📸</a>
              <a href="#" class="text-gray-400 hover:text-yellow-500 text-xl">🐦</a>
            </div>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>© 2024 Recipebase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useCart } from '~/composables/useCart'

const auth = useAuth()
const cart = useCart()
const router = useRouter()
const route = useRoute()

const navLinks = [
  { to: '/', text: 'Home' },
  { to: '/about', text: 'About' }
]

const cartItemsCount = computed(() => cart.items.length)

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script> 