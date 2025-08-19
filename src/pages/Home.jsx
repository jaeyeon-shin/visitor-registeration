// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-11/12 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
          K-PRINT 2025 X{" "}
          <span className="relative inline-block">
            <span className="relative z-10">CMTECH</span>
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 bottom-[4px] h-[0.42em] rounded-sm"
              style={{ backgroundColor: "#ff4b89", opacity: 0.6 }}
            />
          </span>
          <br />
          방문자 상담 예약 프로그램
        </h1>

        <p className="text-gray-600 mb-8">아래 중 편하신 방법을 선택해주세요.</p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/card")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            명함 제출하기
          </button>
          <button
            onClick={() => navigate("/manual")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            직접 입력하기
          </button>
        </div>
      </div>
      {/* ✅ 하단 개인정보 처리 안내 */}
      <p className="text-xs text-gray-500 text-center px-8 mt-4 mb-8">
        ※ 전시 기간 동안 수집된 정보는 상담 목적으로만 활용되며, <br/ >
        일정 기간 경과 후 안전하게 파기됩니다.
      </p>
    </div>
  );
}
