<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex items-center gap-4 mb-12">
      <h1 class="text-4xl font-bold">Your Cart</h1>
      <span class="text-gray-400">({{ cart.items.length }} items)</span>
    </div>

    <!-- Empty Cart Message -->
    <div v-if="!cart.items.length" class="text-center py-16 bg-gray-800/50 rounded-2xl backdrop-blur-sm">
      <div class="text-6xl mb-4">🛒</div>
      <p class="text-gray-400 text-xl mb-6">Your cart is empty</p>
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
      >
        <span>Browse Recipes</span>
        <span>→</span>
      </NuxtLink>
    </div>

    <!-- Cart Items -->
    <div v-else class="grid gap-8 md:grid-cols-[1fr,380px]">
      <!-- Items List -->
      <div class="space-y-4">
        <TransitionGroup name="list">
          <div 
            v-for="item in cart.items" 
            :key="item.recipe.id"
            class="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-gray-800 transition-colors"
          >
            <div class="flex items-center gap-6">
              <!-- Recipe Image -->
              <div class="w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                <div 
                  :class="[
                    'w-full h-full bg-gradient-to-br transform group-hover:scale-110 transition-transform duration-500',
                    item.recipe.bgColor
                  ]"
                ></div>
              </div>

              <!-- Recipe Details -->
              <div class="flex-1">
                <h3 class="text-xl font-semibold mb-2">{{ item.recipe.name }}</h3>
                <div class="flex items-center gap-4 text-gray-400">
                  <span>👥 {{ item.recipe.servings }} servings</span>
                </div>
              </div>

              <!-- Price and Controls -->
              <div class="flex flex-col items-end gap-4">
                <p class="text-yellow-500 font-semibold text-xl">
                  Pieces: {{ item.quantity }}
                </p>
                
                <div class="flex items-center gap-3 bg-gray-700/50 rounded-lg p-1">
                  <button 
                    @click="decreaseQuantity(item)"
                    class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-600 transition-colors"
                  >
                    −
                  </button>
                  <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                  <button 
                    @click="increaseQuantity(item)"
                    class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button 
                  @click="removeFromCart(item.recipe)"
                  class="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove from cart"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Order Summary -->
      <div class="sticky top-20 h-fit">
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-6">Order Summary</h2>
          
          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>${{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>Delivery Fee</span>
              <span>$5.00</span>
            </div>
            <div class="h-px bg-gray-700"></div>
            <div class="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${{ (cartTotal + 5).toFixed(2) }}</span>
            </div>
          </div>

          <button 
            class="w-full bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-400 
                   disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!cart.items.length"
            @click="router.push('/checkout')"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe, CartItem } from '~/types'

const cart = useCart()
const router = useRouter()

// Calculate cart total
const cartTotal = computed(() => 
  cart.items.reduce((total, item) => 
    total + (item.recipe.price * item.quantity), 0
  )
)

// Cart functions
const increaseQuantity = (item: CartItem) => {
  cart.updateQuantity(item.recipe, item.quantity + 1)
}

const decreaseQuantity = (item: CartItem) => {
  if (item.quantity > 1) {
    cart.updateQuantity(item.recipe, item.quantity - 1)
  } else {
    removeFromCart(item.recipe)
  }
}

const removeFromCart = (recipe: Recipe) => {
  if (confirm('Remove this item from cart?')) {
    cart.removeFromCart(recipe)
  }
}

const checkout = () => {
  // Implement checkout logic here
  alert('Checkout functionality coming soon!')
}
</script> 

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
}
</style> 