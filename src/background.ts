/// <reference types="chrome" />

/**
 * 카카오맵 API 요청에 Referer 헤더를 추가하기 위한 규칙을 설정합니다.
 * declarativeNetRequest API를 사용하여 Manifest V3에서 동작합니다.
 */

// 확장 프로그램이 설치되거나 업데이트될 때 실행
chrome.runtime.onInstalled.addListener(() => {
  console.log('카카오맵 즐겨찾기 관리자 확장 프로그램이 설치되었습니다.');

  // 동적 규칙 설정
  setupRequestRules();
});

// 요청 규칙 설정 함수
async function setupRequestRules() {
  // 기존 규칙 제거
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2, 3, 4],
  });

  // 새 규칙 추가
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [
            {
              header: 'Referer',
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: 'https://map.kakao.com/',
            },
          ],
        },
        condition: {
          urlFilter: '||map.kakao.com/folder/list.json',
          resourceTypes: [
            chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
          ],
        },
      },
      {
        id: 2,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [
            {
              header: 'Referer',
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: 'https://map.kakao.com/',
            },
          ],
        },
        condition: {
          urlFilter: '||map.kakao.com/favorite/list.json',
          resourceTypes: [
            chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
          ],
        },
      },
      {
        id: 3,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [
            {
              header: 'Origin',
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: 'https://map.kakao.com',
            },
          ],
        },
        condition: {
          urlFilter: '||map.kakao.com/folder/list.json',
          resourceTypes: [
            chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
          ],
        },
      },
      {
        id: 4,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [
            {
              header: 'Origin',
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              value: 'https://map.kakao.com',
            },
          ],
        },
        condition: {
          urlFilter: '||map.kakao.com/favorite/list.json',
          resourceTypes: [
            chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
          ],
        },
      },
    ],
  });

  console.log('요청 헤더 수정 규칙이 설정되었습니다.');
}

// 서비스 워커 활성화 상태 유지
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'ping') {
    sendResponse({ status: 'active' });
  }
  return true;
});
