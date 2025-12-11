import styled from 'styled-components'

export const Page = styled.main`
    max-width: 480px;
    margin: 0 auto;
    padding: 16rem 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const Card = styled.div`
    background: #1f2937;
    padding: 2rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
`

export const Title = styled.h1`
    font-size: 1.75rem;
    font-weight: 700;
    color: #f9fafb;
    margin-bottom: 0.5rem;
`

export const Label = styled.label`
    font-size: 0.9rem;
    color: #d1d5db;
`

export const Input = styled.input`
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #374151;
    background: #111827;
    color: #f3f4f6;
`

export const Button = styled.button`
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
`

export const ErrorText = styled.p`
    color: #f87171;
    font-size: 0.9rem;
`

export const SuccessText = styled.p`
    color: #34d399;
    font-size: 0.9rem;
`

export const SmallText = styled.p`
    color: #9ca3af;
    font-size: 0.875rem;
    text-align: center;
    margin-top: 1rem;
`

export const Link = styled.a`
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
        color: #2563eb;
    }
`
