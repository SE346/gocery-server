-- CREATE TABLE USER:
CREATE TABLE users (
	mail TEXT NOT NULL PRIMARY KEY,
	password TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	date_of_birth DATE,
	phone_num VARCHAR(10),
	avatar TEXT DEFAULT 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=170667a&w=0&k=20&c=m-F9Doa2ecNYEEjeplkFCmZBlc5tm1pl1F7cBCh9ZzM=',
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