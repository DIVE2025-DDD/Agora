import React from "react";
import {Github, Linkedin, Twitter,} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/images/logo.png"
                alt="UNDP Logo"
                className="h-12 w-auto"
              />
              <div>
                <h5 className="text-xl font-bold">데이터 분석 시스템</h5>
                <p className="text-sm text-white/70">
                  지속가능한 미래를 위한 데이터 분석
                </p>
              </div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed text-sm">
              데이터 분석 플랫폼으로, AI 기반 분석을 통해 달성을 위한 인사이트를
              제공합니다.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 플랫폼 메뉴 */}
          <div>
            <h6 className="text-lg font-semibold mb-4">플랫폼</h6>
            <ul className="space-y-3">
              <li>
                <a
                  href="/dashboard"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  대시보드
                </a>
              </li>
              <li>
                <a
                  href="/analysis"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  데이터 분석
                </a>
              </li>
              <li>
                <a
                  href="/reports"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  보고서 생성
                </a>
              </li>
              <li>
                <a
                  href="/api"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  API 문서
                </a>
              </li>
            </ul>
          </div>

          {/* 지원 */}
          <div>
            <h6 className="text-lg font-semibold mb-4">지원</h6>
            <ul className="space-y-3">
              <li>
                <a
                  href="/docs"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  사용자 가이드
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  문의하기
                </a>
              </li>
              <li>
                <a
                  href="/status"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  시스템 상태
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © 2025 DEEP DIVE Hackerton TEAM. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-white/60 hover:text-white transition-colors"
              >
                개인정보처리방침
              </a>
              <a
                href="/terms"
                className="text-white/60 hover:text-white transition-colors"
              >
                이용약관
              </a>
              <a
                href="/security"
                className="text-white/60 hover:text-white transition-colors"
              >
                보안정책
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
