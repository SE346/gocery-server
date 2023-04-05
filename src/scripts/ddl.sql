-- CREATE TABLE USER:
CREATE TABLE users (
	mail TEXT NOT NULL PRIMARY KEY,
	password TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	date_of_birth DATE,
	phone_num VARCHAR(10),
	avatar TEXT DEFAULT 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=170667a&w=0&k=20&c=m-F9Doa2ecNYEEjeplkFCmZBlc5tm1pl1F7cBCh9ZzM=',
	rank_id INTEGER DEFAULT 1,
	refresh_token TEXT DEFAULT '',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER update_db_timestamp BEFORE UPDATE
ON users
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- CREATE TABLE ROLE:
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER update_db_timestamp BEFORE UPDATE
ON role
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- CREATE TABLE USERTOROLE:
CREATE TABLE user_to_role (
    user_mail TEXT NOT NULL REFERENCES users(mail),
    role_id INTEGER NOT NULL REFERENCES role(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY  KEY (user_mail, role_id)
);
CREATE TRIGGER update_db_timestamp BEFORE UPDATE
ON user_to_role
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- CREATE TABLE RANK:
CREATE TABLE rank (
    rank_id SERIAL PRIMARY KEY,
    rank_name VARCHAR(255) NOT NULL,
    rank_description TEXT,
	next_rank VARCHAR(255),
    transaction_target INTEGER NOT NULL,
	monney_acc_target INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER update_db_timestamp BEFORE UPDATE
ON rank
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- CREATE TABLE USERTORANK:
CREATE TABLE user_to_rank (
    user_mail TEXT NOT NULL REFERENCES users(mail),
    rank_id INTEGER NOT NULL REFERENCES rank(rank_id),
	monney_acc_cur INTEGER DEFAULT 0,
	transaction_cur INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY  KEY (user_mail, rank_id)
);
CREATE TRIGGER update_db_timestamp BEFORE UPDATE
ON user_to_rank
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- CREATE TABLE CATEGORY:
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    category_image TEXT NOT NULL DEFAULT 'https://placehold.co/400x400',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER update_db_timestamp BEFORE UPDATE
ON category
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- CREATE TABLE PRODUCT:
CREATE TABLE product (
    product_id TEXT PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES category(category_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    discount INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER update_db_timestamp BEFORE UPDATE
ON product
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- CREATE TABLE PRODUCTIMG:
CREATE TABLE product_img (
    product_img_id SERIAL PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES product(product_id),
    img_url TEXT NOT NULL DEFAULT 'https://placehold.co/200x200',
    index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER update_db_timestamp BEFORE UPDATE
ON product_img
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();