<script setup>
import { storeToRefs } from 'pinia'
import { useStore } from '~/store/store'
const loginType = ref(null)
const username = ref('jean')
const password = ref('myPassword')
const confirmPassword = ref('myPassword')
const errorMessage = ref(null)
const router = useRouter()
const store = useStore()

const { id, user } = storeToRefs(store)

onBeforeMount(() => {
  if (id.value) {
    router.push('/dashboard')
  }
})

const isSignUp = () => {
  loginType.value = 'signUp'
}

const isSignIn = () => {
  loginType.value = 'signIn'
}

const login = async () => {
  errorMessage.value = null
  const { data } = await useFetch('/api/auth/login', {
    method: 'POST',
    body: {
      user: {
        username: username.value,
        password: password.value
      }
    }
  })
  console.log('data', data.value)
  if (data.value.status === 'error') {
    console.log(`An error has occured: ${data.value.message}`)
    errorMessage.value = data.value.message
  } else {
    id.value = data.value.user
    router.push('/dashboard')
  }
}

const signup = async () => {
  errorMessage.value = null
  const isPasswordMatching = password.value === confirmPassword.value
  if (!isPasswordMatching) {
    errorMessage.value = 'Passwords do not match'
  } else {
    const { data, error } = await useFetch('/api/auth/signup', {
      method: 'POST',
      body: {
        user: {
          username: username.value,
          password: password.value
        }
      }
    })
    console.log('data', data.value)
    if (error.value || data.value.status === 'error') {
      console.log(`An error has occured: ${data.value.message}`)
      errorMessage.value = data.value.message
    } else {
      id.value = data.value.user
      router.push('/onboarding')
    }
  }
}
</script>

<template>
  <NuxtLayout name="home">
    <v-row class="d-flex justify-center">
      <v-col sm="8" md="6" lg="4">
        <MyCard v-if="!loginType" title="Login" hasActions>
          <template v-slot:content>
            <div class="text-body-1">Welcome to trakmos, fren.</div>
            <div class="text-body-2">Are you a recurring griller? 🥩.</div>
          </template>
          <template v-slot:actions>
            <v-btn class="myPrimaryButton" @click="isSignUp">Sign up</v-btn>
            <v-btn class="mySecondaryButton" variant="outlined" @click="isSignIn">login</v-btn>
          </template>
        </MyCard>
        <MyCard v-if="loginType === 'signIn'" title="Welcome back to trakmos, fren." hasActions>
          <v-alert type="error" v-if="errorMessage">{{ errorMessage }}</v-alert>
          <template v-slot:content>
            <div class="text-body-2">Your stake is in your plate, waiting with warm fries. 🍟</div>
            <v-form class="mt-10">
              <v-text-field v-model="username" label="Username" type="text" required bg-color="#76EFD3"> </v-text-field>
              <v-text-field v-model="password" label="Password" type="password" required bg-color="#76EFD3">
              </v-text-field>
            </v-form>
          </template>
          <template v-slot:actions>
            <v-btn class="myPrimaryButton" @click="login">Login</v-btn>
          </template>
        </MyCard>
        <MyCard v-if="loginType === 'signUp'" title="Sign Up" hasActions>
          <template v-slot:content>
            <div class="text-body-1">Hello, fellow cosmonaut.</div>
            <div class="text-body-2">You are tired of managing all of your steaks 🥩.</div>
            <v-form class="mt-10">
              <v-text-field v-model="username" label="Username" type="text" required bg-color="#76EFD3" class="myInput">
              </v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                class="myInput"
                bg-color="#76EFD3"
              >
              </v-text-field>
              <v-text-field
                v-model="confirmPassword"
                label="Confirm your password"
                type="password"
                required
                bg-color="#76EFD3"
              >
              </v-text-field>
            </v-form>
          </template>
          <template v-slot:actions>
            <v-btn class="myPrimaryButton" @click="signup">Sign Up</v-btn>
          </template>
        </MyCard>
      </v-col>
    </v-row>
  </NuxtLayout>
</template>

<style scoped>
.myPrimaryButton {
  background: #070c38 !important;
  border: 1px solid #76efd3 !important;
  border-radius: 6px;
  color: #76efd3;
}
.mySecondaryButton {
  background: #76efd3 !important;
  border: 1px solid #76efd3 !important;
  border-radius: 6px;
  color: #070c38;
}
</style>
