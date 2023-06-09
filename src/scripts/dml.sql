
-- User table
insert into users(mail, password, first_name, last_name, phone_num) values ('20522122@gm.uit.edu.vn', '$2b$10$5c8sOgAuE59yKUpR9vEdCuI.fX..VAY/l/VyeaKunVJzhqc4y0OGS', 'Nguyễn', 'Tuấn', '0967781796');
insert into users(mail, password, first_name, last_name, phone_num) values ('20521366@gm.uit.edu.vn', '$2b$10$5c8sOgAuE59yKUpR9vEdCuI.fX..VAY/l/VyeaKunVJzhqc4y0OGS', 'Mai', 'Hưng', '0967781796');
insert into users(mail, password, first_name, last_name, phone_num, rank_id) values ('20521760@gm.uit.edu.vn', '$2b$10$5c8sOgAuE59yKUpR9vEdCuI.fX..VAY/l/VyeaKunVJzhqc4y0OGS', 'Hoàng', 'Phúc', '0967781796', 2);


-- Role table
insert into role(role_name, role_description) values ('Admin',  'Người bán hàng, có thể quản lí sản phẩm, voucher, ...');
insert into role(role_name, role_description) values ('Shopper',  'Người mua hàng');

-- Rank table
insert into rank(rank_name, rank_description, next_rank, transaction_target, monney_acc_target) values ('Đồng',  'Mỗi người dùng khi đăng kí đều bắt đầu ở rank đồng', 'Bạc', 2000, 15);
insert into rank(rank_name, rank_description, next_rank, transaction_target, monney_acc_target) values ('Bạc',  'Cần tổng hóa đơn trên 2.000.000vnd hoặc ít nhất 15 giao dịch để có thể đạt được Rank này', 'Vàng', 15000, 100);
insert into rank(rank_name, rank_description, next_rank, transaction_target, monney_acc_target) values ('Vàng',  'Cần tổng hóa đơn trên 15.000.000vnd hoặc ít nhất 100 giao dịch để có thể đạt được Rank này', 'Kim cương', 100000, 1200);
insert into rank(rank_name, rank_description, transaction_target, monney_acc_target) values ('Kim cương', 'Cần tổng hóa đơn trên 100.000.000vnd hoặc ít nhất 1200 giao dịch để có thể đạt được Rank này', 100001, 1201);

-- UserToRole table
insert into user_to_role(user_mail, role_id) values ('20522122@gm.uit.edu.vn', 1);
insert into user_to_role(user_mail, role_id) values ('20521366@gm.uit.edu.vn', 2);

-- UserToRank table
insert into user_to_rank(user_mail, rank_id) values ('20522122@gm.uit.edu.vn', 1);
insert into user_to_rank(user_mail, rank_id) values ('20521366@gm.uit.edu.vn', 1);
insert into user_to_rank(user_mail, rank_id, monney_acc_cur, transaction_cur) values ('20521760@gm.uit.edu.vn', 1, 2100, 12);
insert into user_to_rank(user_mail, rank_id) values ('20521760@gm.uit.edu.vn', 2);

-- Category table
insert into category(category_name, category_image) values ('Vegetables', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dmVnZXRhYmxlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60');
insert into category(category_name, category_image) values ('Fruits', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZnJ1aXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60');
insert into category(category_name, category_image) values ('Meat', 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fG1lYXR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60');
insert into category(category_name, category_image) values ('Seafood', 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1lYXR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60');
insert into category(category_name, category_image) values ('Milk & Egg', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bWlsayUyMGFuZCUyMGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60');
insert into category(category_name, category_image) values ('Bread', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGJyZWFkfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60');
insert into category(category_name, category_image) values ('Frozen', 'https://images.unsplash.com/photo-1578323851363-cf6a1a6afbb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8aWNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60');
insert into category(category_name, category_image) values ('Organic', 'https://images.unsplash.com/photo-1553787434-45e1d245bfbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8b3JnYW5pY3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60');

-- Product table
insert into product(product_id, category_id, name, quantity, description, price, discount, unit) values ('acf02774-0617-11ee-be56-0242ac120002', 1, 'Xà lách búp mỡ thuỷ canh từ 200g', 10, '', 17, 29, 'pack');
insert into product(product_id, category_id, name, quantity, description, price, discount, unit) values ('d390e7b0-0617-11ee-be56-0242ac120002', 1, 'Rau má đất 150g', 5, '', 15, 0, 'pack');
insert into product(product_id, category_id, name, quantity, description, price, discount, unit) values ('de4d84ba-0617-11ee-be56-0242ac120002', 2, 'Đùi bò nhập khẩu đông lạnh 500gr', 7, '', 109, 15, 'pack');


-- ProductImg table
insert into product_img(product_id, img_url, index) values ('acf02774-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/8820/303267/bhx/xa-lach-bup-mo-thuy-canh-cay-tu-230g-202302251513359670.jpg', 1);
insert into product_img(product_id, img_url, index) values ('acf02774-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/8820/303267/bhx/xa-lach-bup-mo-thuy-canh-cay-tu-230g-202303170837370210.jpg', 2);
insert into product_img(product_id, img_url, index) values ('acf02774-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/8820/303267/bhx/xa-lach-bup-mo-thuy-canh-cay-tu-230g-202303170837374315.jpg', 3);
insert into product_img(product_id, img_url, index) values ('acf02774-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/8820/303267/bhx/xa-lach-bup-mo-thuy-canh-cay-tu-230g-202303170837377272.jpg', 4);

insert into product_img(product_id, img_url, index) values ('d390e7b0-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/12439/303371/bhx/rau-ma-dat-toan-phat-khay-150g-202303021541352775.jpg', 1);
insert into product_img(product_id, img_url, index) values ('d390e7b0-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/12439/303371/bhx/rau-ma-dat-toan-phat-khay-150g-202303021536577501.jpg', 2);
insert into product_img(product_id, img_url, index) values ('d390e7b0-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/12439/303371/bhx/rau-ma-dat-toan-phat-khay-150g-202303021536565210.jpg', 3);
insert into product_img(product_id, img_url, index) values ('d390e7b0-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/12439/303371/bhx/rau-ma-dat-toan-phat-khay-150g-202303021536580923.jpg', 4);

insert into product_img(product_id, img_url, index) values ('de4d84ba-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/8139/297313/bhx/dui-bo-nhap-khau-dong-lanh-500gr-202303170948379636.jpg', 1);
insert into product_img(product_id, img_url, index) values ('de4d84ba-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/8139/297313/bhx/dui-bo-nhap-khau-dong-lanh-tui-500g-202212200908085639.jpg', 2);
insert into product_img(product_id, img_url, index) values ('de4d84ba-0617-11ee-be56-0242ac120002', 'https://cdn.tgdd.vn/Products/Images/8139/297313/bhx/dui-bo-nhap-khau-dong-lanh-tui-500g-202212200908088636.jpg',3);


-- Cart table
insert into cart(product_id, user_mail, quantity) values ('acf02774-0617-11ee-be56-0242ac120002', '20521366@gm.uit.edu.vn', 1);
insert into cart(product_id, user_mail, quantity) values ('d390e7b0-0617-11ee-be56-0242ac120002', '20521366@gm.uit.edu.vn', 2);

-- Comment table
insert into comment(product_id, user_mail, content, rating, image) values ('acf02774-0617-11ee-be56-0242ac120002', '20521366@gm.uit.edu.vn', 'Perfect', 4, 'https://cdn.tgdd.vn/Products/Images/8139/297313/bhx/dui-bo-nhap-khau-dong-lanh-tui-500g-202212200908088636.jpg');
insert into comment(product_id, user_mail, content, rating, image) values ('d390e7b0-0617-11ee-be56-0242ac120002', '20521366@gm.uit.edu.vn', 'Good', 5, null);

-- Address table
insert into address(user_mail, name, province_id, province_name, district_id, district_name, ward_code, ward_name, detail, phone_num) values ('20521366@gm.uit.edu.vn', 'Chị Hưng', 262, 'Tỉnh Bình Định', 1662, 'Thành phố Quy Nhơn', '370115', 'Phường Trần Phú', '41.C Nguyễn Lạc', '0967781796');
insert into address(user_mail, name, province_id, province_name, district_id, district_name, ward_code, ward_name, detail, phone_num) values ('20521366@gm.uit.edu.vn', 'Bố Hưng', 269, 'Tỉnh Lào Cai', 2264, 'Huyện Si Ma Cai', '90816', 'Thị Trấn Si Ma Cai', '76 Hoàng Văn Tèo', '0967781796');

-- Coupon table
insert into coupon(from_date, end_date, coupon_type, discount, price_point_accept, quantity, description, thumbnail) values ('2023-06-02', '2023-07-03', 'DiscountPercent', 10, 500, 2, 'Giảm 10% hóa đơn từ 500$', 'https://placehold.co/400x400');
insert into coupon(from_date, end_date, coupon_type, discount, price_point_accept, quantity, description, thumbnail) values ('2023-06-02', '2023-07-03', 'DiscountValue', 20, 300, 1, 'Giảm 20$ cho hóa đơn từ 300$', 'https://placehold.co/400x400');
insert into coupon(from_date, end_date, coupon_type, price_point_accept, quantity, description, thumbnail) values ('2023-06-02', '2023-07-03', 'Freeship', 120, 1, 'Freeship cho hóa đơn từ 500$', 'https://placehold.co/400x400');

-- CouponItem table
insert into coupon_item(coupon_id, code, is_active) values (1, 's23cxak0zq', true);
insert into coupon_item(coupon_id, code, is_active) values (1, '84u38Xvj8Z', true);
insert into coupon_item(coupon_id, code, is_active) values (2, 'ksdhf8AxjA', true);
insert into coupon_item(coupon_id, code, is_active) values (2, 'skj87a6ZVV', true);
insert into coupon_item(coupon_id, code, is_active) values (3, 'jkAv73Ac91', true);

-- Order table
insert into "order" (order_id, user_mail, address_id, status, total, order_date, delivery_date, shipping_fee, phone_num, payment_method) values ('0a9d302e-fcf4-11ed-a641-005056c00001', '20521366@gm.uit.edu.vn', 1, 'In Progress', 123.45, '2023-05-01', '2023-05-05', 20, '0967781796', 'Momo');
insert into "order" (order_id, user_mail, address_id, status, total, order_date, delivery_date, shipping_fee, phone_num, payment_method) values ('bd70d908-fcf4-11ed-a642-005056c00001', '20521366@gm.uit.edu.vn', 2, 'Finished', 356.57, '2023-04-17', '2023-04-19', 5, '0967781796', 'Zalopay');
insert into "order" (order_id, user_mail, address_id, status, total, order_date, delivery_date, shipping_fee, phone_num, payment_method) values ('c27062d4-fcf4-11ed-a643-005056c00001', '20521366@gm.uit.edu.vn', 1, 'In Progress', 168.89, '2023-04-20', '2023-04-22', 7, '0967781796', 'Credit');
insert into "order" (order_id, user_mail, address_id, status, total, order_date, delivery_date, shipping_fee, phone_num, payment_method) values ('cc800770-fcf4-11ed-a644-005056c00001', '20521366@gm.uit.edu.vn', 1, 'Cancelled', 116.56, '2023-01-20', '2023-01-23', 5, '0967781796', 'Cash');

-- OrderDetail table
insert into order_detail(order_id, product_id, quantity, price) values ('0a9d302e-fcf4-11ed-a641-005056c00001', 'acf02774-0617-11ee-be56-0242ac120002', 1, 123.45);
insert into order_detail(order_id, product_id, quantity, price) values ('bd70d908-fcf4-11ed-a642-005056c00001', 'acf02774-0617-11ee-be56-0242ac120002', 1, 123.45);
insert into order_detail(order_id, product_id, quantity, price) values ('bd70d908-fcf4-11ed-a642-005056c00001', 'd390e7b0-0617-11ee-be56-0242ac120002', 2, 233.12);
insert into order_detail(order_id, product_id, quantity, price) values ('c27062d4-fcf4-11ed-a643-005056c00001', 'acf02774-0617-11ee-be56-0242ac120002', 1, 123.45);
insert into order_detail(order_id, product_id, quantity, price) values ('c27062d4-fcf4-11ed-a643-005056c00001', 'de4d84ba-0617-11ee-be56-0242ac120002', 1, 45.44);
insert into order_detail(order_id, product_id, quantity, price) values ('cc800770-fcf4-11ed-a644-005056c00001', 'd390e7b0-0617-11ee-be56-0242ac120002', 1, 116.56);
