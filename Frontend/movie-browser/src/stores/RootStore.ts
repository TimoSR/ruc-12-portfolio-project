// src/stores/RootStore.ts
import { AccountStore } from "./AccountStore"

export class RootStore {
  accountStore: AccountStore

  constructor() {
    this.accountStore = new AccountStore()
  }
}

export const rootStore = new RootStore()