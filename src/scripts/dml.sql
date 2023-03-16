
-- User table
insert into users(mail, password, first_name, last_name, phone_num) values ('20522122@gm.uit.edu.vn', '$2b$10$5c8sOgAuE59yKUpR9vEdCuI.fX..VAY/l/VyeaKunVJzhqc4y0OGS', 'Nguyễn', 'Tuấn', '0967781796');
insert into users(mail, password, first_name, last_name, phone_num) values ('20521366@gm.uit.edu.vn', '$2b$10$5c8sOgAuE59yKUpR9vEdCuI.fX..VAY/l/VyeaKunVJzhqc4y0OGS', 'Mai', 'Hưng', '0967781796');


-- Role table
insert into role(role_name, role_description) values ('Admin',  'Người bán hàng, có thể quản lí sản phẩm, voucher, ...');
insert into role(role_name, role_description) values ('Shopper',  'Người mua hàng');


-- UserToRole table
insert into user_to_role(user_mail, role_id) values ('20522122@gm.uit.edu.vn', 1);
insert into user_to_role(user_mail, role_id) values ('20521366@gm.uit.edu.vn', 2);
