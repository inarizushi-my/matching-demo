import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { eventYearMap } from "../data/eventYears";

function MatchPerformer() {
  const [email, setEmail] = useState("");
  const [event, setEvent] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [matchedResults, setMatchedResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    setErrorMessage("");
    setMatchedResults([]);
    setSubmittedEmail("");

    if (!email.trim() || !event) {
      setErrorMessage("イベントとメールアドレスの両方を入力してください。");
      return;
    }

    const { data: myRecruits, error: myRecruitsError } = await supabase
      .from("recruits")
      .select("*")
      .eq("email", email.trim())
      .eq("event", event);

    if (myRecruitsError || !myRecruits || myRecruits.length === 0) {
      setErrorMessage("該当する募集が見つかりませんでした。");
      return;
    }

    const recruitIds = myRecruits.map((r) => r.id);

    const { data: performers, error: performersError } = await supabase
      .from("performers")
      .select("*")
      .eq("event", event);

    const { data: applications, error: appError } = await supabase
      .from("applications")
      .select("*")
      .in("recruit_id", recruitIds);

    if (performersError || !performers) {
      setErrorMessage("演奏者データの取得に失敗しました。");
      return;
    }

    const matched = [];

    for (const recruit of myRecruits) {
      const recruitGenres = Array.isArray(recruit.genres)
        ? recruit.genres
        : JSON.parse(recruit.genres || "[]");
      const title = recruit.title;

      const applied = applications.filter((app) => app.recruit_id === recruit.id);
      for (const app of applied) {
        const performer = performers.find((p) => p.email === app.performer_email);
        if (performer) {
          matched.push({
            recruitTitle: title,
            performerName: performer.name,
            generation: performer.generation,
            available: performer.available,
            reason: "立候補",
            message: app.message || "",
          });
        } else {
          matched.push({
            recruitTitle: title,
            performerName: app.performer_email,
            generation: "?",
            available: "?",
            reason: "立候補（登録なし）",
            message: app.message || "",
          });
        }
      }

      for (const perf of performers) {
        const genres = Array.isArray(perf.genres)
          ? perf.genres
          : JSON.parse(perf.genres || "[]");
        const artists = Array.isArray(perf.artists)
          ? perf.artists
          : JSON.parse(perf.artists || "[]");

        const alreadyMatched = matched.some(
          (m) => m.recruitTitle === title && m.performerName === perf.name
        );
        if (alreadyMatched) continue;

        let reason = "";
        if (recruit.composer && artists.includes(recruit.composer)) {
          reason = "作曲者一致";
        } else if (recruit.artist && artists.includes(recruit.artist)) {
          reason = "アーティスト一致";
        } else if (recruitGenres.some((g) => genres.includes(g))) {
          reason = "ジャンル一致";
        }

        if (reason) {
          matched.push({
            recruitTitle: title,
            performerName: perf.name,
            generation: perf.generation,
            available: perf.available,
            reason,
            message: null,
          });
        }
      }
    }

    setMatchedResults(matched);
    setSubmittedEmail(email.trim());
  };

  return (
    <div className="relative min-h-screen p-6 pt-16 max-w-3xl mx-auto">
      <div className="absolute top-4 left-4">
        <Link to="/matching">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            マッチングメニューに戻る
          </button>
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">演奏者のマッチング</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="space-y-4 mb-4"
      >
        <div>
          <h3 className="text-lg font-semibold mb-1">① イベントを選んでください</h3>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            required
          >
            <option value="">選択してください</option>
            {Object.entries(eventYearMap).map(([name, year]) => (
              <option key={name + year} value={name + year}>
                {name + year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">② メールアドレスを入力してください</h3>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              placeholder="example@example.com"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              検索
            </button>
          </div>
        </div>
      </form>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
          {errorMessage}
        </div>
      )}

      {submittedEmail && matchedResults.length === 0 && !errorMessage && (
        <p className="text-center text-gray-500 mt-8">
          一致する演奏者が見つかりませんでした。
        </p>
      )}

      {matchedResults.length > 0 && (
        <ul className="space-y-4">
          {matchedResults.map((res, idx) => (
            <li
              key={idx}
              className="border rounded p-4 bg-white shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-1">
                {res.performerName}（{res.generation}代）
              </h3>
              <p className="text-sm text-gray-700">対象曲：{res.recruitTitle}</p>
              <p className="text-sm text-gray-700">
                空き：{res.available ?? 0}曲 ／ ヒット理由：{res.reason}
              </p>
              {res.reason.startsWith("立候補") && res.message && (
                <p className="text-sm text-gray-500 mt-1">
                  メッセージ：{res.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MatchPerformer;
