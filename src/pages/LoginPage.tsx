import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/reducers/rootReducer'
import LogoDark from '../assets/logo_dark.png';
import LogoLight from '../assets/logo_light.png';
import '../styles/auth.css'
import UsernameField from '../components/LoginFields/UsernameField';
import PasswordField from '../components/LoginFields/PasswordField';
import { Link } from 'react-router-dom';

const initialFormState = {
    username: "",
    password: ""
}

const LoginPage = () => {
    const [form, setForm] = useState(initialFormState);
    const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

    const updateUsername = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, username: e.target.value });
    const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value });
    const resetField = (field: "username" | "password" | "confirmPassword") => setForm({ ...form, [field]: "" });

    const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const url = 'https://localhost:7136/api/user/login';
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        console.log(res)
    }

    return (
        <div className="container">
            <div className="auth-form-container">
                <img src={isDarkMode ? LogoDark : LogoLight} />
                <h1>Log In</h1>
                <form className="auth-form" onSubmit={async (e) => await submitLogin(e)}>
                    <UsernameField username={form.username} resetField={resetField} onChange={updateUsername} />
                    <PasswordField password={form.password} resetField={resetField} onChange={updatePassword} />

                    <button
                        className={form.username && form.password ? "submit-btn" : "submit-btn disabled"}
                        disabled={!(form.username && form.password)}>
                        Log In
                    </button>
                    <Link className="link" to="/register">Register Now</Link>
                </form>
            </div>
        </div>
    )
}

export default LoginPage