// src/pages/CardUpload.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function CardUpload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cardFile: null,
    categories: [],
    message: "",
    consent: false, // ✅ 초기값 추가
  });

  const categories = ["소형 평판UV", "대형 평판UV", "UV DTF", "기타"];

  // ✅ 한국 시간(KST) yyyy-mm-dd 문자열 생성
  const getKSTDateString = () => {
    const now = new Date();
    const kstOffset = 9 * 60; // UTC+9
    const localTime = new Date(now.getTime() + kstOffset * 60 * 1000);
    return localTime.toISOString().split("T")[0];
  };

  // 카테고리 선택 토글
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

  // 파일 업로드 or 카메라 촬영
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, cardFile: file });
    }
  };

  // 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let cardPath = null;

      // 명함 이미지 업로드
      if (form.cardFile) {
        const today = getKSTDateString(); // ✅ KST 날짜 사용
        const ext = form.cardFile.name.split(".").pop(); // 확장자
        const safeFileName = `${Date.now()}.${ext}`; // 고유 파일명
        const filePath = `${today}/${safeFileName}`; // 날짜별 폴더에 저장

        const { error: uploadError } = await supabase.storage
          .from("cards")
          .upload(filePath, form.cardFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("이미지 업로드 실패:", uploadError.message);
          alert("이미지 업로드 실패. 다시 시도해주세요.");
          return;
        }

        cardPath = filePath; // DB에는 경로만 저장
      }

      // leads 테이블에 데이터 저장
      const { error: insertError } = await supabase.from("leads").insert([
        {
          mode: "card",
          card_image_path: cardPath, // ✅ 필드명 맞춤
          categories: form.categories,
          message: form.message,
          consent: form.consent, // ✅ 체크박스 값 반영
        },
      ]);

      if (insertError) {
        console.error("DB 저장 실패:", insertError.message);
        alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
        return;
      }

      navigate("/success"); // 성공 시 이동
    } catch (err) {
      console.error("에러 발생:", err);
      alert("처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          명함 제출하기
        </h1>

        {/* 명함 업로드 */}
        <div className="mb-6 text-center">
          {form.cardFile ? (
            <img
              src={URL.createObjectURL(form.cardFile)}
              alt="명함 미리보기"
              className="mx-auto w-48 h-32 object-cover rounded-lg border shadow"
            />
          ) : (
            <div className="w-48 h-32 mx-auto flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
              미리보기
            </div>
          )}

          <div className="mt-4 flex gap-3 justify-center">
            <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition">
              파일 업로드
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer transition">
              카메라 촬영
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            문의사항
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
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
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
        >
          제출하기
        </button>
      </form>
    </div>
  );
}
