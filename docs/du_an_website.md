# DỰ ÁN PHÁT TRIỂN WEBSITE GIỚI THIỆU SẢN PHẨM

## 1. Mục tiêu & phạm vi

### **Mục tiêu**

-   1 website giới thiệu sản phẩm (landing page chính + một số trang
    con).
-   Có tin tức/blog để đăng bài.
-   Có form Liên hệ:
    -   Lưu lịch sử liên hệ.
    -   Gửi email thông báo.
    -   Gửi tới webhook của bên thứ 3 (tùy chọn).
-   Có phần Admin:
    -   Quản lý bài viết tin tức.
    -   Quản lý nội dung trang (tùy mức độ).
    -   Quản lý liên hệ từ web.
    -   Cấu hình email / webhook.
-   Chuẩn SEO on-page, tốc độ ổn, responsive.

### **Giả định (để estimate)**

-   1 ngôn ngữ (VD: tiếng Việt).
-   Không có giỏ hàng / thanh toán.
-   Thiết kế UI riêng (không dùng template mua sẵn).
-   Admin cơ bản, không phải dạng full CMS.
-   Nếu cần đa ngôn ngữ, phân quyền chi tiết, multi-role → tính thêm.

## 2. Phân tích chức năng theo module

### 2.1. Landing page & các trang public

#### **Các màn hình chính**

-   **Trang chủ / Landing**
    -   Header: banner, headline, CTA.
    -   Giới thiệu ngắn về sản phẩm.
    -   Section "Tính năng nổi bật".
    -   Section "Tin mới" (3--4 bài blog).
    -   Section "Sản phẩm & Dịch vụ" dạng carousel.
    -   Section "Đối tác" dạng carousel.
    -   Section CTA cuối trang.
    -   Footer.
-   **Trang giới thiệu chi tiết sản phẩm**
    -   Mô tả chi tiết.
    -   Hình ảnh / video.
-   **Trang Tin tức / Blog listing**
    -   Danh sách bài viết + pagination.
    -   Filter theo category (nếu có).
-   **Trang chi tiết bài viết**
    -   Title, rich text, ảnh cover.
    -   Meta: ngày đăng, tag, category.
-   **Trang Liên hệ**
    -   Form: Họ tên, Email, SĐT, Nội dung.
    -   Lưu DB, gửi email, gửi webhook.
-   **Trang chính sách**
    -   Chính sách bảo mật / điều khoản.

### 2.2. Phần Admin

-   **Đăng nhập admin**
-   **Quản lý bài viết Blog**
-   **Quản lý Category**
-   **Quản lý Liên hệ**
-   **Cấu hình hệ thống**
-   **Quản lý nội dung Landing (tùy chọn)**

### 2.3. SEO, Performance & Non-functional

#### **SEO On-page**

-   Title, meta description.
-   Sitemap, robots.
-   Schema, OG.

#### **Performance**

-   Tối ưu ảnh, lazyload.
-   Minify CSS/JS.

## 3. Báo giá

TỔNG CHI PHÍ: **31.500.000đ**
