import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  getAuth,
  type Auth
} from 'firebase/auth'
import type { AuthError } from 'firebase/auth'

export const useAuth = defineStore('auth', () => {
  const { $auth } = useNuxtApp()
  console.log('Auth instance:', $auth)

  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => process.client && !!user.value)

  if (process.client) {
    console.log('Setting up auth listener...')
    onAuthStateChanged($auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser)
      if (firebaseUser) {
        user.value = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User'
        }
      } else {
        user.value = null
      }
    })
  }

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword($auth, email, password)
      user.value = {
        id: userCredential.user.uid,
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: userCredential.user.displayName || 'User'
      }
      return true
    } catch (error) {
      const e = error as AuthError
      console.error('Login error:', e)
      throw new Error(getErrorMessage(e.code))
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword($auth, email, password)
      user.value = {
        id: userCredential.user.uid,
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: 'User'
      }
      return true
    } catch (error) {
      const e = error as AuthError
      console.error('Registration error:', e)
      throw new Error(getErrorMessage(e.code))
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut($auth)
      user.value = null
      return true
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup($auth, provider)
      return true
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  const getProviderName = (providerId: string): string => {
    switch (providerId) {
      case 'google.com':
        return 'Google'
      case 'github.com':
        return 'GitHub'
      case 'facebook.com':
        return 'Facebook'
      case 'password':
        return 'email/password'
      default:
        return 'another method'
    }
  }

  const handleAuthError = async (error: any) => {
    console.error('Auth error:', error)
    
    switch (error.code) {
      case 'auth/account-exists-with-different-credential':
        const email = error.customData?.email
        if (!email) throw new Error('Authentication failed. Please try again.')
        
        const providers = await fetchSignInMethodsForEmail($auth, email)
        if (!providers.length) throw new Error('Authentication failed. Please try again.')
        
        const providerName = getProviderName(providers[0])
        throw new Error(`This email is already registered. Please sign in with ${providerName}`)
      
      case 'auth/popup-blocked':
        throw new Error('Popup was blocked. Please allow popups for this site')
      
      case 'auth/popup-closed-by-user':
        throw new Error('Authentication cancelled')
      
      case 'auth/cancelled-popup-request':
        throw new Error('Too many popup requests')
      
      case 'auth/operation-not-allowed':
        throw new Error('GitHub sign-in is not enabled. Please contact support.')
      
      default:
        throw new Error('Authentication failed. Please try again.')
    }
  }

  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider()
      provider.addScope('user')
      const result = await signInWithPopup($auth, provider)
      return true
    } catch (error: any) {
      return handleAuthError(error)
    }
  }

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider()
    try {
      const result = await signInWithPopup($auth, provider)
      console.log('User signed in:', result.user)
      return true
    } catch (error) {
      console.error('Facebook sign in error:', error)
      throw error
    }
  }

  // Helper function to get user-friendly error messages
  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered'
      case 'auth/invalid-email':
        return 'Invalid email address'
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters'
      case 'auth/user-disabled':
        return 'This account has been disabled'
      case 'auth/user-not-found':
        return 'Email or password is incorrect'
      case 'auth/wrong-password':
        return 'Email or password is incorrect'
      default:
        return 'An error occurred. Please try again'
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    signInWithGoogle,
    signInWithGithub,
    signInWithFacebook
  }
}) 