import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Shield, DollarSign, Users } from "lucide-react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../contexts/AuthContext";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleGetStarted = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Student Rides Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with fellow students for safe and affordable rides to
              campus and beyond.
            </p>
            <div className="space-x-4">
              <button
                onClick={handleGetStarted}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/how-it-works")}
                className="px-6 py-3 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose SchoolPool?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary-600" />}
              title="Safe Rides"
              description="Verified student drivers and university email verification"
            />
            <FeatureCard
              icon={<DollarSign className="h-8 w-8 text-primary-600" />}
              title="Save Money"
              description="Split costs with fellow students going the same way"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary-600" />}
              title="Community"
              description="Connect with students from your university"
            />
            <FeatureCard
              icon={<Car className="h-8 w-8 text-primary-600" />}
              title="Convenient"
              description="Easy booking and flexible scheduling"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Sign Up"
              description="Create an account with your university email"
            />
            <StepCard
              number="2"
              title="Find or Offer Rides"
              description="Search for available rides or offer seats in your car"
            />
            <StepCard
              number="3"
              title="Travel Together"
              description="Meet your fellow students and share the journey"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Join SchoolPool Today
          </button>
        </div>
      </section>
    </Layout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="text-center p-6">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <div className="text-center p-6">
    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;
