// src/stores/AccountStore.ts
import { action, computed, makeObservable, observable } from "mobx"

export interface IAccount {
  id: string
  username: string
  email: string
  token: string
  createdAt: number
}

export class AccountStore {
  @observable account: IAccount | null = null

  constructor() {
    makeObservable(this)
  }

  @action
  login(payload: Omit<IAccount, "createdAt">): void {
    this.account = {
      ...payload,
      createdAt: Date.now()
    }
  }

  @action
  logout(): void {
    this.account = null
  }

  @action
  updateProfile(fields: Partial<Omit<IAccount, "id" | "createdAt">>): void {
    if (!this.account) return
    this.account = {
      ...this.account,
      ...fields
    }
  }

  @computed
  get isAuthenticated(): boolean {
    return this.account !== null
  }
}

export const accountStore = new AccountStore()