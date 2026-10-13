# SmartOmni — Frontend

SmartOmni hiện có public Landing Page và hai trang placeholder cho đăng nhập/đăng ký. Frontend dùng **React + JavaScript/JSX + Vite**; chưa có Merchant Portal, backend hoặc API contract đã chốt. Dashboard trên Landing Page là **marketing preview** dùng mock data, không phải dữ liệu marketplace thật.

## Cấu trúc thư mục hiện tại

Trong cây dưới đây, ký hiệu `Tên.{jsx,module.css}` đại diện cho hai file cùng tên, ví dụ `Hero.jsx` và `Hero.module.css`. Các file font và tài liệu nội bộ của UI/UX skill được gom theo nhóm; các thư mục con đều được thể hiện.

```text
smart-omni/
├── .agents/
│   └── skills/
│       └── ui-ux/
│           ├── SKILL.md                  # Hướng dẫn UI/UX skill của repository
│           ├── references/               # Quy tắc, token, checklist, design process
│           │   ├── components/           # Mẫu cho button, card, form, chart, v.v.
│           │   └── layouts/              # Mẫu bố cục app, form, overlay, pricing
│           └── scripts/                  # lint-skill.mjs, probe.mjs
├── docs/
│   ├── MASTER_PLAN.md                    # Product/implementation plan
│   ├── SmartOmmi_Nen_Tang_Ban_Le_Da_Kenh.docx
│   ├── SmartOmni_All_Flows_Detailed.docx
│   ├── SmartOmni_Project_Overview.docx
│   ├── SmartOmni_UC_Specification.docx
│   └── SmartOmni_Workflows_Navigation.docx
├── public/
│   └── Radon-Font/
│       └── Radon_font/                   # Radon Bold, Deco, Regular;
│                                         # mỗi kiểu có eot, otf, svg, ttf, woff, woff2
├── src/
│   ├── app/
│   │   ├── router/
│   │   │   └── index.jsx                 # React Router và route definitions
│   │   └── NotFoundPage.{jsx,module.css} # Trang 404
│   ├── features/
│   │   ├── auth/
│   │   │   └── AuthPlaceholder.{jsx,module.css}
│   │   └── landing/
│   │       ├── LandingPage.{jsx,module.css} # Ghép các section của Landing Page
│   │       ├── components/
│   │       │   ├── DashboardPreview.{jsx,module.css} # Dashboard marketing preview
│   │       │   ├── HeroRibbon.{jsx,module.css}       # Dải kính Canvas trong Hero
│   │       │   ├── SectionHeading.{jsx,module.css}   # Tiêu đề section dùng chung
│   │       │   └── TrialButton.{jsx,module.css}      # CTA đăng ký/đăng nhập
│   │       ├── data/
│   │       │   ├── content.js            # Navigation và marketing copy
│   │       │   └── previewData.js        # Dữ liệu marketing Products/Orders/Inventory
│   │       └── sections/
│   │           ├── Header.{jsx,module.css}
│   │           ├── Hero.{jsx,module.css}
│   │           ├── ProblemSolution.{jsx,module.css}
│   │           ├── Features.{jsx,module.css}
│   │           ├── HowItWorks.{jsx,module.css}
│   │           ├── Integrations.{jsx,module.css}
│   │           ├── OfferComparison.{jsx,module.css}
│   │           ├── DashboardShowcase.{jsx,module.css}
│   │           ├── PricingTeaser.{jsx,module.css}
│   │           ├── FinalCTA.{jsx,module.css}
│   │           └── Footer.{jsx,module.css}
│   ├── layouts/
│   │   └── RootLayout.{jsx,module.css}   # Layout route, skip link, page title
│   ├── shared/
│   │   ├── components/
│   │   │   └── Brand.{jsx,module.css}    # Wordmark SmartOmni dùng chung
│   │   ├── lib/
│   │   │   └── utils.js                  # Utility cho class names
│   │   └── ui/
│   │       ├── button.jsx                # shadcn/ui primitive
│   │       ├── dialog.jsx                # shadcn/ui primitive
│   │       └── tabs.jsx                  # shadcn/ui primitive
│   ├── styles/
│   │   └── index.css                     # Tailwind, theme tokens, reset, typography
│   └── main.jsx                          # React entry point
├── tests/
│   └── landing.spec.js                   # Playwright end-to-end tests
├── .gitignore
├── components.json                      # shadcn/ui configuration
├── eslint.config.js
├── index.html
├── jsconfig.json                         # JavaScript path alias
├── package.json
├── package-lock.json
├── playwright.config.js
├── README.md
├── skills-lock.json
└── vite.config.js
```

Ngoài cây mã nguồn trên, workspace có thể có `.git/` (Git metadata), `node_modules/` (dependencies), `dist/` (Vite build output) và `test-results/` (Playwright output). Đây là thư mục hệ thống hoặc sinh tự động, không phải nơi viết feature. `.gitignore` cũng loại trừ `artifacts/` và `playwright-report/` nếu các thư mục đó được tạo trong lúc kiểm thử.

## Vai trò của các lớp chính

- `src/app/` định nghĩa route và trang fallback. Route hiện có: `/`, `/auth/login`, `/auth/register`, và `*` cho 404.
- `src/features/` chứa UI theo feature. `landing/` là giao diện marketing; `auth/` hiện chỉ có placeholder, chưa có luồng xác thực thật.
- `src/shared/ui/` chứa các UI primitive dùng lại; component riêng của trang nằm cạnh CSS Module tương ứng.
- `src/features/landing/data/` chứa marketing copy và dữ liệu preview tĩnh. DashboardPreview đọc trực tiếp dữ liệu feature-local; không cần adapter khi chưa có phép biến đổi dữ liệu.
- `src/styles/index.css` chỉ giữ global reset, theme và typography. Visual effect, layout riêng và animation nằm trong CSS Module của component.
- `docs/` lưu product documents và [MASTER_PLAN.md](docs/MASTER_PLAN.md); `.agents/skills/ui-ux/` là tài liệu/tooling của UI/UX skill, không phải source code chạy trên trình duyệt.

Chưa có `src/services/api/` vì chưa triển khai HTTP API. Khi có API contract được duyệt và feature cần gọi backend, tạo centralized Axios client, endpoint registry và domain API module tại đây; không gọi HTTP trực tiếp từ JSX.

## Chạy và kiểm tra

```sh
npm install
npm run dev
npm run build
npm run lint
npm run test:e2e
```

Dev server chạy tại `http://127.0.0.1:5174/`. Playwright cần cài browser một lần bằng `npx playwright install chromium` trước khi chạy end-to-end tests trên máy mới.
