import { makeAutoObservable, runInAction } from 'mobx'

export interface IAuthStore {
    email: string
    setEmail(email: string): void
    password: string
    setPassword(password: string): void
    loading: boolean
    error: string
    success: string
    login(): Promise<void>
    register(): Promise<void>
    reset(): void
}

export class AuthStore implements IAuthStore {
    email = ''
    password = ''
    loading = false
    error = ''
    success = ''

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    setEmail(email: string) {
        this.email = email
    }

    setPassword(password: string) {
        this.password = password
    }

    reset() {
        this.email = ''
        this.password = ''
        this.loading = false
        this.error = ''
        this.success = ''
    }

    validate(): boolean {
        if (!this.email.trim()) {
            this.error = 'Email is required'
            return false
        }
        if (!this.password.trim()) {
            this.error = 'Password is required'
            return false
        }
        return true
    }

    async login() {
        if (!this.validate()) return

        this.loading = true
        this.error = ''

        try {
            const res = await fetch('/api of login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: this.email, password: this.password })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || 'Login failed')
            }

            runInAction(() => {
                // Handle successful login here (redirect, update state, etc.)
                alert('Login successful!')
                this.loading = false
            })
        } catch (err: any) {
            runInAction(() => {
                this.error = err.message
                this.loading = false
            })
        }
    }

    async register() {
        this.loading = true
        this.error = ''
        this.success = ''

        try {
            const res = await fetch('/api of register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.email, password: this.password })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || 'Signup failed')
            }

            runInAction(() => {
                this.success = 'Account created successfully!'
                this.email = ''
                this.password = ''
                this.loading = false
            })
        } catch (err: any) {
            runInAction(() => {
                this.error = err.message
                this.loading = false
            })
        }
    }
}
