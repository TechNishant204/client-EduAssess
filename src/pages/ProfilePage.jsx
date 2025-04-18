import { useState, useEffect } from "react";
import { profileService } from "../services/profile";
import { useAuth } from "../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getCurrentProfile();
        const data = response.data;
        setProfile(data);
        setFormData({
          "user.name": data.user.name,
          "user.email": data.user.email,
          "user.phone": data.user.phone || "",
          "education.institution": data.education.institution || "",
          "education.degree": data.education.degree || "",
          "education.fieldOfStudy": data.education.fieldOfStudy || "",
          "socialLinks.website": data.socialLinks.website || "",
          "socialLinks.linkedin": data.socialLinks.linkedin || "",
          "socialLinks.github": data.socialLinks.github || "",
          bio: data.bio || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    if (!formData) {
      console.error("Cannot edit: Profile data not loaded yet");
      toast.error("Profile data is loading. Please wait.");
      return;
    }
    setEditing(true);
  };

  const handleSaveClick = async (e) => {
    // Prevent form submission default behavior which might cause page refresh
    e.preventDefault();

    if (!formData || !editing) return;
    console.log("Submitting profile update with:", formData);

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

    // Clean up empty fields
    if (
      !updateData.education.institution &&
      !updateData.education.degree &&
      !updateData.education.fieldOfStudy
    ) {
      delete updateData.education;
    }
    if (
      !updateData.socialLinks.website &&
      !updateData.socialLinks.linkedin &&
      !updateData.socialLinks.github
    ) {
      delete updateData.socialLinks;
    }
    if (!updateData.bio) delete updateData.bio;
    if (!updateData.phone) delete updateData.phone;

    try {
      const response = await profileService.updateProfile(updateData);
      if (response.status === "success") {
        setProfile(response.data);
        setFormData({
          "user.name": response.data.user.name,
          "user.email": response.data.user.email,
          "user.phone": response.data.user.phone || "",
          "education.institution": response.data.education.institution || "",
          "education.degree": response.data.education.degree || "",
          "education.fieldOfStudy": response.data.education.fieldOfStudy || "",
          "socialLinks.website": response.data.socialLinks.website || "",
          "socialLinks.linkedin": response.data.socialLinks.linkedin || "",
          "socialLinks.github": response.data.socialLinks.github || "",
          bio: response.data.bio || "",
        });
        setEditing(false);
        toast.success(response.message || "Profile updated successfully!");
      } else {
        throw new Error("Update failed with status: " + response.status);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        // Just show error without redirecting
        toast.error(
          "Session expired. Please open a new tab to login and then try again."
        );
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) =>
          toast.error(`${err.path}: ${err.msg}`)
        );
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  const isAdmin = currentUser?.role === "admin";

  if (!profile) return <div className="p-6 text-gray-700">Loading...</div>;

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
            {/* User Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="user.name"
                value={formData ? formData["user.name"] || "" : ""}
                disabled={true}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="user.email"
                value={formData ? formData["user.email"] || "" : ""}
                disabled={true}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
              />
            </div>
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

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Institution
              </label>
              <input
                type="text"
                name="education.institution"
                value={formData ? formData["education.institution"] || "" : ""}
                disabled={!editing}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
              />
            </div>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Field of Study
              </label>
              <input
                type="text"
                name="education.fieldOfStudy"
                value={formData ? formData["education.fieldOfStudy"] || "" : ""}
                disabled={!editing}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
              />
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="text"
                name="socialLinks.website"
                value={formData ? formData["socialLinks.website"] || "" : ""}
                disabled={!editing}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <input
                type="text"
                name="socialLinks.linkedin"
                value={formData ? formData["socialLinks.linkedin"] || "" : ""}
                disabled={!editing}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2"
              />
            </div>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500 p-2 h-24"
              />
            </div>

            {/* Admin Information */}
            {isAdmin && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Admin Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Company Name",
                      value: profile.adminInfo.companyName || "",
                    },
                    {
                      label: "Company Size",
                      value: profile.adminInfo.companySize || "",
                    },
                    {
                      label: "Company Type",
                      value: profile.adminInfo.companyType || "",
                    },
                    {
                      label: "Job Title",
                      value: profile.adminInfo.jobTitle || "",
                    },
                    {
                      label: "Country",
                      value: profile.adminInfo.country || "",
                    },
                  ].map(({ label, value }, index) => (
                    <div key={index}>
                      <label className="block text-sm text-gray-600">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={value}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 text-gray-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Statistics */}
            {isAdmin && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Total Exams Enrolled",
                      value: profile.statistics.totalExamsEnrolled || 0,
                    },
                    {
                      label: "Total Exams Completed",
                      value: profile.statistics.totalExamsCompleted || 0,
                    },
                    {
                      label: "Average Score",
                      value: profile.statistics.averageScore || 0,
                    },
                  ].map(({ label, value }, index) => (
                    <div key={index}>
                      <label className="block text-sm text-gray-600">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={value}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 text-gray-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Enrolled Exams */}
            {!isAdmin && profile.user.enrolledExams.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Enrolled Exams
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {profile.user.enrolledExams.map((exam) => (
                    <li key={exam._id} className="ml-4">
                      {exam.title} (Duration: {exam.duration / 60} mins, Starts:{" "}
                      {new Date(exam.startTime).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Student Completed Exams */}
            {!isAdmin && profile.user.completedExams.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Completed Exams
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {profile.user.completedExams.map((exam) => (
                    <li key={exam._id} className="ml-4">
                      {exam.title === "undefined" ? "N/A" : exam.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-center space-x-4">
              {!editing && (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="w-1/4 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-200"
                >
                  Edit
                </button>
              )}
              {editing && (
                <button
                  type="submit"
                  className="w-1/4 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-200"
                >
                  Save
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
