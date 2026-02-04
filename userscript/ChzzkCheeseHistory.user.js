// ==UserScript==
// @name         치지직 후원/구독선물 내역 조회
// @namespace    https://chzzk.naver.com
// @version      1.0.2
// @description  치지직 스트리머 별 후원 내역 및 구독선물 내역을 확인합니다
// @author       alsrbxo0428
// @match        https://chzzk.naver.com/*
// @icon         https://ssl.pstatic.net/static/nng/glive/icon/favicon.png
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Chart.js 동적 로드
    const loadChartJS = () => {
        return new Promise((resolve, reject) => {
            if (typeof Chart !== 'undefined') {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    // ==================== CSS ====================
    const styles = `
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        :host {
            all: initial;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #222;
        }
        .cch-floating-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4e41db 0%, #7c3aed 100%);
            color: white;
            border: none;
            cursor: pointer;
            z-index: 99999;
            box-shadow: 0 4px 15px rgba(78, 65, 219, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .cch-floating-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(78, 65, 219, 0.5);
        }
        .cch-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 100000;
            justify-content: center;
            align-items: center;
        }
        .cch-overlay.show {
            display: flex;
        }
        .cch-main {
            width: 95%;
            max-width: 1400px;
            height: 90vh;
            background: #f1f3f5;
            border-radius: 15px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .cch-header {
            background: #222;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cch-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
            color: white;
        }
        .cch-close-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            padding: 5px 10px;
            line-height: 1;
        }
        .cch-close-btn:hover {
            opacity: 0.8;
        }
        .cch-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        .cch-type-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .cch-type-tab {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
        }
        .cch-type-tab.active {
            background: #4e41db;
            color: white;
        }
        .cch-type-tab:not(.active) {
            background: white;
            color: #4e41db;
            border: 1px solid #4e41db;
        }
        .cch-section {
            display: none;
        }
        .cch-section.active {
            display: block;
        }
        .cch-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .cch-card h4 {
            margin: 0 0 15px 0;
            color: #222;
            font-size: 16px;
            font-weight: bold;
        }
        .cch-form-row {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        .cch-input {
            padding: 10px 14px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            background: white;
            color: #222;
        }
        .cch-input:focus {
            border-color: #4e41db;
            outline: none;
        }
        .cch-select {
            padding: 10px 14px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            background: white;
            color: #222;
            cursor: pointer;
        }
        .cch-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
        }
        .cch-btn-primary {
            background: #4e41db;
            color: white;
        }
        .cch-btn-primary:hover {
            background: #3d32b0;
        }
        .cch-btn-secondary {
            background: rgba(78, 65, 219, 0.15);
            color: #4e41db;
        }
        .cch-btn-secondary:hover {
            background: rgba(78, 65, 219, 0.25);
        }
        .cch-status {
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            font-size: 14px;
        }
        .cch-status.success {
            background: #d4edda;
            color: #155724;
        }
        .cch-status.error {
            background: #f8d7da;
            color: #721c24;
        }
        .cch-status.loading {
            background: #fff3cd;
            color: #856404;
        }
        .cch-total-info {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #222;
        }
        .cch-sort-options {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
        }
        .cch-sort-options label {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            font-size: 14px;
            color: #222;
        }
        .cch-sort-options input[type="radio"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
        }
        .cch-channel-list {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }
        .cch-channel-item {
            background: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 10px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
            width: 170px;
            position: relative;
        }
        .cch-channel-item:hover {
            transform: scale(1.03);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .cch-channel-item .channel-img {
            width: 120px;
            height: 120px;
            border-radius: 10px;
            object-fit: cover;
            display: block;
            margin: 0 auto;
        }
        .cch-channel-item .badge-img {
            width: 30px;
            height: 30px;
            position: absolute;
            top: 15px;
            left: 15px;
        }
        .cch-channel-item p {
            margin: 8px 0 0 0;
            font-size: 13px;
            font-weight: bold;
            color: #222;
        }
        .cch-detail {
            display: none;
        }
        .cch-detail.show {
            display: block;
        }
        .cch-detail-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            gap: 20px;
        }
        .cch-detail-info h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: bold;
            color: #222;
        }
        .cch-detail-info ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .cch-detail-info ul li {
            margin: 5px 0;
            font-size: 14px;
            color: #444;
        }
        .cch-view-tabs {
            display: flex;
            gap: 0;
            margin-bottom: 20px;
        }
        .cch-view-tab {
            padding: 12px 25px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
            font-size: 14px;
            color: #222;
        }
        .cch-view-tab:first-child {
            border-radius: 8px 0 0 8px;
        }
        .cch-view-tab:last-child {
            border-radius: 0 8px 8px 0;
            border-left: none;
        }
        .cch-view-tab.active {
            background: #4e41db;
            color: white;
            border-color: #4e41db;
        }
        .cch-chart-container {
            display: block;
            background: white;
            padding: 15px;
            border-radius: 8px;
        }
        .cch-chart-container.hide {
            display: none;
        }
        .cch-calendar-container {
            display: none;
        }
        .cch-calendar-container.show {
            display: block;
        }
        .cch-calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 10px;
        }
        .cch-calendar-nav {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .cch-calendar-nav button {
            padding: 8px 15px;
            background: #4e41db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
        }
        .cch-calendar-nav h3 {
            margin: 0;
            min-width: 120px;
            text-align: center;
            font-size: 16px;
            color: #222;
        }
        .cch-month-total {
            font-size: 14px;
            color: #333;
            font-weight: bold;
        }
        .cch-calendar-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        .cch-calendar-table th,
        .cch-calendar-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            vertical-align: top;
            min-height: 80px;
            font-size: 13px;
        }
        .cch-calendar-table th {
            background: #f8f9fa;
            font-weight: bold;
            padding: 10px;
        }
        .cch-calendar-table th:first-child {
            color: #e74c3c;
        }
        .cch-calendar-table th:last-child {
            color: #3498db;
        }
        .cch-calendar-table td {
            height: 80px;
        }
        .cch-calendar-table td:first-child .cch-cal-this {
            color: #e74c3c;
        }
        .cch-calendar-table td:last-child .cch-cal-this {
            color: #3498db;
        }
        .cch-cal-this {
            font-weight: bold;
            color: #222;
        }
        .cch-cal-other {
            color: #ccc;
        }
        .cch-cal-today {
            background: #e8f4fd !important;
            border: 2px solid #4e41db !important;
        }
        .cch-cal-day-info {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
            line-height: 1.4;
        }
        .cch-history-badges {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .cch-history-badges img {
            height: 25px;
            cursor: pointer;
        }
        .cch-history-badges button {
            padding: 5px 10px;
            background: #4e41db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        }
        canvas {
            max-width: 100%;
            height: auto !important;
        }
    `;

    // ==================== HTML ====================
    const html = `
        <button class="cch-floating-btn" id="cchFloatingBtn">🧀</button>
        <div class="cch-overlay" id="cchOverlay">
            <div class="cch-main">
                <div class="cch-header">
                    <h3>치지직 후원/구독선물 내역 조회</h3>
                    <button class="cch-close-btn" id="cchCloseBtn">&times;</button>
                </div>
                <div class="cch-content">
                    <div class="cch-type-tabs">
                        <button class="cch-type-tab active" data-type="cheese">치즈 후원 내역</button>
                        <button class="cch-type-tab" data-type="subscription">구독선물 내역</button>
                    </div>

                    <!-- 치즈 후원 섹션 -->
                    <div id="cchCheeseSection" class="cch-section active">
                        <div class="cch-card">
                            <h4>후원 내역 조회</h4>
                            <div class="cch-form-row">
                                <select id="cchCheeseYear" class="cch-select">
                                    <option value="2023">2023년</option>
                                    <option value="2024">2024년</option>
                                    <option value="2025">2025년</option>
                                    <option value="2026" selected>2026년</option>
                                </select>
                                <input type="number" id="cchCheeseSize" class="cch-input" value="10000" placeholder="조회 개수" style="width: 100px;">
                                <button id="cchCheeseFetch" class="cch-btn cch-btn-primary">조회</button>
                            </div>
                            <div id="cchCheeseStatus" class="cch-status" style="display:none;"></div>
                        </div>
                        <div class="cch-card">
                            <div class="cch-total-info" id="cchCheeseTotalInfo">전체 후원 금액 : 0원</div>
                            <div class="cch-sort-options">
                                <label><input type="radio" name="cchCheeseSort" value="total" checked> 후원금액순</label>
                                <label><input type="radio" name="cchCheeseSort" value="name"> 닉네임순</label>
                            </div>
                            <div id="cchCheeseChannelList" class="cch-channel-list"></div>
                        </div>
                        <div id="cchCheeseDetail" class="cch-card cch-detail">
                            <div class="cch-detail-header">
                                <div class="cch-detail-info">
                                    <h3 id="cchCheeseDetailTitle"></h3>
                                    <ul id="cchCheeseDetailYears"></ul>
                                </div>
                                <button id="cchCheeseBack" class="cch-btn cch-btn-secondary">← 목록으로</button>
                            </div>
                            <div class="cch-view-tabs" id="cchCheeseViewTabs">
                                <button class="cch-view-tab active" data-view="graph">그래프</button>
                                <button class="cch-view-tab" data-view="calendar">달력</button>
                            </div>
                            <div id="cchCheeseChartContainer" class="cch-chart-container">
                                <canvas id="cchCheeseChart"></canvas>
                            </div>
                            <div id="cchCheeseCalendarContainer" class="cch-calendar-container">
                                <div class="cch-calendar-header">
                                    <div class="cch-month-total" id="cchCheeseMonthTotal"></div>
                                    <div class="cch-calendar-nav">
                                        <button id="cchCheesePrevMonth">‹</button>
                                        <h3 id="cchCheeseCalendarTitle"></h3>
                                        <button id="cchCheeseNextMonth">›</button>
                                    </div>
                                    <div class="cch-history-badges" id="cchCheeseBadges">
                                        <button id="cchCheeseTodayBtn">TODAY</button>
                                    </div>
                                </div>
                                <table class="cch-calendar-table">
                                    <thead>
                                        <tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr>
                                    </thead>
                                    <tbody id="cchCheeseCalendarBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- 구독선물 섹션 -->
                    <div id="cchSubSection" class="cch-section">
                        <div class="cch-card">
                            <h4>구독선물 내역 조회</h4>
                            <div class="cch-form-row">
                                <input type="number" id="cchSubSize" class="cch-input" value="10000" placeholder="조회 개수" style="width: 100px;">
                                <button id="cchSubFetch" class="cch-btn cch-btn-primary">조회</button>
                            </div>
                            <div id="cchSubStatus" class="cch-status" style="display:none;"></div>
                        </div>
                        <div class="cch-card">
                            <div class="cch-total-info" id="cchSubTotalInfo">구독선물 횟수 : 0회(All) / 0회(1T) / 0회(2T)</div>
                            <div class="cch-sort-options">
                                <label><input type="radio" name="cchSubSort" value="total" checked> 구독횟수순</label>
                                <label><input type="radio" name="cchSubSort" value="name"> 닉네임순</label>
                            </div>
                            <div id="cchSubChannelList" class="cch-channel-list"></div>
                        </div>
                        <div id="cchSubDetail" class="cch-card cch-detail">
                            <div class="cch-detail-header">
                                <div class="cch-detail-info">
                                    <h3 id="cchSubDetailTitle"></h3>
                                    <ul id="cchSubDetailYears"></ul>
                                </div>
                                <button id="cchSubBack" class="cch-btn cch-btn-secondary">← 목록으로</button>
                            </div>
                            <div class="cch-view-tabs" id="cchSubViewTabs">
                                <button class="cch-view-tab active" data-view="graph">그래프</button>
                                <button class="cch-view-tab" data-view="calendar">달력</button>
                            </div>
                            <div id="cchSubChartContainer" class="cch-chart-container">
                                <canvas id="cchSubChart"></canvas>
                            </div>
                            <div id="cchSubCalendarContainer" class="cch-calendar-container">
                                <div class="cch-calendar-header">
                                    <div class="cch-month-total" id="cchSubMonthTotal"></div>
                                    <div class="cch-calendar-nav">
                                        <button id="cchSubPrevMonth">‹</button>
                                        <h3 id="cchSubCalendarTitle"></h3>
                                        <button id="cchSubNextMonth">›</button>
                                    </div>
                                    <div class="cch-history-badges" id="cchSubBadges">
                                        <button id="cchSubTodayBtn">TODAY</button>
                                    </div>
                                </div>
                                <table class="cch-calendar-table">
                                    <thead>
                                        <tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr>
                                    </thead>
                                    <tbody id="cchSubCalendarBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // ==================== Shadow DOM 생성 ====================
    const host = document.createElement('div');
    host.id = 'cch-userscript-root';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    shadow.appendChild(styleEl);

    const container = document.createElement('div');
    container.innerHTML = html;
    shadow.appendChild(container);

    // ==================== State ====================
    const state = {
        cheese: {
            channels: [],
            currentChannel: null,
            calendarYear: new Date().getFullYear(),
            calendarMonth: new Date().getMonth() + 1,
            chart: null
        },
        subscription: {
            channels: [],
            currentChannel: null,
            calendarYear: new Date().getFullYear(),
            calendarMonth: new Date().getMonth() + 1,
            chart: null
        }
    };

    const yearArr = [2023, 2024, 2025, 2026];
    const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Shadow DOM 내부 요소 접근 헬퍼
    const $ = (selector) => shadow.querySelector(selector);
    const $$ = (selector) => shadow.querySelectorAll(selector);

    // ==================== Event Listeners ====================

    // 플로팅 버튼 클릭
    $('#cchFloatingBtn').addEventListener('click', () => {
        $('#cchOverlay').classList.add('show');
    });

    // 닫기 버튼
    $('#cchCloseBtn').addEventListener('click', () => {
        $('#cchOverlay').classList.remove('show');
    });

    // 배경 클릭 시 닫기
    $('#cchOverlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('cch-overlay')) {
            $('#cchOverlay').classList.remove('show');
        }
    });

    // 타입 탭 전환
    $$('.cch-type-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.cch-type-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            $$('.cch-section').forEach(s => s.classList.remove('active'));
            if (tab.dataset.type === 'cheese') {
                $('#cchCheeseSection').classList.add('active');
            } else {
                $('#cchSubSection').classList.add('active');
            }
        });
    });

    // 치즈 후원 조회
    $('#cchCheeseFetch').addEventListener('click', fetchCheeseHistory);

    // 구독선물 조회
    $('#cchSubFetch').addEventListener('click', fetchSubscriptionHistory);

    // 정렬 변경
    $$('input[name="cchCheeseSort"]').forEach(radio => {
        radio.addEventListener('change', () => renderCheeseChannelList());
    });
    $$('input[name="cchSubSort"]').forEach(radio => {
        radio.addEventListener('change', () => renderSubChannelList());
    });

    // 뒤로가기
    $('#cchCheeseBack').addEventListener('click', () => {
        $('#cchCheeseDetail').classList.remove('show');
        state.cheese.currentChannel = null;
    });
    $('#cchSubBack').addEventListener('click', () => {
        $('#cchSubDetail').classList.remove('show');
        state.subscription.currentChannel = null;
    });

    // 뷰 탭 (그래프/달력) - 치즈
    $$('#cchCheeseViewTabs .cch-view-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('#cchCheeseViewTabs .cch-view-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.view === 'graph') {
                $('#cchCheeseChartContainer').classList.remove('hide');
                $('#cchCheeseCalendarContainer').classList.remove('show');
            } else {
                $('#cchCheeseChartContainer').classList.add('hide');
                $('#cchCheeseCalendarContainer').classList.add('show');
                renderCheeseCalendar();
            }
        });
    });

    // 뷰 탭 (그래프/달력) - 구독
    $$('#cchSubViewTabs .cch-view-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('#cchSubViewTabs .cch-view-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.view === 'graph') {
                $('#cchSubChartContainer').classList.remove('hide');
                $('#cchSubCalendarContainer').classList.remove('show');
            } else {
                $('#cchSubChartContainer').classList.add('hide');
                $('#cchSubCalendarContainer').classList.add('show');
                renderSubCalendar();
            }
        });
    });

    // 달력 네비게이션 - 치즈
    $('#cchCheesePrevMonth').addEventListener('click', () => {
        state.cheese.calendarMonth--;
        if (state.cheese.calendarMonth < 1) {
            state.cheese.calendarMonth = 12;
            state.cheese.calendarYear--;
        }
        renderCheeseCalendar();
    });
    $('#cchCheeseNextMonth').addEventListener('click', () => {
        state.cheese.calendarMonth++;
        if (state.cheese.calendarMonth > 12) {
            state.cheese.calendarMonth = 1;
            state.cheese.calendarYear++;
        }
        renderCheeseCalendar();
    });
    $('#cchCheeseTodayBtn').addEventListener('click', () => {
        const today = new Date();
        state.cheese.calendarYear = today.getFullYear();
        state.cheese.calendarMonth = today.getMonth() + 1;
        renderCheeseCalendar();
    });

    // 달력 네비게이션 - 구독
    $('#cchSubPrevMonth').addEventListener('click', () => {
        state.subscription.calendarMonth--;
        if (state.subscription.calendarMonth < 1) {
            state.subscription.calendarMonth = 12;
            state.subscription.calendarYear--;
        }
        renderSubCalendar();
    });
    $('#cchSubNextMonth').addEventListener('click', () => {
        state.subscription.calendarMonth++;
        if (state.subscription.calendarMonth > 12) {
            state.subscription.calendarMonth = 1;
            state.subscription.calendarYear++;
        }
        renderSubCalendar();
    });
    $('#cchSubTodayBtn').addEventListener('click', () => {
        const today = new Date();
        state.subscription.calendarYear = today.getFullYear();
        state.subscription.calendarMonth = today.getMonth() + 1;
        renderSubCalendar();
    });

    // ==================== Functions ====================

    function showStatus(el, type, message) {
        el.style.display = 'block';
        el.className = 'cch-status ' + type;
        el.textContent = message;
    }

    // 치즈 후원 내역 조회
    async function fetchCheeseHistory() {
        const year = $('#cchCheeseYear').value;
        const size = $('#cchCheeseSize').value || 10000;
        const statusEl = $('#cchCheeseStatus');

        showStatus(statusEl, 'loading', '조회 중...');

        try {
            const response = await fetch(
                `https://api.chzzk.naver.com/commercial/v1/product/purchase/history?page=0&size=${size}&searchYear=${year}`,
                { method: 'GET', credentials: 'include' }
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            if (data.code === 200) {
                state.cheese.channels = [];
                convertCheeseData(data.content.data);
                rebuildCheeseChannels();
                renderCheeseChannelList();
                updateCheeseTotalInfo();

                showStatus(statusEl, 'success', `${year}년 후원 내역 ${data.content.data.length}건 조회 완료`);
            } else {
                throw new Error(data.message || '조회 실패');
            }
        } catch (error) {
            showStatus(statusEl, 'error', `오류: ${error.message}`);
        }
    }

    // 구독선물 내역 조회
    async function fetchSubscriptionHistory() {
        const size = $('#cchSubSize').value || 10000;
        const statusEl = $('#cchSubStatus');

        showStatus(statusEl, 'loading', '조회 중...');

        try {
            const response = await fetch(
                `https://api.chzzk.naver.com/commercial/v1/gift/subscription/send-history?page=0&size=${size}`,
                { method: 'GET', credentials: 'include' }
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            if (data.code === 200) {
                state.subscription.channels = [];
                convertSubscriptionData(data.content.data);
                rebuildSubChannels();
                renderSubChannelList();
                updateSubTotalInfo();

                showStatus(statusEl, 'success', `구독선물 내역 ${data.content.data.length}건 조회 완료`);
            } else {
                throw new Error(data.message || '조회 실패');
            }
        } catch (error) {
            showStatus(statusEl, 'error', `오류: ${error.message}`);
        }
    }

    // 치즈 데이터 변환
    function convertCheeseData(dataArr) {
        if (!dataArr) return;

        dataArr.sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate));

        for (const item of dataArr) {
            if (item.donationType === 'TTS') continue;

            const [dateStr] = item.purchaseDate.split(' ');
            const [y, m, d] = dateStr.split('-').map(Number);
            const payAmount = Number(item.payAmount);

            let channel = state.cheese.channels.find(c => c.channelId === item.channelId);
            if (!channel) {
                channel = createCheeseChannel(item);
                state.cheese.channels.push(channel);
            }

            let yearData = channel.yearData.find(yd => yd.year === y);
            if (!yearData) {
                yearData = { year: y, yearTotal: 0, yearCount: 0, monthData: [] };
                channel.yearData.push(yearData);
            }
            yearData.yearTotal += payAmount;
            yearData.yearCount++;

            let monthData = yearData.monthData.find(md => md.month === m);
            if (!monthData) {
                monthData = { month: m, monthTotal: 0, monthCount: 0, dayData: [] };
                yearData.monthData.push(monthData);
            }
            monthData.monthTotal += payAmount;
            monthData.monthCount++;

            let dayData = monthData.dayData.find(dd => dd.day === d);
            if (!dayData) {
                dayData = { day: d, dayTotal: 0, dayCount: 0 };
                monthData.dayData.push(dayData);
            }
            dayData.dayTotal += payAmount;
            dayData.dayCount++;
        }
    }

    // 구독선물 데이터 변환
    function convertSubscriptionData(dataArr) {
        if (!dataArr) return;

        dataArr.sort((a, b) => a.historyDate.localeCompare(b.historyDate));

        for (const item of dataArr) {
            const [dateStr] = item.historyDate.split(' ');
            const [y, m, d] = dateStr.split('-').map(Number);
            const quantity = item.historyQuantity;
            const tier = item.tier;
            const status = item.historyStatus;

            let channel = state.subscription.channels.find(c => c.channelId === item.channelId);
            if (!channel) {
                channel = createSubChannel(item);
                state.subscription.channels.push(channel);
            }

            let yearData = channel.yearData.find(yd => yd.year === y);
            if (!yearData) {
                yearData = { year: y, yearTotal: 0, yearCount1: 0, yearCount2: 0, monthData: [] };
                channel.yearData.push(yearData);
            }

            let monthData = yearData.monthData.find(md => md.month === m);
            if (!monthData) {
                monthData = { month: m, monthTotal: 0, monthCount1: 0, monthCount2: 0, dayData: [] };
                yearData.monthData.push(monthData);
            }

            let dayData = monthData.dayData.find(dd => dd.day === d);
            if (!dayData) {
                dayData = { day: d, dayTotal: 0, dayCount1: 0, dayCount2: 0 };
                monthData.dayData.push(dayData);
            }

            const mult = status === 'COMPLETED' ? 1 : status === 'PARTIAL_REFUND' ? -1 : 0;
            yearData.yearTotal += quantity * mult;
            monthData.monthTotal += quantity * mult;
            dayData.dayTotal += quantity * mult;

            if (tier === 'TIER_1') {
                yearData.yearCount1 += quantity * mult;
                monthData.monthCount1 += quantity * mult;
                dayData.dayCount1 += quantity * mult;
            } else if (tier === 'TIER_2') {
                yearData.yearCount2 += quantity * mult;
                monthData.monthCount2 += quantity * mult;
                dayData.dayCount2 += quantity * mult;
            }
        }
    }

    function createCheeseChannel(item) {
        return {
            channelId: item.channelId,
            channelName: item.channelName,
            channelImageUrl: item.channelImageUrl,
            channelTotal: 0,
            channelCount: 0,
            cheese01: false, cheeseDate01: null,
            cheese02: false, cheeseDate02: null,
            cheese03: false, cheeseDate03: null,
            cheese04: false, cheeseDate04: null,
            firstCheeseDate: null,
            onedayMaxCheese: 0,
            onedayMaxCheeseDate: null,
            yearData: []
        };
    }

    function createSubChannel(item) {
        return {
            channelId: item.channelId,
            channelName: item.channelName,
            channelImageUrl: item.channelImageUrl,
            channelTotal: 0,
            channelCount1: 0,
            channelCount2: 0,
            subscription1: false, subscriptionDate1: null,
            subscription10: false, subscriptionDate10: null,
            subscription50: false, subscriptionDate50: null,
            subscription100: false, subscriptionDate100: null,
            subscription250: false, subscriptionDate250: null,
            subscription500: false, subscriptionDate500: null,
            subscription1000: false, subscriptionDate1000: null,
            yearData: []
        };
    }

    function makeDate(y, m, d) {
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    function rebuildCheeseChannels() {
        state.cheese.channels.sort((a, b) => a.channelName.localeCompare(b.channelName));

        for (const channel of state.cheese.channels) {
            channel.channelTotal = 0;
            channel.channelCount = 0;
            channel.cheese01 = channel.cheese02 = channel.cheese03 = channel.cheese04 = false;
            channel.cheeseDate01 = channel.cheeseDate02 = channel.cheeseDate03 = channel.cheeseDate04 = null;
            channel.firstCheeseDate = null;
            channel.onedayMaxCheese = 0;
            channel.onedayMaxCheeseDate = null;

            channel.yearData.sort((a, b) => a.year - b.year);

            for (const year of yearArr) {
                const yearData = channel.yearData.find(yd => yd.year === year);
                if (!yearData) continue;

                for (const month of monthArr) {
                    const monthData = yearData.monthData.find(md => md.month === month);
                    if (!monthData || !monthData.dayData) continue;

                    for (const dayData of monthData.dayData) {
                        channel.channelTotal += dayData.dayTotal;
                        channel.channelCount += dayData.dayCount;

                        const dateStr = makeDate(year, month, dayData.day);
                        if (!channel.firstCheeseDate) channel.firstCheeseDate = dateStr;

                        if (!channel.cheese01 && channel.channelTotal >= 100000) {
                            channel.cheese01 = true;
                            channel.cheeseDate01 = dateStr;
                        }
                        if (!channel.cheese02 && channel.channelTotal >= 1000000) {
                            channel.cheese02 = true;
                            channel.cheeseDate02 = dateStr;
                        }
                        if (!channel.cheese03 && channel.channelTotal >= 10000000) {
                            channel.cheese03 = true;
                            channel.cheeseDate03 = dateStr;
                        }
                        if (!channel.cheese04 && channel.channelTotal >= 100000000) {
                            channel.cheese04 = true;
                            channel.cheeseDate04 = dateStr;
                        }
                        if (channel.onedayMaxCheese < dayData.dayTotal) {
                            channel.onedayMaxCheese = dayData.dayTotal;
                            channel.onedayMaxCheeseDate = dateStr;
                        }
                    }
                }
            }
        }
    }

    function rebuildSubChannels() {
        state.subscription.channels.sort((a, b) => a.channelName.localeCompare(b.channelName));

        for (const channel of state.subscription.channels) {
            channel.channelTotal = 0;
            channel.channelCount1 = 0;
            channel.channelCount2 = 0;
            channel.subscription1 = channel.subscription10 = channel.subscription50 = false;
            channel.subscription100 = channel.subscription250 = channel.subscription500 = channel.subscription1000 = false;
            channel.subscriptionDate1 = channel.subscriptionDate10 = channel.subscriptionDate50 = null;
            channel.subscriptionDate100 = channel.subscriptionDate250 = channel.subscriptionDate500 = channel.subscriptionDate1000 = null;

            channel.yearData.sort((a, b) => a.year - b.year);

            for (const year of yearArr) {
                const yearData = channel.yearData.find(yd => yd.year === year);
                if (!yearData) continue;

                for (const month of monthArr) {
                    const monthData = yearData.monthData.find(md => md.month === month);
                    if (!monthData || !monthData.dayData) continue;

                    for (const dayData of monthData.dayData) {
                        channel.channelTotal += dayData.dayTotal;
                        channel.channelCount1 += dayData.dayCount1;
                        channel.channelCount2 += dayData.dayCount2;

                        const dateStr = makeDate(year, month, dayData.day);
                        const thresholds = [1, 10, 50, 100, 250, 500, 1000];
                        for (const th of thresholds) {
                            if (!channel[`subscription${th}`] && channel.channelTotal >= th) {
                                channel[`subscription${th}`] = true;
                                channel[`subscriptionDate${th}`] = dateStr;
                            }
                        }
                    }
                }
            }
        }
    }

    function updateCheeseTotalInfo() {
        let total = 0;
        for (const ch of state.cheese.channels) total += ch.channelTotal;
        $('#cchCheeseTotalInfo').textContent = `전체 후원 금액 : ${total.toLocaleString()}원`;
    }

    function updateSubTotalInfo() {
        let total = 0, count1 = 0, count2 = 0;
        for (const ch of state.subscription.channels) {
            total += ch.channelTotal;
            count1 += ch.channelCount1;
            count2 += ch.channelCount2;
        }
        $('#cchSubTotalInfo').textContent = `구독선물 횟수 : ${total}회(All) / ${count1}회(1T) / ${count2}회(2T)`;
    }

    function renderCheeseChannelList() {
        const sortType = $('input[name="cchCheeseSort"]:checked').value;
        let channels = [...state.cheese.channels];
        if (sortType === 'total') {
            channels.sort((a, b) => b.channelTotal - a.channelTotal);
        }

        const container = $('#cchCheeseChannelList');
        container.innerHTML = channels.map(ch => `
            <div class="cch-channel-item" data-id="${ch.channelId}">
                ${ch.cheese04 ? '<img class="badge-img" src="https://ssl.pstatic.net/static/nng/glive/icon/cheese_badge_4.png">' :
                  ch.cheese03 ? '<img class="badge-img" src="https://ssl.pstatic.net/static/nng/glive/icon/cheese_badge_3.png">' :
                  ch.cheese02 ? '<img class="badge-img" src="https://ssl.pstatic.net/static/nng/glive/icon/cheese_badge_2.png">' :
                  ch.cheese01 ? '<img class="badge-img" src="https://ssl.pstatic.net/static/nng/glive/icon/cheese_badge_1.png">' : ''}
                <img class="channel-img" src="${ch.channelImageUrl}" alt="${ch.channelName}">
                <p>${ch.channelName}</p>
                <p>${ch.channelTotal.toLocaleString()}원</p>
            </div>
        `).join('');

        container.querySelectorAll('.cch-channel-item').forEach(item => {
            item.addEventListener('click', () => showCheeseDetail(item.dataset.id));
        });
    }

    function renderSubChannelList() {
        const sortType = $('input[name="cchSubSort"]:checked').value;
        let channels = [...state.subscription.channels];
        if (sortType === 'total') {
            channels.sort((a, b) => b.channelTotal - a.channelTotal);
        }

        const container = $('#cchSubChannelList');
        container.innerHTML = channels.map(ch => `
            <div class="cch-channel-item" data-id="${ch.channelId}">
                <img class="channel-img" src="${ch.channelImageUrl}" alt="${ch.channelName}">
                <p>${ch.channelName}</p>
                <p>총 ${ch.channelTotal}회</p>
            </div>
        `).join('');

        container.querySelectorAll('.cch-channel-item').forEach(item => {
            item.addEventListener('click', () => showSubDetail(item.dataset.id));
        });
    }

    function showCheeseDetail(channelId) {
        const channel = state.cheese.channels.find(c => c.channelId === channelId);
        if (!channel) return;

        state.cheese.currentChannel = channel;
        $('#cchCheeseDetail').classList.add('show');
        $('#cchCheeseDetailTitle').textContent =
            `${channel.channelName} 총 후원 금액 : ${channel.channelTotal.toLocaleString()}원 (${channel.channelCount}회)`;

        const yearsUl = $('#cchCheeseDetailYears');
        yearsUl.innerHTML = channel.yearData.map(yd =>
            `<li>${yd.year}년 : ${yd.yearTotal.toLocaleString()}원 (${yd.yearCount}회)</li>`
        ).join('');

        renderCheeseChart();
        renderCheeseCalendar();
    }

    function showSubDetail(channelId) {
        const channel = state.subscription.channels.find(c => c.channelId === channelId);
        if (!channel) return;

        state.subscription.currentChannel = channel;
        $('#cchSubDetail').classList.add('show');
        $('#cchSubDetailTitle').textContent =
            `${channel.channelName} 구독선물 횟수 : ${channel.channelTotal}회(ALL) / ${channel.channelCount1}회(1T) / ${channel.channelCount2}회(2T)`;

        const yearsUl = $('#cchSubDetailYears');
        yearsUl.innerHTML = channel.yearData.map(yd =>
            `<li>${yd.year}년 : ${yd.yearTotal}회(ALL) / ${yd.yearCount1}회(1T) / ${yd.yearCount2}회(2T)</li>`
        ).join('');

        renderSubChart();
        renderSubCalendar();
    }

    function renderCheeseChart() {
        const channel = state.cheese.currentChannel;
        if (!channel) return;

        const canvas = $('#cchCheeseChart');
        const ctx = canvas.getContext('2d');
        if (state.cheese.chart) state.cheese.chart.destroy();

        const datasets = [];
        for (const yearData of channel.yearData) {
            const monthlyTotals = new Array(12).fill(0);
            for (const md of yearData.monthData) {
                monthlyTotals[md.month - 1] = md.monthTotal;
            }
            datasets.push({
                label: `${yearData.year}년`,
                data: monthlyTotals
            });
        }

        state.cheese.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (item) => `후원 금액: ${Number(item.raw).toLocaleString()}원`
                        }
                    }
                },
                scales: {
                    y: { title: { display: true, text: '후원 금액 (원)' } }
                }
            }
        });
    }

    function renderSubChart() {
        const channel = state.subscription.currentChannel;
        if (!channel) return;

        const canvas = $('#cchSubChart');
        const ctx = canvas.getContext('2d');
        if (state.subscription.chart) state.subscription.chart.destroy();

        const datasets = [];
        for (const yearData of channel.yearData) {
            const monthlyTotals = new Array(12).fill(0);
            for (const md of yearData.monthData) {
                monthlyTotals[md.month - 1] = md.monthTotal;
            }
            datasets.push({
                label: `${yearData.year}년`,
                data: monthlyTotals
            });
        }

        state.subscription.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (item) => `구독선물 횟수: ${item.raw}회`
                        }
                    }
                },
                scales: {
                    y: { title: { display: true, text: '구독선물 횟수' } }
                }
            }
        });
    }

    function renderCheeseCalendar() {
        const channel = state.cheese.currentChannel;
        if (!channel) return;

        const year = state.cheese.calendarYear;
        const month = state.cheese.calendarMonth;

        $('#cchCheeseCalendarTitle').textContent = `${year}년 ${month}월`;

        const yearData = channel.yearData.find(yd => yd.year === year);
        const monthData = yearData?.monthData.find(md => md.month === month);

        $('#cchCheeseMonthTotal').textContent = monthData
            ? `${month}월 후원 금액 : ${monthData.monthTotal.toLocaleString()}원 (${monthData.monthCount}회)`
            : `${month}월 후원 금액 : 0원 (0회)`;

        const calendar = generateCalendarDates(year, month);
        const tbody = $('#cchCheeseCalendarBody');
        tbody.innerHTML = '';

        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;

        for (const week of calendar) {
            const tr = document.createElement('tr');
            for (const cell of week) {
                const td = document.createElement('td');
                if (cell.isCurrentMonth) {
                    td.innerHTML = `<span class="cch-cal-this">${cell.day}</span>`;
                    const dayData = monthData?.dayData.find(dd => dd.day === cell.day);
                    if (dayData) {
                        td.innerHTML += `<div class="cch-cal-day-info">${dayData.dayTotal.toLocaleString()}원<br>(${dayData.dayCount}회)</div>`;
                    }
                    if (isCurrentMonth && cell.day === today.getDate()) {
                        td.classList.add('cch-cal-today');
                    }
                } else {
                    td.innerHTML = `<span class="cch-cal-other">${cell.day}</span>`;
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }

    function renderSubCalendar() {
        const channel = state.subscription.currentChannel;
        if (!channel) return;

        const year = state.subscription.calendarYear;
        const month = state.subscription.calendarMonth;

        $('#cchSubCalendarTitle').textContent = `${year}년 ${month}월`;

        const yearData = channel.yearData.find(yd => yd.year === year);
        const monthData = yearData?.monthData.find(md => md.month === month);

        $('#cchSubMonthTotal').textContent = monthData
            ? `${month}월 구독선물 : ${monthData.monthTotal}회(All) / ${monthData.monthCount1}회(1T) / ${monthData.monthCount2}회(2T)`
            : `${month}월 구독선물 : 0회(All) / 0회(1T) / 0회(2T)`;

        const calendar = generateCalendarDates(year, month);
        const tbody = $('#cchSubCalendarBody');
        tbody.innerHTML = '';

        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;

        for (const week of calendar) {
            const tr = document.createElement('tr');
            for (const cell of week) {
                const td = document.createElement('td');
                if (cell.isCurrentMonth) {
                    td.innerHTML = `<span class="cch-cal-this">${cell.day}</span>`;
                    const dayData = monthData?.dayData.find(dd => dd.day === cell.day);
                    if (dayData) {
                        td.innerHTML += `<div class="cch-cal-day-info">ALL: ${dayData.dayTotal}회<br>1T: ${dayData.dayCount1} / 2T: ${dayData.dayCount2}</div>`;
                    }
                    if (isCurrentMonth && cell.day === today.getDate()) {
                        td.classList.add('cch-cal-today');
                    }
                } else {
                    td.innerHTML = `<span class="cch-cal-other">${cell.day}</span>`;
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }

    function generateCalendarDates(year, month) {
        const firstDay = new Date(year, month - 1, 1).getDay();
        const lastDate = new Date(year, month, 0).getDate();
        const prevLastDate = new Date(year, month - 1, 0).getDate();

        const calendar = [];
        let week = [];
        let day = 1;
        let nextDay = 1;

        for (let i = 0; i < firstDay; i++) {
            week.push({ day: prevLastDate - firstDay + 1 + i, isCurrentMonth: false });
        }

        while (day <= lastDate) {
            week.push({ day, isCurrentMonth: true });
            if (week.length === 7) {
                calendar.push(week);
                week = [];
            }
            day++;
        }

        while (week.length > 0 && week.length < 7) {
            week.push({ day: nextDay++, isCurrentMonth: false });
        }
        if (week.length) calendar.push(week);

        return calendar;
    }

    // 초기화
    loadChartJS().then(() => {
        console.log('[치지직 후원내역] 스크립트 로드 완료');
    }).catch((err) => {
        console.error('[치지직 후원내역] Chart.js 로드 실패:', err);
    });

})();
