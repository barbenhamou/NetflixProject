import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { backendUrl } from "../../config";
import "./ProfileDropdown.css";

const ProfileDropdown = () => {
    const [profilePicture, setProfilePicture] = useState("");
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfilePic = async () => {
            const response = await fetch(`${backendUrl}contents/users/${localStorage.getItem('username')}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` }
            });

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setProfilePicture(imageUrl);
        };

        const fetchUser = async () => {
            const response = await fetch(`${backendUrl}users/${localStorage.getItem('userId')}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` }
            });

            const user = await response.json();
            setUser(user);
        }

        fetchProfilePic();
        fetchUser();
    }, []);

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

    return (
        <div
            className="home-profile-info"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="profile-dropdown" >
                <img alt="Profile" className="profile-pic" src={profilePicture} />
                ▼
            </div>
            {isDropdownVisible && (
                <div className="profile-dropdown-menu">
                    <p className="profile-information">Profile Information:</p>
                    <p className="profile-dropdown-item">Username: {user.username}</p>
                    <p className="profile-dropdown-item">Email: {user.email}</p>
                    <p className="profile-dropdown-item">Phone number: {user.phone}</p>
                    <p className="profile-dropdown-item">Location: {user.location}</p>
                    <Link className="logout-link" to="/login">
                        <p className="profile-dropdown-item logout-link" onClick={() => {
                            localStorage.setItem("authToken", "");
                            localStorage.setItem("isAdmin", false);
                        }}>Logout</p>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;