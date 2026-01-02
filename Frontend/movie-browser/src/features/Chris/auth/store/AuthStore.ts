import { makeAutoObservable, runInAction } from 'mobx'

export interface IAuthStore {
    email: string
    setEmail(email: string): void
    id: string
    username: string
    setUsername(username: string): void
    password: string
    setPassword(password: string): void
    loading: boolean
    error: string
    success: string
    token: string | null
    isAuthenticated: boolean
    login(): Promise<void>
    register(): Promise<void>
    logout(): void
    reset(): void
}

export class AuthStore implements IAuthStore {
    email = ''
    id = ''
    username = ''
    password = ''
    loading = false
    error = ''
    success = ''
    token: string | null = null

    get isAuthenticated() {
        return !!this.token
    }

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        this.token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        if (userStr) {
            try {
                const user = JSON.parse(userStr)
                this.username = user.username
                this.id = user.id
            } catch (e) {
                console.error('Failed to parse user from localStorage', e)
            }
        }
    }

    setEmail(email: string) {
        this.email = email
    }

    logout() {
        this.token = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }
    setUsername(username: string) {
        this.username = username
    }

    setPassword(password: string) {
        this.password = password
    }

    reset() {
        this.email = ''
        this.id = ''
        this.username = ''
        this.password = ''
        this.loading = false
        this.error = ''
        this.success = ''
    }

    validateRegister(): boolean {
        if (!this.email.trim()) {
            this.error = 'Email is required'
            return false
        }
        if (!this.username.trim()) {
            this.error = 'Username is required'
            return false
        }
        if (!this.password.trim()) {
            this.error = 'Password is required'
            return false
        }
        return true
    }

    validateLogin(): boolean {
        if (!this.username.trim()) {
            this.error = 'Username is required'
            return false
        }
        if (!this.password.trim()) {
            this.error = 'Password is required'
            return false
        }
        return true
    }

    async login() {
        if (!this.validateLogin()) return

        this.loading = true
        this.error = ''

        try {
            const res = await fetch('/api/v1/accounts/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: this.username, password: this.password })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.detail || 'Login failed')
            }

            const data = await res.json()

            runInAction(() => {
                this.token = data.token
                if (this.token) {
                    localStorage.setItem('token', this.token)
                    // Also store user info if needed
                    const userObj = { id: data.id, username: data.username }
                    localStorage.setItem('user', JSON.stringify(userObj))
                }
                this.success = 'Login successful!'
                this.loading = false
                // Redirect logic should be handled by the view or router
                window.location.href = '/'
            })
        } catch (err: any) {
            runInAction(() => {
                this.error = err.message
                this.loading = false
            })
        }
    }

    async register() {
        if (!this.validateRegister()) return

        this.loading = true
        this.error = ''
        this.success = ''

        try {
            const res = await fetch('/api/v1/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.email, username: this.username, password: this.password })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.detail || 'Signup failed')
            }

            runInAction(() => {
                this.success = 'Account created successfully! Please log in.'
                this.email = ''
                this.username = ''
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
