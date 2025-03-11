import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getFavoritePlaces, KakaoMapFavorite } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface FavoritePlacesProps {
  folderId: number;
  folderTitle: string;
  onBack: () => void;
}

export function FavoritePlaces({
  folderId,
  folderTitle,
  onBack,
}: FavoritePlacesProps) {
  const [places, setPlaces] = useState<KakaoMapFavorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getFavoritePlaces(folderId);

      if (response.status.code === 'SUCCESS') {
        setPlaces(response.result);
      } else {
        setError(
          response.status.message || '즐겨찾기를 가져오는데 실패했습니다.',
        );
      }
    } catch (err) {
      setError('즐겨찾기를 가져오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  // 컴포넌트가 마운트될 때 즐겨찾기 가져오기
  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // 카카오맵에서 장소 열기
  const openInKakaoMap = (placeKey: string = '') => {
    window.open(`https://place.map.kakao.com/${placeKey}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            뒤로
          </Button>
          <h2 className="text-md font-semibold">
            {folderTitle} 폴더의 즐겨찾기
          </h2>
        </div>
        <Button onClick={fetchPlaces} disabled={loading}>
          {loading ? '로딩 중...' : '새로고침'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {places.map((place) => (
            <Card
              key={place.seq}
              className="overflow-hidden cursor-pointer py-4"
              onClick={() => openInKakaoMap(place.key)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{place.display1}</CardTitle>
                <CardDescription>{place.display2}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {place.memo && (
                  <div className="text-sm bg-gray-50 p-2 rounded-md">
                    <p className="text-md font-medium">메모</p>
                    <p>{place.memo}</p>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  <p>추가: {formatDate(place.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 border rounded-md">
          <p>즐겨찾기가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
