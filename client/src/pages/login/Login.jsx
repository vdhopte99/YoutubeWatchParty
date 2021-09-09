import { useContext, useRef } from "react";
import './login.css'
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";

export default function Login() {
    const email = useRef();
    const password = useRef();
    const { isFetching, dispatch } = useContext(AuthContext);

    const handleLogin = (e) => {
        e.preventDefault();
        loginCall (
            { email: email.current.value, password: password.current.value },
            dispatch
        );
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
                    <form className="loginBox" onSubmit={handleLogin}>
                        <input
                          placeholder="Email"
                          type="email"
                          required
                          className="loginInput"
                          ref={email}
                        />
                        <input
                          placeholder="Password"
                          type="password"
                          required
                          minLength="6"
                          className="loginInput"
                          ref={password}
                        />
                        <button className="loginButton" type="submit" disabled={isFetching}>
                            {isFetching ? (
                                <CircularProgress color="white" size="20px"/>
                            ) : (
                                "Log In"
                            )}
                        </button>
                        <span className="loginForgot">Forgot Password?</span>
                        <button className="loginRegisterButton">
                            {isFetching ? (
                                <CircularProgress color="white" size="20px"/>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}