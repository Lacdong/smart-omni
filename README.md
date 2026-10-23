# SmartOmni — Frontend

Quy ước màu nút theo yêu cầu UI: hành động chính dùng nền đen/chữ trắng, hover xám đậm; xem/sửa dùng indigo nhạt/chữ indigo; Hủy/Reset dùng xám; Xóa/Thu hồi quyền dùng đỏ nhạt/chữ đỏ. Token màu action/secondary nằm ở `src/styles/index.css`, variant ở `src/shared/ui/button.jsx`; màu thương hiệu và biểu đồ không đổi theo màu action.

SmartOmni có Landing Page, Storefront, luồng đăng ký/onboarding và đăng nhập demo theo role. Merchant Portal có dashboard Owner, Store settings và Team; Staff mở workspace theo quyền đọc sau khi nhận lời mời demo. Frontend dùng **React + JavaScript/JSX + Vite**; chưa kết nối backend. Dữ liệu dashboard và marketplace đều là mock data.

## Đăng nhập demo

Mở `/auth/login`, nhập email của role giả định bên dưới và mật khẩu rồi bấm **Sign in**. Thông tin tài khoản demo chỉ được ghi tại đây; trang đăng nhập không hiển thị phần chọn role. Mật khẩu chung: `Demo@123`.

- Tenant Owner: `owner@smartomni.demo` → `/merchant/dashboard`. Tenant mẫu đã hoàn tất onboarding; xem số liệu, đổi kỳ, lọc và xem chi tiết đơn, xuất báo cáo CSV.
- Tenant Staff: `staff@smartomni.demo` → dashboard khóa trước ACTIVE membership; nhận lời mời demo tại Notifications để mở các phần được Owner cấp quyền đọc. Không mở dashboard tài chính hoặc thiết lập của Owner.
- Super Admin: `admin@smartomni.demo` → `/admin`, dashboard quản trị nền tảng, danh sách/chi tiết tenant, khóa/mở khóa, quản lý gói và lịch sử thao tác.

Phiên demo chỉ lưu ID fixture trong `sessionStorage`, duy trì khi reload và xóa khi đăng xuất. Không lưu mật khẩu hoặc tạo token thật. Route guard chỉ phục vụ bản demo frontend, không thay thế xác thực/phân quyền backend. Tài khoản mẫu ở `src/features/auth/data/demoAccounts.js`; dữ liệu Owner ở `src/features/portal/data/ownerDashboard.js`.

## Owner — Store settings & Team (UC 3.3–3.7, frontend demo)

- `/merchant/settings/profile`: lưu tên, email liên hệ, điện thoại và mô tả cửa hàng; có kiểm tra dữ liệu bắt buộc/email, lưu hoặc bỏ bản nháp. Thông tin đã lưu xuất hiện ở footer storefront mẫu.
- `/merchant/settings/appearance`: headline, announcement, ba palette Neutral/Forest/Navy và khoảng cách catalog Comfortable/Compact. Mở Preview storefront để xem; thay đổi đã lưu đồng bộ giữa các tab cùng trình duyệt.
- `/merchant/settings/policies`: nhập chính sách vận chuyển, đổi trả và riêng tư; storefront hiển thị phần đã có nội dung dưới dạng accordion. Đây là nội dung Owner tự nhập, không phải chính sách mặc định do ứng dụng đưa ra.
- `/merchant/team` (UC 3.7): danh sách staff có số lượng theo trạng thái, tìm theo tên/email/điện thoại/chức danh và lọc trạng thái. Form **Invite a team member** nằm trên danh sách, tạo lời mời với họ tên bắt buộc, email, điện thoại, chức danh, ghi chú nội bộ và quyền đọc đơn/tồn kho. **View details** xem hồ sơ, trạng thái, quyền và thời điểm mời/nhận/cập nhật; **Edit staff** sửa hồ sơ và quyền, có Cancel để bỏ bản nháp. Email sửa được khi INVITED; sau nhận lời mời giữ email định danh. Kiểm tra email trùng và quyền rỗng, không cho mời Owner/Admin.
- Thao tác staff: thu hồi lời mời, tạm khóa/khôi phục hoặc gỡ quyền thành viên; **Delete staff record** xóa hẳn bản ghi khỏi danh sách tenant, kể cả bản ghi đã revoked, và chặn truy cập workspace ngay. Xóa bản ghi không xóa identity đăng nhập độc lập; có thể mời lại sau. Thao tác cắt quyền/xóa có hộp xác nhận, Cancel không đổi dữ liệu; lỗi ghi storage giữ dialog và dữ liệu cũ. Owner chỉ thao tác được khi tenant ACTIVE. Sửa/xóa từ bản mở cũ bị chặn nếu record đã thay đổi ở tab khác, tránh ghi đè hoặc xóa thay đổi mới.
- Kiểm tra nhận lời mời: Owner mời `staff@smartomni.demo`, sau đó đăng nhập Staff ở tab khác, mở Notifications và Accept demo invitation. Workspace Staff chỉ hiện các panel được cấp quyền; thay đổi quyền, tạm khóa/gỡ membership cập nhật ngay cả ở tab Staff đang mở và giữ sau reload. Staff không vào được các route settings/team; tenant bị khóa cũng chặn workspace Staff.

Các màn này giữ style sáng, phẳng và component Button/Dialog của dự án. Store settings dùng tab; Team đặt form invite trực tiếp trên danh sách staff; sửa và xem chi tiết dùng modal. Dữ liệu công khai của storefront lưu riêng tại `smartomni.store-settings-demo.v1`; hồ sơ staff/membership ở `smartomni.team-demo.v1`, không được hiển thị trên storefront. Chỉ hỗ trợ tenant mẫu Everyday Studio; không cấp subdomain. Dữ liệu giữ sau reload/đăng xuất, xóa hai key để reset. Lỗi ghi storage được báo tại form, không báo lưu thành công giả.

UC 3.5/3.7 hiện là luồng mô phỏng: không gửi email thật, không có token hay thời hạn lời mời. Chỉ tài khoản Staff mẫu có thể đăng nhập nhận lời mời; email khác giữ pending. Hạn mức staff/subscription và số staff mẫu trong Admin chưa được nối với danh sách Team này. Phân quyền frontend và browser storage không thay thế backend; chưa có API, database hay xác thực thật. Chưa bổ sung dark mode. Test ở `tests/merchant-settings.spec.js` và `tests/staff-crud.spec.js`.

## Owner — các màn UC còn lại (frontend demo)

Theo yêu cầu triển khai tiếp UC Owner ngày 23/10/2026, các màn mở rộng dưới đây đã có luồng frontend; các dependency backend/AI/billing trong MASTER_PLAN vẫn chưa được triển khai. Menu **BUSINESS WORKSPACE** dẫn tới bảy nhóm; các tab trong mỗi nhóm mở từng màn. Mobile dùng dropdown Workspace page.

- **3.8, 3.15 — `/merchant/subscription`**: xem Free/Pro và hạn mức mẫu theo cấu hình Admin; đổi gói cần xác nhận, có hiệu lực ngay trong demo và cập nhật quyền export/activity của dashboard giữa các tab. Hạ gói giữ dữ liệu, báo vượt số shop và chặn tạo kết nối mới vượt hạn mức. Không tính giá, proration hoặc tạo thanh toán; hạn mức Staff còn độc lập với Team.
- **3.9, 3.10 — `/merchant/invoices`**: xem/lọc invoice mẫu và chi tiết; chỉ invoice PAID có yêu cầu refund, phải có lý do và không gửi trùng cho cùng invoice. Kết quả PENDING_REVIEW được lưu; không phê duyệt, không hoàn tiền.
- **3.12 — `/merchant/payments`**: xem các lần thanh toán thành công/thất bại mẫu; refund request không tự tạo giao dịch hoàn tiền.
- **3.11, 3.13 — `/merchant/shops`**: chọn marketplace, nhập tên shop, preview và xác nhận kết nối riêng; reauthorize shop có sẵn, chặn trùng hoặc vượt hạn mức gói. Không thu credentials, không chạy OAuth hay xác minh quyền sở hữu shop. Dashboard đọc cùng kết nối, kể cả shop mới.
- **3.14 — `/merchant/shop-alerts`**: lọc/xem chi tiết cảnh báo của tenant và lịch sử. Owner reauthorize mô phỏng phục hồi; trạng thái shop/cảnh báo cũng được chiếu sang Admin. Admin reopen mới hơn sẽ trở lại Needs attention ở Owner. Không sửa storage Admin bằng quyền Owner.
- **3.16 — `/merchant/customers`**: xem khách mẫu theo Bronze/Silver/Gold, tìm tên/email, điểm và opt-in; tier/điểm chỉ là dữ liệu mẫu.
- **3.17 — `/merchant/vouchers`**: chọn tier và tỷ lệ giảm giá 1–100%, preview khách đủ điều kiện/bị bỏ qua, rồi xác nhận phát batch. Khách mẫu chưa opt-in bị skip. Mỗi intent preview có ID để tránh phát trùng khi submit lặp.
- **3.18 — `/merchant/voucher-results`**: xem batch và kết quả từng người nhận, mã voucher demo hoặc lý do skip. Không tạo voucher trên sàn hay gửi email/SMS.
- **3.19 — `/merchant/sales-events`**: nhập tên, khoảng ngày và uplift giả định; xem/xóa sự kiện đã lưu. Đây là input scenario do Owner nhập, không phải dự báo của AI.
- **3.20 — `/merchant/forecasts`**: bảng và biểu đồ dự báo minh họa 24–30/10/2026 từ bình quân 7 ngày bán mẫu 17–23/10. Chỉ áp uplift vào ngày event trùng horizon; event trùng nhau dùng mức lớn nhất, không cộng dồn. Hiển thị tồn và shortfall theo đơn vị SKU. Không có model training, confidence interval hay metrics thật.
- **3.23 — `/merchant/costs`**: nhập/sửa/xóa chi phí VND nguyên dương theo ngày và nhóm, lọc ledger; có xác nhận xóa và kiểm tra bản sửa/xóa cũ. Ledger ban đầu gồm ba chi phí mẫu được ghi rõ nguồn.
- **3.24 — `/merchant/profit`**: theo khoảng ngày, doanh thu mẫu trừ các chi phí ghi nhận cùng kỳ; hiển thị breakdown nhóm chi phí và cảnh báo thiếu coverage ngoài 17–23/10/2026. Đây là **demo profit estimate**, chưa phải lợi nhuận thực được kiểm chứng vì chưa có dữ liệu doanh thu/thuế/hoàn hàng thật.
- **3.25 — `/merchant/advisor`**: nhập câu hỏi, chọn prompt và xem lịch sử lưu; câu trả lời là template local về kho/dự báo, chi phí/lợi nhuận, loyalty. Câu ngoài phạm vi có phản hồi rõ; không gọi model hoặc truyền câu hỏi ra ngoài.
- **3.26 — `/merchant/strategy`**: quan sát rule-based từ forecast scenario, số entry chi phí và batch voucher hiện tại, có link tới màn kiểm tra nguồn; không trình bày như AI tư vấn thật.
- **3.27 — `/merchant/logs`**: tìm nhật ký Owner phát sinh từ các luồng mới và thay đổi settings/staff, chuyển Activity/Security và lọc kết quả security. Security chỉ hiển thị event có tenantId demo-tenant; không đưa global Admin hoặc tenant khác vào feed Owner. Event cũ chưa có tenantId không được tự gán tenant.

Workspace data lưu tại `smartomni.owner-workspace-demo.v1`, giữ sau reload/đăng xuất và đồng bộ giữa các tab. Reset key này để bỏ gói đã đổi, shop overrides, batch voucher, sales events, cost edits, hội thoại và audit; ledger quay về ba fixture ban đầu. Chỉ ghi key khi có mutation; đọc dashboard/đăng nhập không khởi tạo dữ liệu ngầm. Lỗi ghi storage báo trên form/dialog và giữ dữ liệu trước đó. Các mutation yêu cầu Owner demo và tenant không SUSPENDED; route Staff/Admin không tải các màn Owner.

UI giữ tông sáng, component Button/Dialog, CSS Modules và token tại `src/styles/index.css`; style nhóm mới tại `src/features/portal/OwnerWorkspace.module.css`. Không thêm dark mode. Kiểm thử mới ở `tests/owner-workspace.spec.js`; dữ liệu mẫu ở `src/features/portal/data/ownerWorkspace.js`.

**Phần chưa hoàn thành đầu cuối:** xác thực thật; đăng ký/cấp subdomain (3.2); API/database/RLS; email/token invitation; marketplace OAuth/sync; payment gateway, tax invoice, pricing/refund policy; loyalty service/voucher delivery; forecasting/AI model và nguồn dữ liệu để tính actual profit. Các màn demo không thay thế những tích hợp này.

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

Reset password được bỏ khỏi phạm vi theo yêu cầu. Chưa có hệ thống monitoring thật, RLS enforcement/thu thập log server, support, AI model history hoặc billing thật (Owner đã có các màn billing demo mô tả ở trên). Font và màu chung giữ ở `src/styles/index.css`; style Admin ở `src/features/platform/Platform.module.css`. Chưa có dark mode.

## Deploy lên Vercel

Repo có `vercel.json` cho Vite: build bằng `npm run build`, output `dist`, rewrite các route SPA về `/index.html` để mở trực tiếp hoặc reload `/auth/login`, `/admin`, `/merchant/dashboard` không bị 404.

Trong Vercel Project Settings, kiểm tra Git repository là `Smart-Omni/SmartOmni_FE` (địa chỉ cũ `Lacdong/smart-omni` hiện chuyển hướng sang repo này), Production Branch là `main`, Root Directory là thư mục chứa `package.json` (repo này là root). Kiểm tra deployment gắn với domain production thực sự dùng commit mới đã push. Push Git thành công không chứng minh deployment đã build thành công hoặc production domain đã trỏ sang deployment đó.

Nếu bấm Sign in còn hiện `Sign-in is not connected yet`, domain đang phục vụ bản đăng nhập placeholder cũ. Deploy commit mới từ đúng repo/branch, kiểm tra Build Logs/Source và trạng thái Ready; nếu dùng Redeploy, chọn deployment có đúng commit mới, không dựng lại một deployment cũ. Khi cần kiểm tra build sạch, tắt lựa chọn dùng lại Build Cache. Bản demo không cần biến môi trường hoặc backend để đăng nhập.

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
