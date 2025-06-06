import { useState } from "react";
import { eventYearMap } from "../data/eventYears";

const eventOptions = Object.entries(eventYearMap).map(
  ([eventName, year]) => `${eventName}${year}`
);

const genreOptions = [
  "ドラマ", "アニメ", "映画", "ゲーム", "J-POP", "K-POP", "邦楽", "洋楽", "ボカロ", "ネタ枠", "その他"
];

function RecruitForm() {
  const [formData, setFormData] = useState({
    event: "",
    title: "",
    composer: "",
    artist: "",
    leaderName: "",
    leaderGen: "",
    genres: [],
    capacity: "",
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
    console.log("フォーム送信内容:", formData);
  };

  return (
    <form className="max-w-xl mx-auto p-4 space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-center">曲の募集フォーム</h2>

      {/* イベント */}
      <label className="block">
        イベント名：
        <select name="event" value={formData.event} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">選択してください</option>
          {eventOptions.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </label>

      {/* 曲名 */}
      <label className="block">
        曲名（必須）：
        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border p-2 rounded" />
      </label>

      {/* 作曲者（任意） */}
      <label className="block">
        作曲者（任意）：
        <input type="text" name="composer" value={formData.composer} onChange={handleChange} className="w-full border p-2 rounded" />
      </label>

      {/* アーティスト名（任意） */}
      <label className="block">
        アーティスト名（任意）：
        <input type="text" name="artist" value={formData.artist} onChange={handleChange} className="w-full border p-2 rounded" />
      </label>

      {/* アンサリーダー */}
      <label className="block">
        アンサリーダーの名前：
        <input type="text" name="leaderName" value={formData.leaderName} onChange={handleChange} required className="w-full border p-2 rounded" />
      </label>

      <label className="block">
        アンサリーダーの代：
        <input type="text" name="leaderGen" value={formData.leaderGen} onChange={handleChange} required className="w-full border p-2 rounded" />
      </label>

      {/* ジャンル（最大3つ） */}
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

      {/* 募集人数 */}
      <label className="block">
        募集人数（1〜8）：
        <select name="capacity" value={formData.capacity} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">選択してください</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}人</option>
          ))}
        </select>
      </label>

      {/* 自由記述欄（任意） */}
      <label className="block">
        自由記述欄（任意）：
        <textarea name="comment" value={formData.comment} onChange={handleChange} className="w-full border p-2 rounded" rows="3" />
      </label>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        登録する
      </button>
    </form>
  );
}

export default RecruitForm;
