import { CosmosDirectory } from '@stakefrites/cosmos-directory'
import { IWallet } from '@stakefrites/trakmos-types'

const directory = new CosmosDirectory()
const myName = 'Trakmos'

type Gender = 'male' | 'female'

type Person = {
  name: string
  age: number
  gender: Gender
}

const jean: Person = {
  name: 'jean-emrick',
  age: 10,
  gender: 'male'
}

const myWallet: IWallet = {
  address: 'evmos10zee9936pfxsuvfmenk4vcn70uywnr7zpqgz0c',
  network: 'evmos',
  denom: 'aevmos',
  decimals: 18,
  tokens: {
    total: [],
    delegations: [],
    redelegations: [],
    rewards: [],
    unbounding: [],
    balance: []
  }
}

console.log('hi this is my wallet:\n%j', myWallet.tokens)
