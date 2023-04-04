
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
insert into category(category_name, category_image) values ('Vegetables', 'https://placehold.co/400x400');
insert into category(category_name, category_image) values ('Fruits', 'https://placehold.co/400x400');
insert into category(category_name, category_image) values ('Meat', 'https://placehold.co/400x400');
insert into category(category_name, category_image) values ('Seafood', 'https://placehold.co/400x400');
insert into category(category_name, category_image) values ('Milk & Egg', 'https://placehold.co/400x400');
insert into category(category_name, category_image) values ('Bread', 'https://placehold.co/400x400');
insert into category(category_name, category_image) values ('Frozen', 'https://placehold.co/400x400');
insert into category(category_name, category_image) values ('Organic', 'https://placehold.co/400x400');