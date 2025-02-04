import React, { useState } from 'react';
import './css/App.css';
import logo from './assets/bearconnect-high-resolution-logo.avif';

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profiles, setProfiles] = useState([]);

    const fetchProfiles = async () => {
        try {
            const res = await fetch('http://localhost:5000/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (data.error) {
                alert(data.error);
            } else {
                setProfiles(data.profiles);
            }
        } catch (err) {
            console.error('Error fetching profiles:', err);
            alert("Failed to fetch profiles. Ensure the backend is running.");
        }
    };

    return (
        <div className="container">
            {/* Logo */}
            <img src={logo} alt="BearConnect" className="logo" />

            {/* Title */}
            <h1 className="title">LinkedIn Auto Message Bot</h1>

            {/* Login Form */}
            <div className="form-container">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter LinkedIn Email"
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter LinkedIn Password"
                    />
                </div>

                <button onClick={fetchProfiles} className="btn">
                    Search
                </button>
            </div>

            {/* Profile List */}
            {profiles.length > 0 && (
                <div className="profile-list">
                    <h2>Scraped Profiles</h2>
                    <ul>
                        {profiles.map((profile, index) => (
                            <li key={index} className="profile-card">
                                <strong>{profile.name}</strong> - {profile.currentJob} <br />
                                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                                    View Profile
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
