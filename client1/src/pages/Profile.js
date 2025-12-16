import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/UserSlice";
import { FaUser, FaCog, FaLock, FaBell, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Profile.css";
 
const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.users);
 
  const [activeTab, setActiveTab] = useState("profile");
 
  const [formData, setFormData] = useState({
    uname: "",
    email: "",
    profilepic: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
 
  const [localMessage, setLocalMessage] = useState("");
 
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        uname: user.uname || "",
        email: user.email || "",
        profilepic: user.profilepic || "",
      }));
    }
  }, [user]);
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalMessage("");
 
   
    if (formData.password) {
      if (!formData.oldPassword) {
        setLocalMessage("Please enter your current password");
        return;
      }
 
      if (formData.password !== formData.confirmPassword) {
        setLocalMessage("Passwords do not match");
        return;
      }
    }
 
    const updateData = {
      _id: user?._id,
      uname: formData.uname,
      email: formData.email,
      profilepic: formData.profilepic,
    };
 
 
    if (formData.password) {
      updateData.oldPassword = formData.oldPassword;
      updateData.newPassword = formData.password;
    }
 
    try {
      await dispatch(updateUser(updateData)).unwrap();
      setLocalMessage("Profile updated successfully!");
 
   
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setLocalMessage(err || "Failed to update profile");
    }
  };
 
  if (!user) return <div className="profile-container">Loading...</div>;
 
  return (
    <div className="profile-container full-page">
      <div className="profile-sidebar-nav">
        <div className="user-mini-profile">
          <img
            src={formData.profilepic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-avatar-small"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
          <h3>{user.uname}</h3>
          <span className="role-badge">{user.role || "User"}</span>
        </div>
 
        <nav className="profile-nav">
          <button
            type="button"
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser /> My Profile
          </button>
 
          <button
            type="button"
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog /> Settings
          </button>
        </nav>
      </div>
 
      <div className="profile-main-content">
        <div className="content-header">
          <h2>{activeTab === "profile" ? "Edit Profile" : "Account Settings"}</h2>
          <p>
            {activeTab === "profile"
              ? "Update your personal information"
              : "Manage your password and preferences"}
          </p>
        </div>
 
        <form onSubmit={handleSubmit} className="profile-form">
          {localMessage && (
            <div
              className={`alert ${
                localMessage.toLowerCase().includes("success") ? "alert-success" : "alert-danger"
              }`}
            >
              {localMessage}
            </div>
          )}
 
          {activeTab === "profile" && (
            <div className="tab-content fade-in">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="uname"
                  value={formData.uname}
                  onChange={handleChange}
                  required
                />
              </div>
 
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="input-disabled"
                />
                <small className="text-muted">Email cannot be changed</small>
              </div>
 
              <div className="form-group">
                <label>Profile Picture URL</label>
                <input
                  type="url"
                  name="profilepic"
                  value={formData.profilepic}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
 
              <div className="profile-actions">
                <button type="submit" className="btn-save" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
 
          {activeTab === "settings" && (
            <div className="tab-content fade-in">
              <div className="settings-section">
                <h3>
                  <FaLock /> Security
                </h3>
 
           
                <div className="form-group password-group">
                  <label>Current Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                    />
                    <span
                      onClick={() => setShowOldPassword((v) => !v)}
                      style={{ cursor: "pointer" }}
                      title={showOldPassword ? "Hide" : "Show"}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
 
           
                <div className="form-group password-group">
                  <label>New Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      minLength="6"
                    />
                    <span
                      onClick={() => setShowNewPassword((v) => !v)}
                      style={{ cursor: "pointer" }}
                      title={showNewPassword ? "Hide" : "Show"}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
 
           
                <div className="form-group password-group">
                  <label>Confirm New Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      disabled={!formData.password}
                    />
                    <span
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      style={{ cursor: "pointer" }}
                      title={showConfirmPassword ? "Hide" : "Show"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              </div>
 
              <div className="settings-section">
                <h3>
                  <FaBell /> Preferences
                </h3>
 
                <div className="preference-item">
                  <div className="pref-info">
                    <h4>Email Notifications</h4>
                    <p>Receive emails about your account activity</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>
 
                <div className="preference-item">
                  <div className="pref-info">
                    <h4>Marketing Emails</h4>
                    <p>Receive emails about new features and offers</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
 
              <div className="profile-actions">
                <button type="submit" className="btn-save" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
 
export default Profile;