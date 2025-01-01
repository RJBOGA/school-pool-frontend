import { useNavigate } from "react-router-dom";
import { Settings, User, Mail, Phone, School, Car } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types";
import imageService from "../../services/imageService";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return null;
  }
  else  console.log(user)

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-3xl mx-auto">
          {/* Header with Settings Button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/profile/edit")}
                className="flex items-center px-4 py-2 text-primary-600 hover:text-primary-700"
              >
                <Settings size={20} className="mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Basic Info Section */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-primary-100 rounded-full p-4">
                <User size={48} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500">
                  {user.role === UserRole.DRIVER ? "Driver" : "Rider"}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h3>

              <div className="flex items-center text-gray-600">
                <Mail size={20} className="mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Phone size={20} className="mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{user.phone}</p>
                </div>
              </div>
            </div>

            {/* University Information */}
            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                University Details
              </h3>

              <div className="flex items-center text-gray-600">
                <School size={20} className="mr-3" />
                <div>
                  <p className="text-sm text-gray-500">University</p>
                  <p>{user.university}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Mail size={20} className="mr-3" />
                <div>
                  <p className="text-sm text-gray-500">University Email</p>
                  <p>{user.universityEmail}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Documents - Only show for students */}
{user.role === UserRole.DRIVER && user.vehicleDetails && user.vehicleDetails.length > 0 && (
  <div className="space-y-4 border-t pt-4 mt-4">
    <h3 className="text-lg font-medium text-gray-900 mb-4">
      Documents
    </h3>
    <div className="grid grid-cols-2 gap-4">
      {user.vehicleDetails[0].driverPhotoPath && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Driver Photo</p>
          <img 
            src={user.vehicleDetails[0].driverPhotoPath}
            alt="Driver Photo"
            className="w-full h-auto rounded-lg shadow"
          />
        </div>
      )}
      {user.vehicleDetails[0].licensePhotoPath && (
        <div>
          <p className="text-sm text-gray-500 mb-2">License Photo</p>
          <img 
            src={user.vehicleDetails[0].licensePhotoPath}
            alt="License Photo"
            className="w-full h-auto rounded-lg shadow"
          />
          </div>
      )}
    </div>
  </div>
)}

            {/* Vehicle Information - Only show for drivers */}
            {user.role === UserRole.DRIVER &&
              user.vehicleDetails &&
              user.vehicleDetails.length > 0 && (
                <div className="space-y-4 border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Vehicle Information
                  </h3>

                  {user.vehicleDetails.map((vehicle, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <Car size={20} className="mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Vehicle {index + 1}
                        </p>
                        <p>
                          {vehicle.make} {vehicle.model} -{" "}
                          {vehicle.licensePlate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
