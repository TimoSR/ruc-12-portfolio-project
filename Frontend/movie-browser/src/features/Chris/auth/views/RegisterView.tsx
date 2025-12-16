import { observer, useLocalObservable } from 'mobx-react'
import { AuthStore, type IAuthStore } from '../store/AuthStore'
import { Page, Card, Title, Label, Input, Button, ErrorText, SuccessText, SmallText, Link } from '../components/AuthComponents'

export const RegisterView = observer(RegisterViewBase)

function RegisterViewBase() {
    const store = useLocalObservable<IAuthStore>(() => new AuthStore())

    return (
        <Page>
            <Card>
                <Title>Register</Title>
                <Label>Email</Label>
                <Input
                    type="email"
                    value={store.email}
                    onChange={(e) => store.setEmail(e.target.value)}
                    placeholder="your@email.com"
                />

                <Label>Username</Label>
                <Input
                    type="text"
                    value={store.username}
                    onChange={(e) => store.setUsername(e.target.value)}
                    placeholder="your_username"
                />

                <Label>Password</Label>
                <Input
                    type="password"
                    value={store.password}
                    onChange={(e) => store.setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                {store.error && <ErrorText>{store.error}</ErrorText>}
                {store.success && <SuccessText>{store.success}</SuccessText>}

                <Button disabled={store.loading} onClick={store.register}>
                    {store.loading ? 'Signing up...' : 'Sign Up'}
                </Button>

                <SmallText>
                    Already have an account? <Link href="/login">Log in</Link>
                </SmallText>
            </Card>
        </Page>
    )
}
