import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getFavoriteFolders, KakaoMapFolder } from '@/lib/api';
import { FavoritePlaces } from './FavoritePlaces';

export function FavoriteFolders() {
  const [folders, setFolders] = useState<KakaoMapFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<KakaoMapFolder | null>(
    null,
  );

  const fetchFolders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getFavoriteFolders();

      if (response.status.code === 'SUCCESS') {
        setFolders(response.result);
      } else {
        setError(response.status.message || '폴더를 가져오는데 실패했습니다.');
      }
    } catch (err) {
      setError('폴더를 가져오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 폴더 선택 처리
  const handleSelectFolder = (folder: KakaoMapFolder) => {
    setSelectedFolder(folder);
  };

  // 폴더 목록으로 돌아가기
  const handleBackToFolders = () => {
    setSelectedFolder(null);
  };

  // 선택된 폴더가 있으면 해당 폴더의 즐겨찾기 목록 표시
  if (selectedFolder) {
    return (
      <FavoritePlaces
        folderId={selectedFolder.folderId}
        folderTitle={selectedFolder.title}
        onBack={handleBackToFolders}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold">즐겨찾기 폴더</h2>
        <Button onClick={fetchFolders} disabled={loading}>
          {loading ? '로딩 중...' : '폴더 가져오기'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-1/4 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : folders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <Card key={folder.folderId} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{folder.title}</CardTitle>
                <CardDescription>
                  장소 {folder.favoriteCount || 0}개
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                <p>소유자: {folder.nickname}</p>
                <p>타입: {folder.folderType}</p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleSelectFolder(folder)}
                >
                  폴더 내용 보기
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 border rounded-md">
          <p>폴더가 없거나 로그인이 필요합니다.</p>
          <p className="text-sm mt-2">
            오른쪽 상단의 '폴더 가져오기' 버튼을 클릭하세요.
          </p>
        </div>
      )}
    </div>
  );
}
