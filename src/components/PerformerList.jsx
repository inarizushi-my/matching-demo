import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventYearMap } from "../data/eventYears";
import samplePerformers from "../data/sample_performers.json";

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
    setPerformers(samplePerformers);
  }, []);

  const handleInvite = async (performer, event) => {
    alert("デモモードでは招待機能は使用できません。");
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
