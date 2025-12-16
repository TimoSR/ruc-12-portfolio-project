import { observer, useLocalObservable } from 'mobx-react'
import { AuthStore, type IAuthStore } from '../store/AuthStore'
import { Page, Card, Title, Label, Input, Button, ErrorText, SmallText, Link } from '../components/AuthComponents'

export const LoginView = observer(LoginViewBase)

function LoginViewBase() {
    const store = useLocalObservable<IAuthStore>(() => new AuthStore())

    return (
        <Page>
            <Card>
                <Title>Login</Title>
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

                <Button disabled={store.loading} onClick={store.login}>
                    {store.loading ? 'Logging in...' : 'Log In'}
                </Button>

                <SmallText>
                    Don't have an account? <Link href="/register">Sign up</Link>
                </SmallText>
            </Card>
        </Page>
    )
}
