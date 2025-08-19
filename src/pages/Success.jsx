import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md w-full animate-fadeIn">
        {/* 🎉 아이콘 */}
        <div className="text-5xl mb-6 animate-bounce">🎉</div>

        {/* 제목 */}
        <h1 className="text-2xl font-extrabold text-green-600 mb-4">
          접수가 완료되었습니다!
        </h1>

        {/* 설명 */}
        <p className="text-gray-600 mb-8">
          등록해주셔서 감사합니다. <br />
          담당자가 확인 후 연락드리겠습니다.
        </p>

        {/* 버튼 */}
        <Link
          to="/"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
