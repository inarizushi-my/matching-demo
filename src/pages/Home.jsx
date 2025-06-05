import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-white relative px-4">
      {/* ハンバーガーメニュー */}
      <div className="absolute top-4 right-4">
        <button className="text-2xl font-bold">☰</button>
      </div>

      {/* 中央のメインコンテンツ */}
      <div className="text-center w-full max-w-md md:max-w-xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-12">音風</h1>

        <div className="flex flex-col gap-6 items-center w-full">
          <Link to="/recruit" className="w-full">
            <button className="w-full max-w-xs mx-auto text-lg md:text-xl bg-blue-500 text-white py-4 rounded hover:bg-blue-600 transition">
              募集一覧
            </button>
          </Link>
          <Link to="/performer" className="w-full">
            <button className="w-full max-w-xs mx-auto text-lg md:text-xl bg-green-500 text-white py-4 rounded hover:bg-green-600 transition">
              人材一覧
            </button>
          </Link>
          <Link to="/entry" className="w-full">
            <button className="w-full max-w-xs mx-auto text-lg md:text-xl bg-purple-500 text-white py-4 rounded hover:bg-purple-600 transition">
              新規登録
            </button>
          </Link>
          <Link to="/matching" className="w-full">
            <button className="w-full max-w-xs mx-auto text-lg md:text-xl bg-yellow-500 text-white py-4 rounded hover:bg-yellow-600 transition">
              マッチング
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
