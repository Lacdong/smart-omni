# SmartOmni — Frontend

SmartOmni có Landing Page, Storefront, luồng đăng ký/onboarding và đăng nhập demo theo role. Merchant Portal hiện có dashboard Tenant Owner và trang khóa cho Tenant Staff chưa nhận lời mời. Frontend dùng **React + JavaScript/JSX + Vite**; chưa kết nối backend. Dữ liệu dashboard và marketplace đều là mock data.

## Đăng nhập demo

Mở `/auth/login`, nhập email của role giả định bên dưới và mật khẩu rồi bấm **Sign in**. Thông tin tài khoản demo chỉ được ghi tại đây; trang đăng nhập không hiển thị phần chọn role. Mật khẩu chung: `Demo@123`.

- Tenant Owner: `owner@smartomni.demo` → `/merchant/dashboard`. Tenant mẫu đã hoàn tất onboarding; xem số liệu, đổi kỳ, lọc và xem chi tiết đơn, xuất báo cáo CSV.
- Tenant Staff: `staff@smartomni.demo` → dashboard khóa vì chưa có lời mời/membership ACTIVE. Chỉ mở Notifications, Your profile và Sign out; không tải dữ liệu dashboard Owner.
- Super Admin: `admin@smartomni.demo` → `/admin`, dashboard quản trị nền tảng, danh sách/chi tiết tenant, khóa/mở khóa, quản lý gói và lịch sử thao tác.

Phiên demo chỉ lưu ID fixture trong `sessionStorage`, duy trì khi reload và xóa khi đăng xuất. Không lưu mật khẩu hoặc tạo token thật. Route guard chỉ phục vụ bản demo frontend, không thay thế xác thực/phân quyền backend. Tài khoản mẫu ở `src/features/auth/data/demoAccounts.js`; dữ liệu Owner ở `src/features/portal/data/ownerDashboard.js`.

## Super Admin — prototype

- `/admin`: tổng quan từ 8 tenant mẫu, trạng thái, số shop, phân bổ gói và những workspace cần xem lại.
- `/admin/tenants`: tìm theo tên, owner, email, domain; lọc trạng thái/gói. Bộ lọc lưu trong URL. Màn hẹp hiển thị danh sách gọn.
- `/admin/tenants/:tenantId`: thông tin tenant, mức sử dụng, shop, lịch sử thao tác; khóa/mở khóa cần xác nhận và lý do. Tenant đang onboarding không có thao tác đổi quyền này.
- `/admin/plans`: sửa mô tả/hạn mức SKU, shop, Staff; xem trước tenant bị ảnh hưởng và tenant sẽ vượt hạn mức. Free luôn giữ một shop connection. Hạn mức còn lại chỉ là dữ liệu minh họa, chưa phải quy tắc kinh doanh đã chốt. Giảm hạn mức giữ nguyên dữ liệu và hiển thị cảnh báo vượt quota, không xóa dữ liệu hoặc thu phí.
- `/admin/audit`: tìm/lọc lịch sử theo actor, hành động, đối tượng, lý do; xuất kết quả đang lọc ra CSV.
- `/admin/shop-alerts`: danh sách/tìm kiếm/lọc cảnh báo theo marketplace, severity, trạng thái; chi tiết lỗi, shop/tenant, thời gian, số lần và lịch sử xử lý; xuất CSV. Link chi tiết giữ bộ lọc khi đóng.
- `/admin/operations`: cảnh báo webhook, sync job, worker queue và platform API; cùng luồng tiếp nhận/xử lý/mở lại có ghi chú và lịch sử. Đây là mô phỏng incident, không gửi retry/replay thật.
- `/admin/security`: tìm/lọc/xem chi tiết và xuất CSV cho sự kiện bảo mật mẫu cùng sự kiện phát sinh trong bản demo: đăng nhập thành công/thất bại, đăng xuất, truy cập sai portal, thay đổi quyền tenant, hạn mức và tính năng gói.

Trong `/admin/plans`, **Configure Free/Pro features** cấu hình ba tính năng đang có thực: Inventory alerts, Report export và Workspace activity. Các công tắc là bản nháp; **Save features** cần lý do, hiển thị số tenant/thay đổi bị ảnh hưởng và ghi cả Activity log lẫn Security logs. Tab Owner đang mở cập nhật ngay, giữ sau reload. Tắt Inventory alerts sẽ ẩn panel/shortcut/số liệu cảnh báo và bỏ dữ liệu cảnh báo khỏi CSV; tắt Report export sẽ chặn tải báo cáo; tắt Workspace activity sẽ ẩn feed. Danh sách sản phẩm/đơn hàng cốt lõi không thuộc bộ công tắc này. Giá trị mặc định là lựa chọn cho prototype: Free chỉ có Inventory alerts, Pro có cả ba.

Luồng cảnh báo: **Open → Acknowledge alert → Acknowledged → Resolve in demo → Resolved**; có thể xử lý trực tiếp từ Open hoặc **Reopen in demo** để mô phỏng tái phát. Mỗi thao tác cần ghi chú, ghi người/thời gian và nhật ký Admin. Resolve/Reopen cảnh báo shop đồng bộ trạng thái kết nối mẫu trong chi tiết tenant và dashboard Owner; không xác thực OAuth, gọi API sàn, gửi webhook hay chạy job thật. Operational alerts chỉ mô phỏng vòng đời incident.

Dữ liệu Super Admin nằm ở `src/features/platform/`, được lưu trong `localStorage` tại `smartomni.platform-demo.v1`, giữ sau reload/đăng xuất và đồng bộ thay đổi giữa các tab. Xóa key này rồi reload để quay về fixture ban đầu. Không lưu mật khẩu tại đây.

Storage cũ tự bổ sung định nghĩa tính năng và cảnh báo khi đọc, giữ tenant đã khóa, hạn mức và lịch sử có sẵn. Security events phát sinh cục bộ được lưu riêng tại `smartomni.security-demo.v1` (tối đa 300 sự kiện), kèm fixture được ghi rõ nguồn. Chỉ ghi role demo và thông điệp cố định khi xác thực; không ghi email tùy ý người dùng nhập, mật khẩu hay IP. Xóa cả hai key để dọn dữ liệu mock. Browser storage có thể sửa/xóa; các log và kiểm tra quyền frontend không thay thế backend.

Để kiểm thử khóa tenant: đăng nhập Admin, mở Everyday Studio và **Suspend tenant**, nhập lý do. Đăng nhập Owner ở tab khác: dashboard bị chặn; nếu tab Owner đã mở, trạng thái cập nhật ngay. Admin **Reactivate tenant** sẽ mở lại quyền. Profile, Notifications và Sign out vẫn khả dụng khi tenant bị khóa. Admin không thể vào Merchant bằng role nền tảng; Owner/Staff không tải các màn/fixture Admin.

Reset password được bỏ khỏi phạm vi theo yêu cầu. Chưa có hệ thống monitoring thật, RLS enforcement/thu thập log server, support, AI model history hoặc billing. Font và màu chung giữ ở `src/styles/index.css`; style Admin ở `src/features/platform/Platform.module.css`. Chưa có dark mode.

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

