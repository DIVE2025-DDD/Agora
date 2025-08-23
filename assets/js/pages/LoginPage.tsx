import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import { LogIn, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { FieldError } from "../components/field_error";

interface LoginProps {}

const LoginPage = (props: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/login");
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Image - similar to HomePage */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/bg_earth.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/30"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0468B1 1px, transparent 1px),
            linear-gradient(to bottom, #0468B1 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      ></div>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-4">
                <img
                  src="/images/logo.svg"
                  alt="UNDP DataBridge"
                  className="h-16 mx-auto hover:scale-105 transition-transform duration-200"
                />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">로그인</h1>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  이메일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                    placeholder="이메일을 입력하세요"
                    required
                  />
                </div>
                <FieldError error={errors.email} />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                <FieldError error={errors.general} />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData("remember", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    로그인 상태 유지
                  </span>
                </label>
                <Link
                  href="/reset_password"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  비밀번호 찾기
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  processing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {processing ? "로그인 중..." : "로그인"}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                계정이 없으신가요?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 레이아웃을 사용하지 않도록 설정
LoginPage.layout = (page) => page;

export default LoginPage;
