import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // 👈 supabaseClient.js 불러오기

export default function ManualForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company: "",
    name: "",
    position: "",
    phone: "",
    categories: [],
    message: "",
    consent: false,
  });

  const categories = ["소형 평판UV", "대형 평판UV", "UV DTF", "기타"];

  const toggleCategory = (cat) => {
    setForm((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.consent) {
      alert("개인정보 수집·이용에 동의해야 제출할 수 있습니다.");
      return;
    }

    const { data, error } = await supabase.from("leads").insert([
      {
        mode: "manual", // 자동 세팅
        company: form.company,
        name: form.name,
        title: form.position, // DB는 title
        phone: form.phone,
        categories: form.categories,
        message: form.message,
        consent: form.consent,
        ua: navigator.userAgent,
      },
    ]);

    if (error) {
      console.error("저장 실패:", error.message);
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    console.log("저장 성공:", data);
    navigate("/success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          직접 입력하기
        </h1>

        {/* 회사명 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            회사명
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="회사명을 입력하세요"
            required
          />
        </div>

        {/* 성명 / 직급 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              성명
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="홍길동"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              직급
            </label>
            <input
              type="text"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="과장"
            />
          </div>
        </div>

        {/* 연락처 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            연락처
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="010-1234-5678"
            required
          />
        </div>

        {/* 카테고리 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제품 카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  form.categories.includes(cat)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 문의사항 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            문의사항
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="문의하실 내용을 입력해주세요."
          />
        </div>

        {/* 개인정보 동의 */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            required
            className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">
            개인정보 수집·이용에 동의합니다.
          </span>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
        >
          제출하기
        </button>
      </form>
    </div>
  );
}
