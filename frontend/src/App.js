import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="container" style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
            <h1 className="text-center">LinkedIn Scraper</h1>

            <form>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter LinkedIn Email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter LinkedIn Password"
                    />
                </div>

                <button type="button" className="btn btn-primary mt-3" onClick={fetchProfiles}>
                    Search
                </button>
            </form>

            <ul className="list-group mt-4">
                {profiles?.map((profile, index) => (
                    <li key={index} className="list-group-item">
                        <strong>{profile.name}</strong> - {profile.currentJob} <br />
                        <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                            View Profile
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
