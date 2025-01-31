import React from 'react';
import MessageForm from './MessageForm';

function ProfileList({ profiles }) {
    return (
        <ul>
            {profiles.map((profile, index) => (
                <li key={index}>
                    <p>{profile.name} - {profile.currentJob}</p>
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">View Profile</a>
                    <MessageForm profileUrl={profile.linkedinUrl} />
                </li>
            ))}
        </ul>
    );
}

export default ProfileList;
