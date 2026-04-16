import { Link, useForm } from '@inertiajs/react';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    return (
        <StoreLayout title="Sign In" authPage>
            <main>
                <div className="login-container">
                    <div className="login-header">
                        <span className="login-icon">🕯️</span>
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue your literary journey</p>
                    </div>
                    <form className="login-card" onSubmit={(event) => event.preventDefault()}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(event) => setData('email', event.target.value)}
                            />
                            {errors.email ? <small className="error-text">{errors.email}</small> : null}
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                            />
                        </div>
                        <a className="forgot-link" href="#">
                            Forgot your password?
                        </a>
                        <button type="button" className="login-btn" disabled={processing} onClick={() => post('/login')}>
                            Sign In to DustyPages
                        </button>
                        <div className="divider">
                            <span>— or —</span>
                        </div>
                        <div className="register-link">
                            New to DustyPages? <Link href="/register">Create an account</Link>
                        </div>
                    </form>
                    <div className="login-quote">
                        <p>"Reading is dreaming with your eyes open."</p>
                    </div>
                </div>
            </main>
        </StoreLayout>
    );
}
