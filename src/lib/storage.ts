/// <reference types="chrome" />

/**
 * 크롬 확장 프로그램 스토리지에 데이터를 저장합니다.
 * @param key 저장할 데이터의 키
 * @param value 저장할 데이터의 값
 */
export async function saveToStorage<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
}

/**
 * 크롬 확장 프로그램 스토리지에서 데이터를 가져옵니다.
 * @param key 가져올 데이터의 키
 * @param defaultValue 데이터가 없을 경우 반환할 기본값
 * @returns 저장된 데이터 또는 기본값
 */
export async function getFromStorage<T>(
  key: string,
  defaultValue: T,
): Promise<T> {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key] !== undefined ? result[key] : defaultValue);
    });
  });
}

/**
 * 크롬 확장 프로그램 스토리지에서 데이터를 삭제합니다.
 * @param key 삭제할 데이터의 키
 */
export async function removeFromStorage(key: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(key, () => {
      resolve();
    });
  });
}

/**
 * 크롬 확장 프로그램 스토리지의 모든 데이터를 가져옵니다.
 * @returns 모든 저장된 데이터
 */
export async function getAllFromStorage(): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (result) => {
      resolve(result);
    });
  });
}

/**
 * 크롬 확장 프로그램 스토리지의 모든 데이터를 삭제합니다.
 */
export async function clearStorage(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.clear(() => {
      resolve();
    });
  });
}
