<template>
  <div class="max-w-md mx-auto mt-10 bg-gray-800 p-6 rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8">Welcome to Recipebase</h1>
    <h2 class="text-2xl font-bold mb-6">{{ isRegister ? 'Register' : 'Login' }}</h2>
    
    <!-- Social Login Buttons -->
    <div class="space-y-3 mb-6">
      <button
        @click="handleSocialLogin('google')"
        class="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-2 px-4 rounded hover:bg-gray-100"
      >
        <img src="/google.svg" alt="Google" class="w-5 h-5" />
        Continue with Google
      </button>

      <button
        @click="handleSocialLogin('github')"
        class="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-700"
      >
        <img src="/github.svg" alt="GitHub" class="w-5 h-5" />
        Continue with GitHub
      </button>

      <button
        @click="handleSocialLogin('facebook')"
        class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        <img src="/facebook.svg" alt="Facebook" class="w-5 h-5" />
        Continue with Facebook
      </button>
    </div>

    <div class="relative mb-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-600"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-gray-800 text-gray-400">Or continue with email</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-gray-300">Email</label>
        <input
          v-model="email"
          type="email"
          class="w-full border rounded px-3 py-2 bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      <div>
        <label class="block text-gray-300">Password</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full border rounded px-3 py-2 bg-gray-700 border-gray-600 text-white"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>
      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>
      <button
        type="submit"
        class="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400 disabled:opacity-50"
        :disabled="loading"
      >
        <span v-if="loading">Loading...</span>
        <span v-else>{{ isRegister ? 'Register' : 'Login' }}</span>
      </button>
      <p class="text-center text-gray-400">
        {{ isRegister ? 'Already have an account?' : "Don't have an account?" }}
        <button
          type="button"
          @click="isRegister = !isRegister"
          class="text-yellow-500 hover:underline"
        >
          {{ isRegister ? 'Login' : 'Register' }}
        </button>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const isRegister = ref(false)
const showPassword = ref(false)

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const success = isRegister.value 
      ? await auth.register(email.value, password.value)
      : await auth.login(email.value, password.value)
    
    if (success) {
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.message || 'Authentication failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
  try {
    loading.value = true
    let success = false

    switch (provider) {
      case 'google':
        success = await auth.signInWithGoogle()
        break
      case 'github':
        success = await auth.signInWithGithub()
        break
      case 'facebook':
        success = await auth.signInWithFacebook()
        break
    }

    if (success) {
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.message || 'Authentication failed'
  } finally {
    loading.value = false
  }
}
</script> 