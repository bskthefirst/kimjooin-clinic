# Plan: Multi-language Pages + SEO Structured Data

## Context
Two final improvements before deployment:
1. English + Chinese standalone pages for international patients in 서면
2. Structured data (JSON-LD) on each service page + SEO-optimized meta descriptions targeting Busan keywords

---

## Task 1: Multi-language Pages

### Create `/en.html` (English)
- `<html lang="en">`
- Meta description: "Kim Joo-in Internal Medicine Clinic | Busan Seomyeon, 2 min walk from Exit 7. 14 years as professor at Busan Paik Hospital. Respiratory, endoscopy, health checkups."
- Content: clinic name, doctor credentials, services list, address, hours, phone, Naver Map link
- Same green header/footer styling as main site
- Include JSON-LD `MedicalBusiness` schema in English
- Include the JejuMyeongjo font override + favicon

### Create `/cn.html` (Chinese)
- `<html lang="zh">`
- Meta description: "金周仁内科 | 釜山西面站7号出口步行2分钟。釜山白医院14年教授经历。呼吸科、内窥镜、综合体检。"
- Same structure as English page but in Chinese
- Include JSON-LD in Chinese

### Footer link
- Add "EN | 中文" links in the footer of `index.html` and all subpages
- Small, unobtrusive, after the existing footer content

---

## Task 2: Structured Data + SEO Keywords

### Add JSON-LD `MedicalProcedure` to each service page

For each CMS page, add a `<script type="application/ld+json">` before `</head>` with:
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  "name": "[procedure name in Korean]",
  "description": "[one-line description]",
  "procedureType": "https://schema.org/DiagnosticProcedure",
  "bodyLocation": "[relevant body part]",
  "availableService": {
    "@type": "MedicalBusiness",
    "name": "김주인내과",
    "telephone": "051-802-7550",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "서면로 64, 청석빌딩 8층",
      "addressLocality": "부산진구",
      "addressRegion": "부산",
      "addressCountry": "KR"
    }
  }
}
```

### SEO-optimized meta descriptions with Busan keywords

Update meta descriptions to target these search terms:
- 부산 호흡기내과, 부산 내과 추천, 서면 내과 추천, 서면 내과
- 부산 당뇨, 부산 고혈압, 서면 호흡기
- 부산 폐기능검사, 부산 위내시경, 서면 건강검진

Map of pages → keywords:
- `CMS_Srno_39855` (폐기능검사): "부산 폐기능검사, 서면 호흡기내과"
- `CMS_Srno_39856` (알레르기검사): "부산 알레르기검사, 서면 내과"
- `CMS_Srno_39857` (기관지내시경): "부산 기관지내시경, 서면 호흡기내과"
- `CMS_Srno_39858` (위내시경): "부산 위내시경, 서면 위내시경"
- `CMS_Srno_39859` (초음파검사): "부산 초음파검사, 서면 내과"
- `CMS_Srno_39849` (의료진): "부산 내과 추천, 서면 내과 추천"
- `CMS_Srno_39866` (당뇨/고혈압): "부산 당뇨, 부산 고혈압, 서면 내과"
- `CMS_Srno_39867` (종합검진): "부산 건강검진, 서면 건강검진"
- `GuideView` (오시는길): "서면역 내과, 부산진구 내과"
- `index.html`: "부산 호흡기내과, 부산 내과 추천, 서면 내과, 서면 호흡기"

---

## Files Modified
1. `/en.html` — new file (English page)
2. `/cn.html` — new file (Chinese page)
3. All ~40 subpage HTML files — footer EN|中文 link
4. All CMS service HTML files — JSON-LD structured data
5. All HTML files — updated meta descriptions with Busan SEO keywords

## Verification
1. Check `/en.html` and `/cn.html` load at `localhost:8080`
2. Validate JSON-LD with Google Rich Results Test
3. Check meta descriptions contain target keywords
4. Verify footer shows EN | 中文 links
