import { useState } from "react";
import { Link } from "react-router-dom";
import { eventYearMap } from "../data/eventYears";

const genreOptions = [
  "ドラマ", "アニメ", "映画", "ゲーム", "J-POP", "K-POP", "邦楽", "洋楽", "ボカロ", "ネタ枠", "その他"
];

function RecruitForm() {
  const [formData, setFormData] = useState({
    event: "",
    title: "",
    arranger: "",
    artist: "",
    leader: "",
    generation: "",
    capacity: "",
    genres: [],
    comment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newGenres = checked
        ? [...prev.genres, value].slice(0, 3)
        : prev.genres.filter((g) => g !== value);
      return { ...prev, genres: newGenres };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("送信データ:", formData);
  };

  const fullEventList = Object.entries(eventYearMap).map(
    ([name, year]) => `${name}${year}`
  );

  return (
    <div className="relative min-h-screen p-6 pt-16 max-w-xl mx-auto">
      {/* 戻るボタン */}
      <div className="absolute top-4 left-4">
        <Link to="/entry">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            新規登録メニューに戻る
          </button>
        </Link>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-center">曲の募集登録フォーム</h2>

        <label className="block">
          イベント名：
          <select
            name="event"
            value={formData.event}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">選択してください</option>
            {fullEventList.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </label>

        <label className="block">
          曲名：
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          作曲者（任意）：
          <input
            type="text"
            name="arranger"
            value={formData.arranger}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          アーティスト（任意）：
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          アンサリーダー：
          <input
            type="text"
            name="leader"
            value={formData.leader}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          アンサリーダーの代：
          <input
            type="number"
            name="generation"
            value={formData.generation}
            onChange={handleChange}
            required
            min="1"
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          募集人数（最大8）：
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            min="1"
            max="8"
            className="w-full border p-2 rounded"
          />
        </label>

        <fieldset>
          <legend className="font-medium mb-2">ジャンル（最大3つ）:</legend>
          <div className="flex flex-wrap gap-2">
            {genreOptions.map((g) => (
              <label key={g} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  value={g}
                  checked={formData.genres.includes(g)}
                  onChange={handleGenreChange}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          自由記述欄（任意）：
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="3"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          登録する
        </button>
      </form>
    </div>
  );
}

export default RecruitForm;
