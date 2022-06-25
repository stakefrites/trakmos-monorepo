<script setup>
import { storeToRefs } from 'pinia'
import { useStore } from '~/store/store'

const store = useStore()
const { id, user } = storeToRefs(store)
const router = useRouter()
console.log(router.currentRoute.value.path)

const logOut = () => {
  id.value = null
  router.push('/')
}
</script>

<template>
  <v-app-bar color="transparent" flat="true">
    <v-app-bar-title @click="router.push('/')" class="ml-10">
      <img
        height="50"
        class="image"
        src="~/assets/Trakmos-logo.png"
        alt="Trakmos Logo"
      />
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <div class="d-flex" v-if="router.currentRoute.value.path === '/'">
      <div @click="router.push('/login')" class="item">App</div>
      <div class="item mr-10" @click="router.push('/prices')">Tokens</div>
    </div>
    <v-icon class="mr-10" color="white" @click="logOut">mdi-logout</v-icon>
  </v-app-bar>
</template>

<style>
div {
  color: white;
}
.item {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 300;
  font-size: 1.5em;
  line-height: 32px;
  text-transform: uppercase;
  color: #ffffff;
  margin-left: 18px;
}

.item:hover {
  color: #eb928c;
}
</style>
