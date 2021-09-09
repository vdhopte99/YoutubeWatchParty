import axios from "axios";
import { useRef } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const history = useHistory();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (confirmPassword.current.value !== password.current.value) {
            confirmPassword.current.setCustomValidity("Passwords do not match!");
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            };

            try {
                await axios.post("/auth/register", user);
                history.push("/login");
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">StreamTube</h3>
                    <span className="loginDescription">
                        Hang out and watch YouTube videos together with your friends
                    </span>
                </div>

                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleRegister}>
                        <input
                          placeholder="Username"
                          required
                          ref={username}
                          className="loginInput"
                        />
                        <input
                          placeholder="Email"
                          required
                          ref={email}
                          className="loginInput"
                          type="email"
                        />
                        <input
                          placeholder="Password"
                          required
                          ref={password}
                          className="loginInput"
                          type="password"
                          minLength="6"
                        />
                        <input
                          placeholder="Confirm Password"
                          required
                          ref={confirmPassword}
                          className="loginInput"
                          type="password"
                        />
                        <button className="loginButton" type="submit">
                            Register
                        </button>

                        <span className="loginForgot">Already have an account?</span>
                        <Link to="/login" style={{ textDecoration: "none", textAlign: "center" }}>
                            <button className="loginRegisterButton">Log In</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}