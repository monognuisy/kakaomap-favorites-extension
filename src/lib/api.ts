import axios from 'axios';

// 카카오맵 즐겨찾기 폴더 목록 인터페이스
export interface KakaoMapFolder {
  folderId: number;
  folderType: string;
  mapUserId: string;
  nickname: string;
  profileImage: string;
  profileStatus: string;
  status: string;
  title: string;
  cp?: boolean;
  favoriteCount?: number;
}

// 카카오맵 즐겨찾기 폴더 응답 인터페이스
export interface KakaoMapFolderResponse {
  result: KakaoMapFolder[];
  status: {
    code: string;
    message?: string;
  };
}

// 카카오맵 즐겨찾기 장소 인터페이스
export interface KakaoMapFavorite {
  folderId: number;
  seq: number;
  favoriteType: string;
  color: string;
  memo: string;
  display1: string;
  display2: string;
  x: number;
  y: number;
  lon: number;
  lat: number;
  key: string;
  home: boolean;
  createdAt: string;
  updatedAt: string;
}

// 카카오맵 즐겨찾기 장소 응답 인터페이스
export interface KakaoMapFavoriteResponse {
  result: KakaoMapFavorite[];
  status: {
    code: string;
    message?: string;
  };
}

/**
 * 카카오맵 즐겨찾기 폴더 목록을 가져옵니다.
 * @param sort 정렬 방식 (기본값: CREATE_AT)
 * @returns 폴더 목록 응답
 */
export async function getFavoriteFolders(
  sort: string = 'CREATE_AT',
): Promise<KakaoMapFolderResponse> {
  try {
    const response = await axios.get<KakaoMapFolderResponse>(
      `https://map.kakao.com/folder/list.json?sort=${sort}`,
      {
        withCredentials: true, // 쿠키를 포함하여 요청
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // API 에러 응답 반환
      return error.response.data as KakaoMapFolderResponse;
    }
    // 기본 에러 응답
    return {
      result: [],
      status: {
        code: 'ERROR',
        message:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      },
    };
  }
}

/**
 * 특정 폴더의 즐겨찾기 장소 목록을 가져옵니다.
 * @param folderId 폴더 ID
 * @param type 장소 타입 (기본값: M)
 * @returns 즐겨찾기 장소 목록 응답
 */
export async function getFavoritePlaces(
  folderId: number,
  type: string = 'M',
): Promise<KakaoMapFavoriteResponse> {
  try {
    const response = await axios.get<KakaoMapFavoriteResponse>(
      `https://map.kakao.com/favorite/list.json?folderIds%5B%5D=${folderId}&type=${type}`,
      {
        withCredentials: true, // 쿠키를 포함하여 요청
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // API 에러 응답 반환
      return error.response.data as KakaoMapFavoriteResponse;
    }
    // 기본 에러 응답
    return {
      result: [],
      status: {
        code: 'ERROR',
        message:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      },
    };
  }
}
