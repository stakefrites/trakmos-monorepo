<script setup>
import { storeToRefs } from 'pinia';
import { useStore } from "@/store/store"

const store = useStore();
const router = useRouter();
const { id } = storeToRefs(store);


const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const NETWORKS = ["cosmoshub", "juno", "evmos"];

const accounts = reactive({
    currentKey: "",
    currency: "",
    accounts: [{
        name: "",
        bech32Address: "",
        evmosAddress: "",
        keyUsed: "",
    }]
})

const items = ref(['usd', 'cad', 'eur']);
const page = ref(1);
const alreadySet = ref(false)
const isLoading = ref(false);

const isAlreadySet = () => { 
    const isIt = accounts.accounts.findIndex(acc => acc.keyUsed === accounts.currentKey);
    if (!isIt) {
        alreadySet.value = false;
        return false
    } else { 
        alreadySet.value = isIt;
        return isIt
    }
}

const setCurrentKey = async () => { 
    await window.keplr.enable(EVMOS_CHAIN_ID);
    const key = await window.keplr.getKey(COSMOS_CHAIN_ID);
    accounts.currentKey = key.name;
    isAlreadySet();
}

window.addEventListener("keplr_keystorechange", setCurrentKey);

const EVMOS_CHAIN_ID = "evmos_9001-2";
const COSMOS_CHAIN_ID = "cosmoshub-4";


onMounted(async () => {
    await setCurrentKey();
});

const getEvmosAddress = async (index) => {
  window.keplr.enable(EVMOS_CHAIN_ID);
  const key = await window.keplr.getKey(EVMOS_CHAIN_ID);
    const address =  key.bech32Address;
    accounts.accounts[index].evmosAddress = address;
    accounts.accounts[index].keyUsed = key.name;
  isAlreadySet();
}

const getBech32Address = async (index) => {
    window.keplr.enable(COSMOS_CHAIN_ID);
    const key = await window.keplr.getKey(COSMOS_CHAIN_ID);
    console.log(key)
    const address = key.bech32Address;
    accounts.accounts[index].bech32Address = address;
    accounts.accounts[index].keyUsed = key.name;
   isAlreadySet();
}



const addOne = () => { 
    accounts.accounts.push({
        name: "",
        bech32Address: "",
        evmosAddress: ""
    });
}

const validatePage1 = () => { 
    if (accounts.accounts.length > 0) {
        return true
    } else { 
        return false
    }
}

const page2 = () => { 
    const isValid = validatePage1();
    if (isValid) {
        page.value = 2;
    } else { 
        console.log("Page 1 is not valid")   
    }
}

const createAccount = async () => {
    isLoading.value = true;
    const { data, error, loading } = await useFetch(`/trakmos/account`, {
        method: "POST",
        baseURL: BASE_URL,
        body: {
            config: {
                accounts: accounts.accounts,
                currency: accounts.currency,
                userId: id.value,
                networks: NETWORKS

            }
        }
    });
    isLoading.value = false;
    if (error.value) {
        console.log("An error occured");
    } else {
        console.log(data);
        router.push("/dashboard");
    }
}



</script>

<template>
  <NuxtLayout name="home">
    <v-row class="d-flex justify-center">
        <v-col sm="8" md="6" lg="4">
            <div class="text-h2">Onboarding</div>
        </v-col>
    </v-row>
    <div  v-if="page == 1">
        <v-row class="d-flex justify-center">
            <v-col sm="8" md="6" lg="4">
                <div class="text-h3">Configure your accounts</div>
                <div class="text-body-2">First, we will configure your different accounts. </div>
                <div class="text-body-2">To do that, we will need to get an address from Keplr and your evmos address from keplr.</div>
                <v-divider></v-divider>
                <div class="mt-2 text-h5">Your Keplr is currently set on <strong>{{accounts.currentKey}}</strong></div>
                {{alreadySet === -1 ? "" : `Make sure you change your Keplr account before setting a new account. This key is used for account #${alreadySet + 1}`}}
            </v-col>
        </v-row>
        <v-row class="d-flex justify-center">
            <v-col sm="8" md="6" lg="6">
                <MyCard hasActions>
                    <template v-slot:content>
                        <div v-for="(account,i) in accounts.accounts">
                            <v-card-title>
                                <div class="text-h4 card-heading">Account {{i+ 1}}</div>
                            </v-card-title>
                            <v-card-text>
                                <v-text-field
                                    v-model="account.name"
                                    label="Name this account"
                                    type="text"
                                    required
                                    bg-color="#76EFD3"
                                    >
                                </v-text-field>
                                <v-text-field
                                    v-if="account.bech32Address"
                                    v-model="account.bech32Address"
                                    label="Cosmos Address"
                                    disabled
                                    type="text"
                                    required
                                    bg-color="#76EFD3"
                                    >
                                </v-text-field>
                                <v-btn class="myPrimaryButton" v-else @click="getBech32Address(i)">Get Bech32 Address</v-btn>
                                <v-text-field
                                    v-if="account.evmosAddress"
                                    v-model="account.evmosAddress"
                                    label="Evmos Address"
                                    disabled
                                    type="text"
                                    required
                                    bg-color="#76EFD3"
                                    >
                                </v-text-field>
                                <v-btn class="myPrimaryButton" v-else @click="getEvmosAddress(i)">Get Evmos Address</v-btn>
                            </v-card-text>
                        </div>
                    </template>
                    <template v-slot:actions>
                        <v-btn class="myPrimaryButton" @click="addOne">Add another account</v-btn>
                        <v-btn class="mySecondaryButton" @click="page2">Next</v-btn>
                    </template>
                </MyCard>
            </v-col>
        </v-row>
    </div>
    <div v-if="page === 2">
        <v-row class="d-flex justify-center">
            <v-col sm="8" md="6" lg="4">
                <MyCard title="Select your currency" hasActions>
                    <template v-slot:content>
                        <v-radio-group v-model="accounts.currency">
                            <v-radio class="white--text"  v-for="item in items"
                                :label="item"
                                :value="item"
                            ></v-radio>
                        </v-radio-group>
                    </template>
                    <template v-slot:actions>
                        <v-btn class="myPrimaryButton" v-if="accounts.currency !== ''" @click="createAccount">Finish</v-btn>
                    </template>
                </MyCard>
            </v-col>
        </v-row>    
    </div>
  </NuxtLayout>
</template>

<style scoped>

.myPrimaryButton {
    background: #070C38!important;
    border: 1px solid #76EFD3!important;
    border-radius: 6px;
    color: #76EFD3;
}
.mySecondaryButton {
    background: #76EFD3!important;
    border: 1px solid #76EFD3!important;
    border-radius: 6px;
    color: #070C38;
}

.white--text >>> label {
    color: white;
}

</style>