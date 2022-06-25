<script setup>
import { storeToRefs } from 'pinia'
import { useStore } from '@/store/store'
const store = useStore()
const { id, user, tokens } = storeToRefs(store)
const router = useRouter()

const account = reactive({})

  const { data, error } = await useFetch(`/api/account/${id.value}`, {
    method: 'GET',
  })

  if (error.value) {
    console.log('An error has occured!\n%j' , error.value)
  }

  account.value = data.value.account

const tokenValue = (t) => {
  const found = tokens.value.find((to) => to.base === t.denom)
  return t.amount * found.price.cad
}

const tokenName = (t) => {
  const found = tokens.value.find((to) => to.base === t.denom)
  return found.name
}
const tokenImage = (t) => {
  const found = tokens.value.find((to) => to.base === t.denom)
  return found.image
}

const formatCurrency = (value, currency) => {
  const locale = currency === 'eur' ? 'fr-FR' : 'en-US'
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  })
  return formatter.format(value)
}
</script>

<template>
  <NuxtLayout name="home">
    <v-row>
      <v-col sm="10" md="8">
        <div class="text-h2">Dashboard</div>
      </v-col>
    </v-row>
    <v-row v-if="account.value">
      <v-col>
        <div class="text-h3">Accounts</div>
        <v-card>
          <v-col v-for="acc in account.value.accounts">
            <div class="text-h4">{{ acc.name }}</div>
            <div class="text-body-1"><strong>Bech32 (118):</strong> {{ acc.bech32Address }}</div>
            <div class="text-body-1"><strong>Evmos:</strong> {{ acc.evmosAddress }}</div>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="account.value">
      <v-col>
        <div class="text-h3">Tokens</div>
        <v-table>
          <thead>
            <tr>
              <td>Denom</td>
              <td>Amount</td>
              <td>Value</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="token in account.value.tokens.total">
              <td>
                <v-img width="35" v-if="tokenImage(token)" :src="tokenImage(token)"></v-img>
              </td>
              <td>{{ tokenName(token) }}</td>
              <td>{{ token.amount.toFixed(2) }}</td>
              <td>{{ formatCurrency(tokenValue(token), 'cad') }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </NuxtLayout>
</template>

<style scoped>
.text-body-1 {
  color: black;
}

td,
.text-h4 {
  color: black;
}
</style>
