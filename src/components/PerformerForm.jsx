import { useState } from "react";
import { Link } from "react-router-dom";
import { eventYearMap } from "../data/eventYears";
import { supabase } from "../lib/supabaseClient"; // supabase 接続用

const genreOptions = [
  "ドラマ", "アニメ", "映画", "ゲーム", "J-POP", "K-POP", "邦楽", "洋楽", "ボカロ", "ネタ枠", "その他"
];

function PerformerForm() {
  const [formData, setFormData] = useState({
    event: "",
    name: "",
    generation: "",
    availability: "",
    genres: [],
    favoriteArtists: ["", "", ""],
    comment: "",
    email: "",
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

  const handleArtistChange = (index, value) => {
    const updated = [...formData.favoriteArtists];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, favoriteArtists: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { event, name, generation, availability, genres, favoriteArtists, comment, email } = formData;

    const { error } = await supabase.from("performers").insert([
      {
        event,
        name,
        generation: parseInt(generation),
        available: parseInt(availability),
        genres,
        artists: favoriteArtists.filter((a) => a.trim() !== ""),
        note: comment,
        email: email.trim() || null,
      },
    ]);

    if (error) {
      alert("登録に失敗しました：" + error.message);
    } else {
      alert("登録が完了しました！");
      setFormData({
        event: "",
        name: "",
        generation: "",
        availability: "",
        genres: [],
        favoriteArtists: ["", "", ""],
        comment: "",
        email: "",
      });
    }
  };

  const fullEventList = Object.entries(eventYearMap).map(
    ([name, year]) => `${name}${year}`
  );

  return (
    <div className="relative min-h-screen p-6 pt-16 max-w-xl mx-auto">
      <div className="absolute top-4 left-4">
        <Link to="/entry">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            新規登録メニューに戻る
          </button>
        </Link>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-center">演奏者登録フォーム</h2>

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
          メールアドレス（編集用リンク送付先）：
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="example@example.com"
          />
        </label>

        <label className="block">
          名前：
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          代（数字のみ）：
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
          空き曲数（0〜5）：
          <input
            type="number"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            required
            min="0"
            max="5"
            className="w-full border p-2 rounded"
          />
        </label>

        <fieldset>
          <legend className="font-medium mb-2">弾きたいジャンル（最大3つ）:</legend>
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
          好きなアーティスト（最大3人）：
          <div className="space-y-2 mt-1">
            {formData.favoriteArtists.map((artist, idx) => (
              <input
                key={idx}
                type="text"
                value={artist}
                onChange={(e) => handleArtistChange(idx, e.target.value)}
                className="w-full border p-2 rounded"
                placeholder={`アーティスト${idx + 1}`}
              />
            ))}
          </div>
        </label>

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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          登録する
        </button>
      </form>
    </div>
  );
}

export default PerformerForm;
