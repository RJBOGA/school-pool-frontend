// src/pages/InfoPage.tsx
import React from "react";
import Layout from "../components/layout/Layout";
import { Shield, Info, HelpCircle, School, Settings } from "lucide-react";

const InfoPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Us Section */}
        <section id="about" className="mb-16">
          <div className="flex items-center mb-6">
            <Info className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
          </div>
          <div className="prose max-w-none">
            <p>
              SchoolPool is a dedicated ride-sharing platform designed
              specifically for university students. Born from the unique
              transportation challenges faced by international and domestic
              students, our platform connects students who need rides with
              fellow students who can offer them.
            </p>
            <p>
              Our mission is to make student transportation safe, affordable,
              and convenient, particularly for those facing challenges with
              inter-state travel, airport transfers, and daily commutes to
              campus. We understand the specific needs of students, including
              the preference for cash payments and the importance of connecting
              with peers from the same university community.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-16">
          <div className="flex items-center mb-6">
            <Settings className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-xl font-semibold mb-4">1. Sign Up</div>
              <p>
                Register using your university email address. Choose whether you
                want to be a rider (looking for rides) or a driver (offering
                rides). Drivers will need to provide additional verification
                documents.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-xl font-semibold mb-4">
                2. Find or Offer Rides
              </div>
              <p>
                Drivers can post their travel schedules and available seats.
                Riders can search for available rides that match their needs and
                send ride requests.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-xl font-semibold mb-4">
                3. Travel Together
              </div>
              <p>
                Once a ride is confirmed, meet your fellow students and share
                the journey. Payments are handled in cash directly between
                riders and drivers.
              </p>
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section id="safety" className="mb-16">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Safety</h2>
          </div>
          <div className="prose max-w-none">
            <h3>Our Commitment to Safety</h3>
            <ul>
              <li>
                Verified university email addresses required for all users
              </li>
              <li>
                Driver verification process including photo ID and vehicle
                documentation
              </li>
              <li>In-app safety features and emergency contacts</li>
              <li>Community rating system</li>
              <li>
                Direct communication between riders and drivers through the
                platform
              </li>
            </ul>
            <p>
              Every driver undergoes a verification process before being
              approved to offer rides. This includes checking their driver's
              license, vehicle registration, and university affiliation. We
              maintain a strict code of conduct and take user reports seriously.
            </p>
          </div>
        </section>

        {/* Universities Section */}
        <section id="universities" className="mb-16">
          <div className="flex items-center mb-6">
            <School className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Universities</h2>
          </div>
          <div className="prose max-w-none">
            <p>
              SchoolPool currently serves students from various universities in
              the Kansas/Missouri area, including:
            </p>
            <ul>
              <li>University of Central Missouri (UCM)</li>
              <li>University of Missouri-Kansas City (UMKC)</li>
              <li>Missouri Innovation Campus (MIC)</li>
              <li>And more coming soon!</li>
            </ul>
            <p>
              We're continuously expanding our network to serve more
              universities and students. If you'd like to see SchoolPool at your
              university, please contact us!
            </p>
          </div>
        </section>

        {/* Help Center Section */}
        <section id="help" className="mb-16">
          <div className="flex items-center mb-6">
            <HelpCircle className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Help Center</h2>
          </div>
          <div className="prose max-w-none">
            <h2 className="font-bold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold">How do payments work?</h4>
                <p>
                  All payments are made in cash directly between riders and
                  drivers.
                </p>
              </div>
              <div>
                <h4 className="font-bold">What if I need to cancel a ride?</h4>
                <p>
                  Rides can be cancelled through the platform. We recommend
                  giving as much notice as possible.
                </p>
              </div>
              <div>
                <h4 className="font-bold">How do I become a driver?</h4>
                <p>
                  Register as a driver and submit your verification documents
                  including driver's license, vehicle registration, and photos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Terms Section */}
        <section id="legal" className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h2>
            <div className="prose">
              <p>
                We take your privacy seriously. Your personal information is
                only used to facilitate rides and verify your identity. We never
                share your information with third parties without your consent.
              </p>
              <p className="font-bold">Data we collect includes:</p>
              <ul>
                <li>University email address</li>
                <li>Basic profile information</li>
                <li>Ride history</li>
                <li>Driver verification documents</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h2>
            <div className="prose">
              <p>By using SchoolPool, you agree to:</p>
              <ul>
                <li>Provide accurate information about yourself</li>
                <li>Follow our community guidelines</li>
                <li>Respect other users' privacy and safety</li>
                <li>Use the platform only for its intended purpose</li>
                <li>Handle payments responsibly and as agreed</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default InfoPage;
