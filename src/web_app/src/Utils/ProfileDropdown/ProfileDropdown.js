import React, { useState, useEffect } from "react";
import { backendUrl } from "../../config";
import "./ProfileDropdown.css";

const ProfileDropdown = () => {
    const [profilePicture, setProfilePicture] = useState("");
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const fetchProfilePic = async () => {
            const response = await fetch(`${backendUrl}contents/users/${localStorage.getItem('username')}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` }
            });

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setProfilePicture(imageUrl);
        };

        fetchProfilePic();
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
            <img alt="Profile" className="profile-pic" src={profilePicture} />
            ▼
            {isDropdownVisible && (
                <div className="profile-dropdown-menu">
                    <p className="profile-dropdown-item">Profile</p>
                    <p className="profile-dropdown-item">Logout</p>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;