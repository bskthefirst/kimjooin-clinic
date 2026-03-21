# 김주인내과 정적 클론 사이트

이 폴더는 원본 `www.o2clinic.com`의 정적 복제본입니다. 
ASP/서버 사이드 의존성을 HTML/CSS/JS 자산으로 정리한 정적 버전이며, 순수 정적 호스팅에서 바로 배포 가능합니다.

## 포함 항목
- `index.html`
- `Module/` 하위 모든 페이지
- `css/`, `BasicJS/`(대문자), `BasicJs/`, `Design/`, `images/`, `external/`
- `assets/clinic-revamp.css`, `assets/clinic-revamp.js`
- `assets/ga4-config.js`, `assets/ga4-global.js`
- `robots.txt`, `sitemap.xml`, `CNAME`

## 바로 미리보기
- `python3 -m http.server 4173` 로 실행 후 `http://localhost:4173/` 접속

## 배포(순수 정적)
- GitHub Pages, Cloudflare Pages, Netlify, Nginx, S3+CloudFront 등 일반 정적 호스팅에 업로드
- 커스텀 도메인 연결 시 문서 루트(`index.html`)가 사이트 루트가 되도록 설정
- GitHub Pages 사용 시:
  - `CNAME` 파일의 도메인을 실제 구매 도메인으로 변경
  - `assets/js/ga4-config.js`의 `G-XXXXXXXXXX`를 실제 GA4 측정 ID로 변경
  - `sitemap.xml`, `robots.txt`의 도메인도 실제 도메인으로 맞춤

## 운영 메모
- 회원 시스템/관리자 서버 코드는 제거되어 100% 정적 사이트로 구성되어 있습니다.
- 영상은 `.mp4`만 사용하도록 정리되어 GitHub Pages에서 바로 재생 가능합니다.

## 정적 유지보수 포인트
- 모든 페이지의 내부 링크는 `.html`로 정규화되어 있습니다.
- 누락된 내부 자산(이미지/JS/CSS)은 크롤링 시 누락되지 않도록 검증 대상에 포함돼야 합니다.
