import { useState, useEffect } from "react";
import { profileService } from "../services/profile";
import { useAuth } from "../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * ProfilePage Component
 * Displays and manages user profile information with role-based access control
 */
const ProfilePage = () => {
  const { currentUser } = useAuth(); // User authentication
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = currentUser?.role === "admin";

  // Fetch user profile on component mount
  useEffect(() => {
    // Only fetch if we have a logged in user
    if (!currentUser?.id) return;

    fetchUserProfile();
  }, [currentUser]);

  // Function to load user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getCurrentProfile();
      const profileData = response.data;

      // Store the profile data
      setProfile(profileData);

      // Set up initial form values
      initializeFormData(profileData);
    } catch (error) {
      console.error("Couldn't load your profile:", error);
      toast.error("We couldn't load your profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Set up initial form data from profile
  const initializeFormData = (profileData) => {
    setFormData({
      // User info - always present
      "user.name": profileData.user?.name || "",
      "user.email": profileData.user?.email || "",
      "user.phone": profileData.user?.phone || "",

      // Education info
      "education.institution": profileData.education?.institution || "",
      "education.degree": profileData.education?.degree || "",
      "education.fieldOfStudy": profileData.education?.fieldOfStudy || "",

      // Social links
      "socialLinks.website": profileData.socialLinks?.website || "",
      "socialLinks.linkedin": profileData.socialLinks?.linkedin || "",
      "socialLinks.github": profileData.socialLinks?.github || "",

      // Bio
      bio: profileData.bio || "",
    });
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Safety check
    if (!formData) return;

    // Update the field that changed
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Enable editing mode
  const handleEditClick = () => {
    if (!formData) {
      toast.error("Please wait while we load your profile data.");
      return;
    }
    setEditing(true);
  };

  // Save profile changes
  const handleSaveClick = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Safety check
    if (!formData || !editing) return;

    // Prepare data for API
    const updateData = prepareProfileDataForUpdate();

    try {
      // Send update to server
      const response = await profileService.updateProfile(updateData);

      if (response.status === "success") {
        // Update local state with server response
        setProfile(response.data);
        initializeFormData(response.data);
        setEditing(false);
        toast.success("Your profile has been updated successfully!");
      } else {
        throw new Error("Update didn't complete");
      }
    } catch (error) {
      handleUpdateError(error);
    }
  };

  // Prepare profile data for update
  const prepareProfileDataForUpdate = () => {
    const updateData = {
      name: formData["user.name"],
      email: formData["user.email"],
      phone: formData["user.phone"] || undefined,
      education: {
        institution: formData["education.institution"] || undefined,
        degree: formData["education.degree"] || undefined,
        fieldOfStudy: formData["education.fieldOfStudy"] || undefined,
      },
      socialLinks: {
        website: formData["socialLinks.website"] || undefined,
        linkedin: formData["socialLinks.linkedin"] || undefined,
        github: formData["socialLinks.github"] || undefined,
      },
      bio: formData.bio || undefined,
    };

    // Remove empty objects to keep the payload clean
    if (!hasValues(updateData.education)) {
      delete updateData.education;
    }

    if (!hasValues(updateData.socialLinks)) {
      delete updateData.socialLinks;
    }

    // Remove other empty fields
    if (!updateData.bio) delete updateData.bio;
    if (!updateData.phone) delete updateData.phone;

    return updateData;
  };

  // Check if an object has any non-empty values
  const hasValues = (obj) => {
    for (const value of Object.values(obj)) {
      if (value) return true;
    }
    return false;
  };

  // Handle update errors
  const handleUpdateError = (error) => {
    console.error("Problem updating your profile:", error);

    if (error.response?.status === 401) {
      toast.error(
        "Your session has expired. Please log in again in a new tab."
      );
    } else if (error.response?.data?.errors) {
      // Show specific field validation errors
      error.response.data.errors.forEach((err) =>
        toast.error(`${err.path}: ${err.msg}`)
      );
    } else {
      toast.error("We couldn't save your changes. Please try again.");
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-700">Loading your profile...</span>
      </div>
    );
  }

  // No profile data UI
  if (!profile) {
    return (
      <div className="p-6 text-gray-700">
        We couldn't find your profile data.
      </div>
    );
  }

  // Get statistics with defaults to prevent errors
  const statistics = profile.statistics || {
    totalExamsEnrolled: 0,
    totalExamsCompleted: 0,
    averageScore: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">
          My Profile
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSaveClick}>
            {/* ===== SECTION: Basic Info (visible to everyone) ===== */}
            <h3 className="text-lg font-semibold text-gray-700">
              Personal Information
            </h3>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="user.name"
                value={formData ? formData["user.name"] || "" : ""}
                disabled={true} // Name can't be edited
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="user.email"
                value={formData ? formData["user.email"] || "" : ""}
                disabled={true} // Email can't be edited
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="user.phone"
                value={formData ? formData["user.phone"] || "" : ""}
                disabled={!editing}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData ? formData.bio || "" : ""}
                disabled={!editing}
                onChange={handleChange}
                placeholder={editing ? "Tell us about yourself..." : ""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2 h-24"
              />
            </div>

            {/* ===== SECTION: Education (only for students) ===== */}
            {!isAdmin && (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mt-8">
                  Education
                </h3>

                {/* Institution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Institution
                  </label>
                  <input
                    type="text"
                    name="education.institution"
                    value={
                      formData ? formData["education.institution"] || "" : ""
                    }
                    disabled={!editing}
                    onChange={handleChange}
                    placeholder={editing ? "Your school or university" : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
                  />
                </div>

                {/* Degree */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Degree
                  </label>
                  <input
                    type="text"
                    name="education.degree"
                    value={formData ? formData["education.degree"] || "" : ""}
                    disabled={!editing}
                    onChange={handleChange}
                    placeholder={editing ? "Bachelor's, Master's, etc." : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
                  />
                </div>

                {/* Field of Study */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    name="education.fieldOfStudy"
                    value={
                      formData ? formData["education.fieldOfStudy"] || "" : ""
                    }
                    disabled={!editing}
                    onChange={handleChange}
                    placeholder={
                      editing ? "Computer Science, Engineering, etc." : ""
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
                  />
                </div>

                {/* ===== SECTION: Social Links (only for students) ===== */}
                <h3 className="text-lg font-semibold text-gray-700 mt-8">
                  Social Links
                </h3>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="text"
                    name="socialLinks.website"
                    value={
                      formData ? formData["socialLinks.website"] || "" : ""
                    }
                    disabled={!editing}
                    onChange={handleChange}
                    placeholder={editing ? "https://yourwebsite.com" : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    name="socialLinks.linkedin"
                    value={
                      formData ? formData["socialLinks.linkedin"] || "" : ""
                    }
                    disabled={!editing}
                    onChange={handleChange}
                    placeholder={
                      editing ? "https://linkedin.com/in/username" : ""
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    GitHub
                  </label>
                  <input
                    type="text"
                    name="socialLinks.github"
                    value={formData ? formData["socialLinks.github"] || "" : ""}
                    disabled={!editing}
                    onChange={handleChange}
                    placeholder={editing ? "https://github.com/username" : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
                  />
                </div>
              </>
            )}

            {/* ===== SECTION: Admin Information (only for admins) ===== */}
            {isAdmin && profile.adminInfo && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Admin Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Map through admin info fields */}
                  {[
                    {
                      label: "Company Name",
                      value: profile.adminInfo?.companyName || "",
                    },
                    {
                      label: "Company Size",
                      value: profile.adminInfo?.companySize || "",
                    },
                    {
                      label: "Company Type",
                      value: profile.adminInfo?.companyType || "",
                    },
                    {
                      label: "Job Title",
                      value: profile.adminInfo?.jobTitle || "",
                    },
                    {
                      label: "Country",
                      value: profile.adminInfo?.country || "",
                    },
                  ].map(({ label, value }, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-md p-3 border border-gray-200"
                    >
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {label}
                      </label>
                      <div className="text-gray-800">
                        {value || "Not specified"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== SECTION: Statistics (visible to everyone) ===== */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Exam Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Enrolled Exams */}
                <div className="bg-orange-50 p-4 rounded-lg shadow-sm border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600">
                    {statistics.totalExamsEnrolled}
                  </div>
                  <div className="text-sm text-gray-600">Enrolled Exams</div>
                </div>

                {/* Completed Exams */}
                <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="text-2xl font-bold text-green-600">
                    {statistics.totalExamsCompleted}
                  </div>
                  <div className="text-sm text-gray-600">Completed Exams</div>
                </div>
              </div>
            </div>

            {/* ===== SECTION: Action Buttons ===== */}
            <div className="mt-8 flex justify-end space-x-4">
              {editing ? (
                <>
                  {/* Cancel button */}
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Cancel
                  </button>

                  {/* Save button */}
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                /* Edit button */
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
