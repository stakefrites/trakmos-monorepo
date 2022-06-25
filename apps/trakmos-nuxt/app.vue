<script setup>
import { storeToRefs } from 'pinia'
import { useStore } from '~/store/store'
const store = useStore()

const { tokens, isTokensLoading } = storeToRefs(store)

const { data: tokensData, pending } = await useFetch(`/api/tokens`);
isTokensLoading.value = pending
tokens.value = tokensData.value
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;700&display=swap');

body,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Josefin Sans', 'Sans',sans-serif;
}

.text-h1,
.text-h2,
.text-h3,
.text-h4,
.text-h5,
.text-h6,
.text-body-1,
.text-body-2 {
  font-family: 'Josefin Sans', 'Sans',sans-serif !important;
}
</style>
