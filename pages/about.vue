<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-20">
      <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-yellow-300 text-transparent bg-clip-text">
        About us
      </h1>
      <p class="text-xl text-gray-400 max-w-3xl mx-auto">
        We're building the best platform for food lovers to discover, share, and cook amazing recipes from around the world.
      </p>
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-3 gap-8 mb-24">
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800/70 transition-colors">
        <div class="text-4xl mb-4">🌟</div>
        <h3 class="text-xl font-semibold mb-3">Curated Recipes</h3>
        <p class="text-gray-400">
          Discover hand-picked recipes from professional chefs and passionate home cooks.
        </p>
      </div>

      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800/70 transition-colors">
        <div class="text-4xl mb-4">👨‍👩‍👧‍👦</div>
        <h3 class="text-xl font-semibold mb-3">Community Driven</h3>
        <p class="text-gray-400">
          Join a vibrant community of food enthusiasts sharing their culinary experiences.
        </p>
      </div>

      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800/70 transition-colors">
        <div class="text-4xl mb-4">📱</div>
        <h3 class="text-xl font-semibold mb-3">Easy to Use</h3>
        <p class="text-gray-400">
          Intuitive interface designed to make cooking and sharing recipes a breeze.
        </p>
      </div>
    </div>

    <!-- Mission Section -->
    <div class="mb-24">
      <div class="bg-gradient-to-br from-yellow-500/10 to-transparent backdrop-blur-sm rounded-2xl p-12">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-6">Our Mission</h2>
          <p class="text-gray-300 text-lg leading-relaxed mb-8">
            Our mission is to discover delicious recipes that inspire creativity in the kitchen, balancing flavor, nutrition, and accessibility while celebrating diverse cuisines and cultures; we focus on fresh, simple ingredients, easy-to-follow instructions, catering to dietary needs, and sharing the joy of cooking to bring people together over meals.
          </p>
          <NuxtLink 
            to="/"
            class="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-3 rounded-xl 
                   hover:bg-yellow-400 transition-colors font-semibold"
          >
            <span>Let's see</span>
            <span>→</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-8">Get in Touch</h2>
      <p class="text-gray-400 mb-8">
        Have questions or suggestions? We'd love to hear from you!
      </p>
      <div class="flex justify-center gap-6">
        <a href="mailto:contact@recipebase.com" 
           class="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-6 py-3 rounded-xl 
                  hover:bg-gray-800 transition-colors">
          <span>📧</span>
          <span>Email Us</span>
        </a>
        <a href="#" 
           class="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-6 py-3 rounded-xl 
                  hover:bg-gray-800 transition-colors">
          <span>💬</span>
          <span>Live Chat</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(to right, #f59e0b, #fcd34d);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style> 