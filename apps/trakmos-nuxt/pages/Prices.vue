<script setup>
import { storeToRefs } from 'pinia';
import { useStore } from "@/store/store"

const store = useStore();
const { tokens } = storeToRefs(store);


const formatCurrency = (value, currency) => {
    const locale = currency === "eur" ? "fr-FR" : "en-US";
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    });
    return formatter.format(value);
}
</script>

<template>
    <NuxtLayout name="home">
        <v-row>
            <v-col>
                <div class="text-h2 mb-10">Cosmos tokens</div>
            </v-col>
        </v-row>
        <v-row v-if="tokens">
            <v-table class="table">
                <thead class="table">
                    <tr>
                        <th> </th>
                        <th></th>
                        <th>Network</th>
                        <th>symbol</th>
                        <th>USD</th>
                        <th>CAD</th>
                        <th>EUR</th>
                    </tr>
                </thead>
                <tbody class="table">
                    <tr v-for="token in tokens">
                        <td>
                            <v-img  width="35"  v-if="token.image" :src="token.image"></v-img>
                        </td>
                        <td>{{ token.name }}</td>
                        <td>{{ token.network.slice(0,1).toUpperCase() + token.network.slice(1) }}</td>
                        <td>{{ token.symbol }}</td>
                        <td>{{ token.price ? formatCurrency(token.price.usd, "usd"): "-" }}</td>
                        <td>{{ token.price ? formatCurrency(token.price.cad, "cad"): "-" }}</td>
                        <td>{{ token.price ? formatCurrency(token.price.eur, "eur"): "-" }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-row>

    </NuxtLayout>
</template>

<style>
.table {
    color:black;
}
</style>