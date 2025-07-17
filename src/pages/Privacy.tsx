import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Your privacy is important to us. This Privacy Policy explains how
            QuizTime collects, uses, and protects your information when you use
            our quiz platform.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-800">
              <strong>Last updated:</strong>{" "}
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Account Information
                  </h3>
                  <p className="text-gray-600">
                    When you register, we collect your name, email address, and
                    password.
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Quiz Data
                  </h3>
                  <p className="text-gray-600">
                    We store your quiz attempts, scores, badges earned, and
                    related activity.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Usage Data
                  </h3>
                  <p className="text-gray-600">
                    We may collect information about how you use the app, such
                    as pages visited and features used.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Automatic Data Collection
                  </h3>
                  <p className="text-gray-600">
                    We automatically collect IP addresses, device information,
                    browser type, and operating system details.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                How We Use Your Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Core Functions
                  </h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Provide and improve the quiz experience</li>
                    <li>• Track your progress and award badges</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Platform Management
                  </h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Communicate important updates</li>
                    <li>• Maintain security and integrity</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                Third-Party Services
              </h2>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-gray-700 leading-relaxed">
                  QuizTime may use third-party services (such as authentication
                  or analytics providers) to operate and improve the app. These
                  services may have access to certain information as required to
                  perform their functions, but they are not permitted to use it
                  for other purposes.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                Cookies & Tracking
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may use cookies or similar technologies to remember your
                preferences and enhance your experience. You can control cookies
                through your browser settings.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  5
                </span>
                Data Security
              </h2>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-gray-700 leading-relaxed">
                  We take reasonable measures to protect your information from
                  unauthorized access, loss, or misuse. However, no system is
                  completely secure, and we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  6
                </span>
                Data Retention
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your account information and quiz data for as long as
                your account is active. If you delete your account, we will
                remove your personal information within 30 days, though some
                data may be retained for legal or security purposes.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  7
                </span>
                Geographic Scope
              </h2>
              <p className="text-gray-600 leading-relaxed">
                QuizTime is operated from Botswana and intended for users
                worldwide. By using our service, you consent to the transfer of
                your information to the Republic of Botswana.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  8
                </span>
                Your Rights & Choices
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">
                      View and update your account information
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">
                      Request deletion of your account and data
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">
                      Access your personal data
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">
                      Object to data processing
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  9
                </span>
                Age Requirements
              </h2>
              <p className="text-gray-600 leading-relaxed">
                QuizTime is intended for users 10 years of age and older. We do
                not knowingly collect personal information from children under
                10. If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  10
                </span>
                Changes to This Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify users of significant changes through the app or by email.
              </p>
            </section>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 mb-4">
            For questions or requests regarding this Privacy Policy, please
            contact us:
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:mubureterrance@gmail.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                mubureterrance@gmail.com
              </a>
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Response Time:</strong> We aim to respond to privacy
              requests within 72 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
