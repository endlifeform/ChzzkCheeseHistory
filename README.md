# 치지직 후원/구독선물 내역 조회 (Chrome 확장 프로그램)

치지직에서 스트리머별 치즈 후원 내역 및 구독선물 내역을 확인할 수 있는 Chrome 확장 프로그램입니다.

> 이 프로젝트는 [alsrbxo0428/ChzzkCheeseHistory](https://github.com/alsrbxo0428/ChzzkCheeseHistory)를 포크하여 개선한 버전입니다.

## 주요 기능

- 치지직 사이트 내에서 바로 동작
- 기간 선택 조회 (시작일 ~ 종료일)
- 팬 배지 및 구독선물 배지 아이콘 표시
- 조회 시 이전 세부내역 영역 자동 초기화
- 페이지별 플로팅 버튼 표시 설정 (치지직 메인 / 라이브 / 네이버 게임 프로필)

## 설치 방법

1. [extension](./extension) 폴더 다운로드
2. Chrome에서 `chrome://extensions` 접속
3. "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭 → extension 폴더 선택

## 사용 방법

### 후원/구독선물 내역 조회
1. [치지직](https://chzzk.naver.com)에 로그인
2. 화면 우측 하단의 🧀 플로팅 버튼 클릭
3. **치즈 후원 내역**: 시작일/종료일 선택 후 "조회" 클릭
4. **구독선물 내역**: 탭 전환 후 "조회" 클릭
5. 채널 카드를 클릭하면 그래프/달력 형태의 상세 내역 확인 가능

### 플로팅 버튼 설정
1. 확장 프로그램 아이콘 클릭 (팝업 열기)
2. **플로팅 버튼 표시**: 마스터 토글로 전체 ON/OFF
3. **표시할 페이지**: 페이지별로 버튼 표시 여부 선택
   - 치지직 메인 (`chzzk.naver.com`)
   - 치지직 라이브 (`chzzk.naver.com/live/*`)
   - 네이버 게임 프로필 (`game.naver.com/profile*`)

## 오픈소스 라이브러리

- [Chart.js](https://www.chartjs.org/)

## 원본 프로젝트

- [alsrbxo0428/ChzzkCheeseHistory](https://github.com/alsrbxo0428/ChzzkCheeseHistory)
