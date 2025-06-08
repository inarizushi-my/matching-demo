import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { eventYearMap } from "../data/eventYears";

function PerformerList() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [performers, setPerformers] = useState([]);
  const [inviteFormId, setInviteFormId] = useState(null);
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruitTitle, setRecruitTitle] = useState("");
  const [message, setMessage] = useState("");

  const allEvents = Object.entries(eventYearMap).map(
    ([name, year]) => `${name}${year}`
  );

  useEffect(() => {
    const fetchPerformers = async () => {
      const { data, error } = await supabase
        .from("performers")
        .select("*");

      if (error) {
        console.error("演奏者データの取得エラー:", error);
      } else {
        setPerformers(data);
      }
    };

    fetchPerformers();
  }, []);

  const handleInvite = async (performer, event) => {
    if (!recruiterEmail.trim() || !recruitTitle.trim()) {
      alert("メールアドレスと曲名を入力してください。");
      return;
    }

    const { data: recruits, error: recruitError } = await supabase
      .from("recruits")
      .select("id")
      .eq("email", recruiterEmail.trim())
      .eq("title", recruitTitle.trim())
      .eq("event", event);

    if (recruitError) {
      alert("確認中にエラーが発生しました。");
      return;
    }

    if (!recruits || recruits.length === 0) {
      alert("該当の曲募集が見つかりません。");
      return;
    }

    const recruitId = recruits[0].id;

    const { data: existing, error: checkError } = await supabase
      .from("invitations")
      .select("*")
      .eq("recruit_id", recruitId)
      .eq("performer_id", performer.id);

    if (checkError) {
      alert("確認中にエラーが発生しました。");
      return;
    }

    if (existing.length > 0) {
      alert("すでに招待済みです。");
      return;
    }

    const { error } = await supabase.from("invitations").insert([
      {
        recruit_id: recruitId,
        performer_id: performer.id,
        inviter_email: recruiterEmail.trim(),
        message: message.trim(),
      },
    ]);

    if (error) {
      alert("招待に失敗しました。もう一度お試しください。");
    } else {
      alert(`${performer.name} さんを招待しました！`);
      setInviteFormId(null);
      setRecruiterEmail("");
      setRecruitTitle("");
      setMessage("");
    }
  };

  const filteredData =
    selectedEvent === ""
      ? performers
      : performers.filter((p) => p.event === selectedEvent);

  return (
    <div className="relative min-h-screen p-6 pt-16 max-w-3xl mx-auto">
      <div className="absolute top-4 left-4">
        <Link to="/">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ホームに戻る
          </button>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">演奏者一覧</h2>

      <div className="mb-6 text-center">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">全てのイベント</option>
          {allEvents.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>

      {filteredData.length === 0 ? (
        <p className="text-center text-gray-600 mt-12 text-lg">
          まだこのイベントには演奏者が登録されていません。
        </p>
      ) : (
        <div className="grid gap-4">
          {filteredData.map((person) => (
            <div key={person.id} className="border rounded p-4 shadow bg-white">
              <div className="block md:hidden">
                <Link to={`/performer/${person.id}`}>
                  <h3 className="text-lg font-bold mb-2 text-blue-600 hover:underline">
                    {person.name}
                  </h3>
                </Link>
                <div className="flex justify-start items-center gap-x-8">
                  <div className="text-base text-gray-700 flex flex-col gap-y-1">
                    <span>{person.event}</span>
                    <span>空き：{person.available ?? 0}曲</span>
                  </div>
                  <button
                    className="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() =>
                      setInviteFormId(
                        inviteFormId === person.id ? null : person.id
                      )
                    }
                  >
                    招待する
                  </button>
                </div>
                {inviteFormId === person.id && (
                  <div className="mt-2 space-y-2">
                    <input
                      type="email"
                      placeholder="あなたのメールアドレス"
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      placeholder="曲名"
                      value={recruitTitle}
                      onChange={(e) => setRecruitTitle(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      placeholder="メッセージ（任意）"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleInvite(person, person.event)}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                      >
                        送信
                      </button>
                      <button
                        onClick={() => setInviteFormId(null)}
                        className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden md:flex justify-between items-center">
                <Link to={`/performer/${person.id}`} className="w-1/5">
                  <h3 className="text-lg font-bold text-blue-600 hover:underline">
                    {person.name}
                  </h3>
                </Link>
                <p className="text-base text-gray-700 w-2/5">{person.event}</p>
                <p className="text-base text-gray-700 w-1/5 text-right">
                  空き：{person.available ?? 0}曲
                </p>
                <div className="w-1/5 text-right">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() =>
                      setInviteFormId(
                        inviteFormId === person.id ? null : person.id
                      )
                    }
                  >
                    招待する
                  </button>
                </div>
              </div>
              {inviteFormId === person.id && (
                <div className="hidden md:block mt-2 space-y-2">
                  <input
                    type="email"
                    placeholder="あなたのメールアドレス"
                    value={recruiterEmail}
                    onChange={(e) => setRecruiterEmail(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="曲名"
                    value={recruitTitle}
                    onChange={(e) => setRecruitTitle(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="メッセージ（任意）"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleInvite(person, person.event)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      送信
                    </button>
                    <button
                      onClick={() => setInviteFormId(null)}
                      className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PerformerList;
