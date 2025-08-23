import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import { UserPlus, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { FieldError } from "../components/field_error";

interface RegisterProps {}

const RegisterPage = (props: RegisterProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [passwordError, setPasswordError] = useState("");

  const { data, setData, post, processing, errors } = useForm({
    email: "",
    nickname: "",
    phone_number: "",
    crypto_wallet_address: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 클라이언트 측 비밀번호 확인 검증
    if (data.password !== data.password_confirmation) {
      return;
    }

    post("/register");
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
                  src="/images/logo.png"
                  alt="UNDP DataBridge"
                  className="h-16 mx-auto hover:scale-105 transition-transform duration-200"
                />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                회원가입
              </h1>
            </div>

            {/* Register Form */}
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

              {/* Nickname Field */}
              <div>
                <label
                  htmlFor="nickname"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  닉네임
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="nickname"
                    type="text"
                    value={data.nickname}
                    onChange={(e) => setData("nickname", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                    placeholder="닉네임을 입력하세요"
                    required
                  />
                </div>
                <FieldError error={errors.nickname} />
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
                    onChange={(e) => {
                      const value = e.target.value;
                      setData("password", value);

                      // 비밀번호 확인 필드와의 일치 여부 검사
                      if (
                        data.password_confirmation &&
                        value !== data.password_confirmation
                      ) {
                        setPasswordError("비밀번호가 일치하지 않습니다");
                      } else if (
                        data.password_confirmation &&
                        value === data.password_confirmation
                      ) {
                        setPasswordError("");
                      }
                    }}
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
                <FieldError error={errors.password} />
              </div>

              {/* Password Confirmation Field */}
              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password_confirmation"
                    type={showPasswordConfirmation ? "text" : "password"}
                    value={data.password_confirmation}
                    onChange={(e) => {
                      const value = e.target.value;
                      setData("password_confirmation", value);

                      // 실시간 비밀번호 확인 검증
                      if (value && data.password && value !== data.password) {
                        setPasswordError("비밀번호가 일치하지 않습니다");
                      } else {
                        setPasswordError("");
                      }
                    }}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswordConfirmation(!showPasswordConfirmation)
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                <FieldError
                  error={passwordError || errors.password_confirmation}
                />
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
                {processing ? "가입 중..." : "회원가입"}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  로그인
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
RegisterPage.layout = (page) => page;

export default RegisterPage;
