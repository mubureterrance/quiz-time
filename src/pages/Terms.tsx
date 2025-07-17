import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Please read these Terms and Conditions ("Terms") carefully before
            using QuizTime. By accessing or using our platform, you agree to be
            bound by these Terms.
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
            {/* Section 1 - Service Description */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                Service Description
              </h2>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-gray-700 leading-relaxed">
                  QuizTime is an online quiz platform that allows users to
                  create accounts, take quizzes, track progress, and earn
                  badges. We provide the platform "as is" and reserve the right
                  to modify, suspend, or discontinue any aspect of the service
                  at any time.
                </p>
              </div>
            </section>

            {/* Section 2 - Account Registration */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                Account Registration & Eligibility
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Age Requirements
                  </h3>
                  <p className="text-gray-600">
                    You must be at least 10 years old to use QuizTime. Users
                    under 18 should have parental consent.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Account Information
                  </h3>
                  <p className="text-gray-600">
                    You must provide accurate, current, and complete information
                    during registration and keep your account information
                    updated.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Account Security
                  </h3>
                  <p className="text-gray-600">
                    You are responsible for maintaining the confidentiality of
                    your account credentials and all activities under your
                    account.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 - User Responsibilities */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                User Responsibilities
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Account Management
                  </h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Maintain accurate account information</li>
                    <li>• Keep credentials secure</li>
                    <li>• Report unauthorized access immediately</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Platform Use
                  </h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Use the service lawfully</li>
                    <li>• Respect other users</li>
                    <li>• Follow community guidelines</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 - Acceptable Use */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                Acceptable Use Policy
              </h2>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Prohibited Activities
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Technical Violations
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Attempting to hack or disrupt the platform</li>
                      <li>• Using automated tools or bots</li>
                      <li>• Reverse engineering the service</li>
                      <li>• Overloading our servers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Content Violations
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Uploading inappropriate or offensive content</li>
                      <li>• Sharing copyrighted material</li>
                      <li>• Posting spam or misleading information</li>
                      <li>• Harassment or abusive behavior</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 - Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  5
                </span>
                Intellectual Property Rights
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Our Content
                  </h3>
                  <p className="text-gray-600">
                    All content, trademarks, logos, and intellectual property on
                    QuizTime are owned by QuizTime or its licensors. You may not
                    copy, modify, distribute, or use any content without
                    explicit permission.
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    User Content
                  </h3>
                  <p className="text-gray-600">
                    You retain ownership of content you create, but grant
                    QuizTime a license to use, display, and distribute it within
                    the platform for service operation.
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Copyright Infringement
                  </h3>
                  <p className="text-gray-600">
                    We respect intellectual property rights. If you believe your
                    copyright has been infringed, please contact us immediately.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 - Account Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  6
                </span>
                Account Termination
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-gray-800 mb-2">By You</h3>
                  <p className="text-gray-600 text-sm">
                    You may terminate your account at any time by contacting us
                    or using account settings. Some data may be retained as
                    required by law.
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-gray-800 mb-2">By Us</h3>
                  <p className="text-gray-600 text-sm">
                    We may suspend or terminate your account for violations of
                    these Terms, illegal activities, or at our discretion with
                    reasonable notice.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 - Privacy & Data */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  7
                </span>
                Privacy & Data Protection
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Our collection, use, and
                  protection of your personal information is governed by our
                  Privacy Policy, which is incorporated into these Terms by
                  reference. Please review our Privacy Policy to understand our
                  data practices.
                </p>
              </div>
            </section>

            {/* Section 8 - Service Availability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  8
                </span>
                Service Availability & Modifications
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-yellow-500 mr-2">⚠️</span>
                  <p className="text-gray-600 text-sm">
                    We strive to provide reliable service but cannot guarantee
                    100% uptime
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2">ℹ️</span>
                  <p className="text-gray-600 text-sm">
                    We may modify, suspend, or discontinue features with
                    reasonable notice
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <p className="text-gray-600 text-sm">
                    We will provide advance notice of significant changes when
                    possible
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 - Disclaimers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  9
                </span>
                Disclaimers
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                <p className="text-gray-700 leading-relaxed font-medium">
                  QuizTime is provided "AS IS" and "AS AVAILABLE" without
                  warranties of any kind, either express or implied. We do not
                  guarantee the accuracy, completeness, reliability, or
                  availability of the platform or its content. Your use of the
                  service is at your own risk.
                </p>
              </div>
            </section>

            {/* Section 10 - Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  10
                </span>
                Limitation of Liability
              </h2>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-gray-700 leading-relaxed">
                  <strong>To the fullest extent permitted by law:</strong>{" "}
                  QuizTime, its team, and affiliates shall not be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages, including but not limited to loss of data, loss of
                  profits, or business interruption, arising from your use of
                  the platform.
                </p>
              </div>
            </section>

            {/* Section 11 - Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  11
                </span>
                Indemnification
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless QuizTime and its team
                from any claims, damages, losses, or expenses arising from your
                use of the platform, violation of these Terms, or infringement
                of any third-party rights.
              </p>
            </section>

            {/* Section 12 - Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  12
                </span>
                Changes to These Terms
              </h2>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-gray-700 leading-relaxed">
                  We may update these Terms from time to time. We will notify
                  users of significant changes through the app, email, or
                  prominent notice on our website. Continued use of QuizTime
                  after changes constitutes acceptance of the new Terms. If you
                  don't agree with changes, you should stop using the service.
                </p>
              </div>
            </section>

            {/* Section 13 - Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  13
                </span>
                Governing Law & Dispute Resolution
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Governing Law
                  </h3>
                  <p className="text-gray-600">
                    These Terms are governed by and construed in accordance with
                    the laws of the Republic of Botswana.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Dispute Resolution
                  </h3>
                  <p className="text-gray-600">
                    Any disputes arising from these Terms will be resolved in
                    the courts of Botswana. We encourage resolving disputes
                    through direct communication first.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 14 - Severability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  14
                </span>
                Severability & Entire Agreement
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Severability
                  </h3>
                  <p className="text-gray-600 text-sm">
                    If any provision of these Terms is found unenforceable, the
                    remaining provisions will continue in full force.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Entire Agreement
                  </h3>
                  <p className="text-gray-600 text-sm">
                    These Terms constitute the entire agreement between you and
                    QuizTime regarding the service.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 mb-4">
            If you have questions about these Terms & Conditions, please contact
            us:
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
              <strong>Response Time:</strong> We aim to respond to inquiries
              within 72 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
