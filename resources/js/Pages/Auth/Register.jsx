import { Link, useForm } from '@inertiajs/react';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
        phone: '',
        favorite_genre: '',
        agreed_to_terms: false,
    });

    return (
        <StoreLayout title="Register" authPage>
            <main>
                <div className="reg-container">
                    <div className="reg-header">
                        <span className="reg-icon">📜</span>
                        <h1>Join DustyPages</h1>
                        <p>Begin your collection of timeless literature today</p>
                    </div>
                    <form className="reg-card" onSubmit={(event) => event.preventDefault()}>
                        <div className="form-grid">
                            {[
                                ['first_name', 'First Name *'],
                                ['last_name', 'Last Name *'],
                                ['email', 'Email Address *', true],
                                ['username', 'Username *', true],
                                ['password', 'Password *'],
                                ['password_confirmation', 'Confirm Password *'],
                                ['phone', 'Phone (optional)', true],
                            ].map(([field, label, full]) => (
                                <div key={field} className={`form-group ${full ? 'full' : ''}`}>
                                    <label>{label}</label>
                                    <input
                                        type={field.includes('password') ? 'password' : 'text'}
                                        value={data[field]}
                                        onChange={(event) => setData(field, event.target.value)}
                                    />
                                    {errors[field] ? <small className="error-text">{errors[field]}</small> : null}
                                </div>
                            ))}
                            <div className="form-group full">
                                <label>Favourite Genre</label>
                                <select
                                    value={data.favorite_genre}
                                    onChange={(event) => setData('favorite_genre', event.target.value)}
                                >
                                    <option value="">Select a genre…</option>
                                    <option>Classic Literature</option>
                                    <option>Gothic & Horror</option>
                                    <option>Philosophy</option>
                                    <option>Adventure</option>
                                    <option>Romance</option>
                                    <option>Science & History</option>
                                </select>
                            </div>
                        </div>

                        <div className="terms-row">
                            <input
                                type="checkbox"
                                checked={data.agreed_to_terms}
                                onChange={(event) => setData('agreed_to_terms', event.target.checked)}
                            />
                            <span>
                                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I
                                understand that DustyPages is a fictional project and no real transactions will occur.
                            </span>
                        </div>

                        <button type="button" className="register-btn" disabled={processing} onClick={() => post('/register')}>
                            Create My Account →
                        </button>

                        <div className="divider">
                            <span>— already have an account? —</span>
                        </div>
                        <div className="login-link">
                            <Link href="/login">Sign in to DustyPages</Link>
                        </div>
                    </form>
                </div>
            </main>
        </StoreLayout>
    );
}
