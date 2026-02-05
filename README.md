# 치지직 후원/구독선물 내역 조회

치지직에서 스트리머별 치즈 후원 내역 및 구독선물 내역을 확인할 수 있습니다.

> 이 프로젝트는 [alsrbxo0428/ChzzkCheeseHistory](https://github.com/alsrbxo0428/ChzzkCheeseHistory)를 포크하여 개선한 버전입니다.

## 포크 후 추가된 기능

### 유저스크립트 버전
- CORS 문제 없이 치지직 사이트 내에서 바로 사용 가능
- 기간 선택 조회 기능 (시작일 ~ 종료일)
- 팬 배지 및 구독선물 배지 아이콘 표시

### Chrome 확장 프로그램 버전
- 별도 설치 없이 확장 프로그램으로 간편하게 사용
- 치지직 사이트 내에서 바로 동작

### UX 개선
- 조회 시 이전 세부내역 영역 자동 초기화

---

## 사용 방법

### 방법 1: 유저스크립트 (권장)

#### 설치 방법
1. [Tampermonkey](https://www.tampermonkey.net/) 확장 프로그램 설치
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/ko/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
2. [스크립트 설치 링크](https://github.com/Jinhwan99/ChzzkCheeseHistory/raw/main/userscript/ChzzkCheeseHistory.user.js) 클릭 → 설치

#### 사용 방법
1. [치지직](https://chzzk.naver.com)에 로그인
2. 화면 우측 하단의 치즈 버튼 클릭
3. 조회 기간 선택 후 "조회" 버튼 클릭

### 방법 2: Chrome 확장 프로그램

#### 설치 방법
1. [extension](./extension) 폴더 다운로드
2. Chrome에서 `chrome://extensions` 접속
3. "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭 → extension 폴더 선택

#### 사용 방법
1. [치지직](https://chzzk.naver.com)에 로그인
2. 화면 우측 하단의 치즈 버튼 클릭
3. 조회 기간 선택 후 "조회" 버튼 클릭

### 방법 3: 웹사이트
https://chzzk-cheese-history.pages.dev

#### 자동 조회 (CORS 확장 프로그램 필요)
- **Chrome**: [Allow CORS](https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf) 또는 [CORS Unblock](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino)
- **Firefox**: [CORS Everywhere](https://addons.mozilla.org/ko/firefox/addon/cors-everywhere/)
- **Edge**: [Allow CORS](https://microsoftedge.microsoft.com/addons/detail/allow-cors-accesscontro/bhjepjpgngghppolkjdhckmnfphffdag)

#### 수동 조회 (확장 프로그램 없이)
1. "조회" 버튼 클릭 → 새 탭에서 API 결과 페이지 열림
2. `Ctrl + A` (전체 선택) → `Ctrl + C` (복사)
3. "직접입력" 버튼 클릭 → 붙여넣기 → 등록

## 오픈소스 라이브러리
- [Chart.js](https://www.chartjs.org/)

## 원본 프로젝트
- [alsrbxo0428/ChzzkCheeseHistory](https://github.com/alsrbxo0428/ChzzkCheeseHistory)
