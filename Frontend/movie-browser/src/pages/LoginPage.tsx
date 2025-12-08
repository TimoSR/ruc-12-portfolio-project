import { useState } from 'react'
import styled from 'styled-components'
export const LoginPage = () => {
    const [identifier, setIdentifier] = useState('') // email
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const validate = () => {
        if (!identifier.trim()) return 'Email is required'
        if (!password.trim()) return 'Password is required'
        return ''
    }

    const handleLogin = async () => {
        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api of login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || 'Login failed')
            }

            // Handle successful login here (redirect, update state, etc.)
            alert('Login successful!')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Page>
            <Card>
                <Label>Email</Label>
                <Input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="your@email.com "
                />

                <Label>Password</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                {error && <ErrorText>{error}</ErrorText>}

                <Button disabled={loading} onClick={handleLogin}>
                    {loading ? 'Logging in...' : 'Log In'}
                </Button>
            </Card>
        </Page>
    )
}

const Page = styled.main`
    max-width: 480px;
    margin: 0 auto;
    padding: 16rem 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Card = styled.div`
    background: #1f2937;
    padding: 2rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
`;

const Title = styled.h1`
    font-size: 1.75rem;
    font-weight: 700;
    color: #f9fafb;
    margin-bottom: 0.5rem;
`;

const Label = styled.label`
    font-size: 0.9rem;
    color: #d1d5db;
`;

const Input = styled.input`
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #374151;
    background: #111827;
    color: #f3f4f6;
`;

const Button = styled.button`
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background: #3b82f6;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        background: #2563eb;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ErrorText = styled.p`
    color: #f87171;
    font-size: 0.9rem;
`;
