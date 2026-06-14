import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  MapPin,
  Link2,
  Edit3,
  Bookmark,
  FileText,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("https://internship-resume.onrender.com/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        console.log("Profile fetch error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Dispatch custom event for sidebar to update
    window.dispatchEvent(new Event("logout"));
    
    // Redirect to home page
    navigate("/");
    
    // Optional: Show success message
    console.log("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        No user found. Please login again.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl bg-[#fafafa] px-0.5 py-2 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* PROFILE CARD */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-10">
          {/* TOP */}
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* LEFT */}
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <img
                src={user.profilePic}
                alt="profile"
                className="h-28 w-28 rounded-full object-cover ring-4 ring-gray-100"
              />

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>

                  {user.isVerified && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-1 text-gray-500">@{user.username}</p>

                <p className="mt-5 max-w-2xl leading-relaxed text-gray-700">
                  {user.bio || "No bio added yet."}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{user.role}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link2 size={16} />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    <span>Joined recently</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              {/* EDIT BUTTON */}
              <a href="/profile/edit">
                <button className="flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700">
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              </a>

              {/* LOGOUT BUTTON */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:border-red-300"
              >
                <LogOut size={16} />
                Logout
              </button>

              <button className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                Share
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 md:flex md:gap-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">0</h2>
              <p className="mt-1 text-sm text-gray-500">Posts</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.followers?.length ?? 0}
              </h2>
              <p className="mt-1 text-sm text-gray-500">Followers</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.following?.length ?? 0}
              </h2>
              <p className="mt-1 text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-purple-100 p-3 text-purple-600">
                <Bookmark size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Saved Posts</h3>
                <p className="text-sm text-gray-500">
                  Your bookmarked articles
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Draft Blogs</h3>
                <p className="text-sm text-gray-500">
                  Continue writing your drafts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* POSTS */}
        <div className="mt-10">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Recent Posts
          </h2>

          <div className="space-y-4">
            {[1, 2, 3].map((post) => (
              <div
                key={post}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  Sample Blog Post Title
                </h3>

                <p className="mt-3 text-sm text-gray-600">
                  This will later come from backend posts API.
                </p>

                <div className="mt-4 text-sm text-gray-500">
                  12 min read • May 2026
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <LogOut size={24} className="text-red-600" />
              </div>
              
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Logout Confirmation
              </h3>
              
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to logout from InkFlow?
              </p>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
