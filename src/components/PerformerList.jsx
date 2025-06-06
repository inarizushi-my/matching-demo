import { useState } from "react";
import { Link } from "react-router-dom";
import data from "../data/sample_performers.json";
import { eventYearMap } from "../data/eventYears";

function PerformerList() {
  const [selectedEvent, setSelectedEvent] = useState("");

  const allEvents = Object.keys(eventYearMap);

  const filteredData =
    selectedEvent === ""
      ? data
      : data.filter((p) => p.event === selectedEvent);

  return (
    <div className="relative min-h-screen p-6 pt-16 max-w-3xl mx-auto">
      {/* ホームに戻るボタン */}
      <div className="absolute top-4 left-4">
        <Link to="/">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ホームに戻る
          </button>
        </Link>
      </div>

      {/* タイトル */}
      <h2 className="text-2xl font-bold mb-6 text-center">演奏者一覧</h2>

      {/* イベント選択 */}
      <div className="mb-4 text-center">
        <label className="mr-2 font-medium">イベント選択：</label>
        <select
          className="border p-2 rounded"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">すべて表示</option>
          {allEvents.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>

      {/* データがない場合 */}
      {filteredData.length === 0 ? (
        <p className="text-center text-gray-600 mt-12 text-lg">
          まだこのイベントには演奏者が登録されていません。
        </p>
      ) : (
        <div className="grid gap-4">
          {filteredData.map((person) => {
            const eventWithYear = `${person.event}${eventYearMap[person.event] ?? ""}`;

            return (
              <div
                key={person.id}
                className="border rounded p-4 shadow bg-white"
              >
                {/* スマホ表示 */}
                <div className="block md:hidden">
                  <Link to={`/performer/${person.id}`}>
                    <h3 className="text-lg font-bold mb-2 text-blue-600 hover:underline">
                      {person.name}
                    </h3>
                  </Link>
                  <div className="flex justify-start items-center gap-x-8">
                    <div className="text-base text-gray-700 flex flex-col gap-y-1">
                      <span>{eventWithYear}</span>
                      <span>{person.generation}代</span>
                      <span>空き：{person.slots ?? 0}曲</span>
                    </div>
                    <button className="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      招待する
                    </button>
                  </div>
                </div>

                {/* PC表示 */}
                <div className="hidden md:flex justify-between items-center">
                  <Link to={`/performer/${person.id}`} className="w-1/5">
                    <h3 className="text-lg font-bold text-blue-600 hover:underline">
                      {person.name}
                    </h3>
                  </Link>
                  <p className="text-base text-gray-700 w-1/5">
                    {eventWithYear}
                  </p>
                  <p className="text-base text-gray-700 w-1/5">
                    {person.generation}代
                  </p>
                  <p className="text-base text-gray-700 w-1/5 text-right">
                    空き：{person.slots ?? 0}曲
                  </p>
                  <div className="w-1/5 text-right">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      招待する
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PerformerList;