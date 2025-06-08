import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const genreOptions = [
  "ドラマ", "アニメ", "映画", "ゲーム", "J-POP", "K-POP", "邦楽", "洋楽", "ボカロ", "ネタ枠", "その他"
];

function EditEntryPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      const table = type === "曲" ? "recruits" : "performers";
      const { data, error } = await supabase.from(table).select("*").eq("id", id).single();

      if (error || !data) {
        setError("データの取得に失敗しました。");
        setLoading(false);
        return;
      }

      if (type === "演奏者") {
        const filledArtists = (data.artists || []);
        while (filledArtists.length < 3) filledArtists.push("");

        setFormData({
          name: data.name || "",
          generation: data.generation || "",
          available: data.available || "",
          genres: data.genres || [],
          artists: filledArtists,
          note: data.note || "",
          event: data.event || "",
        });
      } else {
        setFormData({
          event: data.event || "",
          title: data.title || "",
          composer: data.composer || "",
          artist: data.artist || "",
          leader: data.leader || "",
          generation: data.generation || "",
          capacity: data.capacity || "",
          genres: data.genres || [],
          comment: data.comment || "",
        });
      }
      setLoading(false);
    };

    fetchData();
  }, [type, id]);

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
    const updated = [...formData.artists];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, artists: updated }));
  };

  const handleSave = async () => {
    const table = type === "曲" ? "recruits" : "performers";
    const payload = {
      ...formData,
      generation: parseInt(formData.generation),
    };

    if (type === "演奏者") {
      payload.available = parseInt(formData.available);
    } else {
      payload.capacity = parseInt(formData.capacity);
    }

    delete payload.created_at;

    const { error } = await supabase.from(table).update(payload).eq("id", id);

    if (error) {
      setError("保存に失敗しました。");
    } else {
      setSuccessMsg("保存しました。");
      setTimeout(() => navigate("/history"), 1000);
    }
  };

  if (loading) return <p className="p-4">読み込み中...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <Link to="/history">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ← 戻る
          </button>
        </Link>
      </div>

      <h1 className="text-xl font-bold mb-4">{type} の編集</h1>

      <label className="block mb-1 font-semibold">イベント名</label>
      <input
        type="text"
        name="event"
        value={formData.event}
        className="border px-3 py-2 rounded w-full mb-4 bg-gray-100"
        readOnly
      />

      {type === "演奏者" ? (
        <>
          <label className="block mb-1 font-semibold">演奏者名</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />

          <label className="block mb-1 font-semibold">代</label>
          <input type="number" name="generation" value={formData.generation} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />

          <label className="block mb-1 font-semibold">空き曲数</label>
          <input type="number" name="available" value={formData.available} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />

          <fieldset className="mb-4">
            <legend className="font-semibold mb-1">ジャンル（最大3つ）</legend>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map((g) => (
                <label key={g} className="flex items-center space-x-1">
                  <input type="checkbox" value={g} checked={formData.genres.includes(g)} onChange={handleGenreChange} />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            好きなアーティスト（最大3人）：
            <div className="space-y-2 mt-1">
              {formData.artists.map((artist, idx) => (
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

          <label className="block mb-1 font-semibold mt-4">自由記述</label>
          <textarea name="note" value={formData.note} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />
        </>
      ) : (
        <>
          <label className="block mb-1 font-semibold">曲名</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />

          <label className="block mb-1 font-semibold">作曲者（任意）</label>
          <input type="text" name="composer" value={formData.composer} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />

          <label className="block mb-1 font-semibold">アーティスト（任意）</label>
          <input type="text" name="artist" value={formData.artist} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />

          <label className="block mb-1 font-semibold">アンサリーダー</label>
          <input type="text" name="leader" value={formData.leader} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />

          <label className="block mb-1 font-semibold">アンサリーダーの代</label>
          <input type="number" name="generation" value={formData.generation} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />

          <label className="block mb-1 font-semibold">募集人数</label>
          <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />

          <fieldset className="mb-4">
            <legend className="font-semibold mb-1">ジャンル（最大3つ）</legend>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map((g) => (
                <label key={g} className="flex items-center space-x-1">
                  <input type="checkbox" value={g} checked={formData.genres.includes(g)} onChange={handleGenreChange} />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block mb-1 font-semibold">自由記述</label>
          <textarea name="comment" value={formData.comment} onChange={handleChange} className="border px-3 py-2 rounded w-full mb-4" />
        </>
      )}

      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        保存
      </button>
    </div>
  );
}

export default EditEntryPage;