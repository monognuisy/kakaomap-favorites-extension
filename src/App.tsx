import { FavoriteFolders } from '@/components/FavoriteFolder';

function App() {
  return (
    <>
      <div className="w-full h-full p-4">
        <h1 className="text-2xl font-bold text-center mb-4">
          카카오맵 즐겨찾기 관리자
        </h1>

        <div className="grid grid-cols-1 gap-8">
          <FavoriteFolders />
        </div>
      </div>
    </>
  );
}

export default App;
