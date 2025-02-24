"use client";
import React, { useState } from "react";
import axios from 'axios';

export default function SignUp() {

    const [formdata, setformdata] = useState({
        firstname: "",
        lastname: "",
        email: "",
        passwordhash: "",

    });
    const handleInputchange = (e) => {
        setformdata({
            ...formdata,
            [e.target.name]: e.target.value
        })
    }

    const [error, setError] = useState(''); // State for error messages
    const [message, setMessage] = useState(''); // State for success messages
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(""); // Reset error message
        setMessage(""); // Reset success message

        if (formdata.password !== formdata.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(
                process.env.NEXT_PUBLIC_IPHOST + '/StoreAPI/users/userauth',
                {
                    query: `
                        mutation {
                            userRegister(input: {firstname: "${formdata.firstname}",lastname: "${formdata.lastname}",email: "${formdata.email}", passwordhash: "${formdata.passwordhash}"}) {
                                username
                                token
                                message
                            }
                        }
                    `
                }
            );
            const token = response.data.data.userRegister.token;
            localStorage.setItem('authtoken', token);
            location.href = '/';
        } catch (error) {
            // Check if error response exists and extract relevant message
            if (error.response) {
                setError(error.response.data.data.userRegister.message || "An error occurred");
            } else {
                setError("Failed to sign in. Please try again later.");
            }
        }
    };

    return (
        <form onSubmit={handleSignIn}>

            <div className="form-container">
                <div className="form-card">
                    <h1>Sign Up</h1>
                    {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
                    {message && <p style={{ color: "green" }}>{message}</p>} {/* Display success message */}
                    <div className="mb-3">
                        <label>First name</label>
                        <input
                            name="firstname"
                            type="text"
                            className="form-control"
                            placeholder="First name"
                            onChange={handleInputchange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Last name</label>
                        <input
                            name="lastname"
                            type="text"
                            className="form-control"
                            placeholder="Last name"
                            onChange={handleInputchange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            onChange={handleInputchange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            name="passwordhash"
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Enter password"
                            onChange={handleInputchange}
                            required
                        />
                        <button className="" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Hide password" : "Show password"}
                        </button>
                    </div>

                    <div className="mb-3">
                        <label>Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Confirm password"

                            required
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Sign Up
                        </button>
                    </div>
                    <p className="form-link">
                        Already registered <a href="/signin">sign in?</a>
                    </p>
                </div>
            </div>
        </form>
    );
}
