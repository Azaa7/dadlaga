<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Delivery Information -->
      <div class="space-y-6">
        <h2 class="text-xl font-bold mb-4">Delivery Information</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-gray-300 mb-2">Full Name</label>
            <input 
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">Phone Number</label>
            <input 
              v-model="form.phone"
              type="tel"
              required
              class="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">Delivery Address</label>
            <textarea 
              v-model="form.address"
              required
              rows="3"
              class="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
            ></textarea>
          </div>

          <div>
            <label class="block text-gray-300 mb-2">Delivery Notes (Optional)</label>
            <textarea 
              v-model="form.notes"
              rows="2"
              class="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
              placeholder="Any special instructions for delivery..."
            ></textarea>
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-400 
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Processing...' : 'Place Order' }}
          </button>
        </form>
      </div>

      <!-- Order Summary -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">Order Summary</h2>
        
        <!-- Cart Items -->
        <div class="space-y-4 mb-6">
          <div v-for="item in cart.items" :key="item.recipe.id" 
               class="flex justify-between items-center">
            <div>
              <h3 class="font-medium">{{ item.recipe.name }}</h3>
              <p class="text-sm text-gray-400">Piece: {{ item.quantity }}</p>
            </div>
            <span>${{ (item.recipe.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Totals -->
        <div class="border-t border-gray-700 pt-4 space-y-2">
          <div class="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-400">
            <span>Delivery Fee</span>
            <span>${{ deliveryFee.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg pt-2">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCart } from '~/composables/useCart'
import { useRouter } from 'vue-router'

const cart = useCart()
const router = useRouter()
const loading = ref(false)

const form = ref({
  name: '',
  phone: '',
  address: '',
  notes: ''
})

const subtotal = computed(() => {
  return cart.items.reduce((total, item) => total + (item.recipe.price * item.quantity), 0)
})

const deliveryFee = computed(() => {
  return cart.items.length ? 5.00 : 0
})

const total = computed(() => {
  return subtotal.value + deliveryFee.value
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    cart.clearCart()
    router.push('/order-success')
  } catch (error) {
    alert('Failed to place order. Please try again.')
  } finally {
    loading.value = false
  }
}
</script> 