import React, { useState } from 'react';

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [profiles, setProfiles] = useState([]);

    const fetchProfiles = async () => {
        try {
            const res = await fetch('http://localhost:5000/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, searchQuery })
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
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
            <h1>LinkedIn Scraper</h1>

            <label>
                Email:
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter LinkedIn Email"
                />
            </label>
            <br />

            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter LinkedIn Password"
                />
            </label>
            <br />

            <label>
                Search Query:
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Software Engineer"
                />
            </label>
            <button onClick={fetchProfiles} style={{ marginLeft: '0.5rem' }}>
                Search
            </button>

            <ul style={{ marginTop: '1rem' }}>
                {profiles?.map((profile, index) => (
                    <li key={index} style={{ marginBottom: '1rem' }}>
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
