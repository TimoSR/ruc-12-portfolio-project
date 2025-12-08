import { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

export const RegisterPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSignup = async () => {
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            // api call
            const res = await fetch('/api of register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || 'Signup failed')
            }

            setSuccess('Account created successfully!')
            setEmail('')
            setPassword('')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (   
        <Page>
            <Card>
                <Title>Create your account</Title>
                <Label>Email</Label>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                />

                <Label>Password</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) =>
                         setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                {/* error is invoked if error occur */}
                {error ? <ErrorText>{error}</ErrorText> : null}
                {success ? <SuccessText>{success}</SuccessText> : null}

                <Button disabled={loading} onClick={handleSignup}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
            </Card>
        </Page>
    )
}

const GlobalScrollbarFix = createGlobalStyle`
  html {
    /* This forces the scrollbar UI to be visible 100% of the time */
    overflow-y: auto;
  }
`

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
    background: #6366f1;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        background: #4f46e5;
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

const SuccessText = styled.p`
    color: #34d399;
    font-size: 0.9rem;
`;
