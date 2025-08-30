DROP TABLE IF EXISTS plan_contract;
DROP TABLE IF EXISTS contract_status;
DROP TABLE IF EXISTS body_composition_exam_send;
DROP TABLE IF EXISTS body_composition_exam;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS exercise_set_log;
DROP TABLE IF EXISTS body_composition;
DROP TABLE IF EXISTS payment_plan_benefit;
DROP TABLE IF EXISTS payment_transaction;
DROP TABLE IF EXISTS payment_plan;
DROP TABLE IF EXISTS cardio_session;
DROP TABLE IF EXISTS cardio_intensity;
DROP TABLE IF EXISTS cardio_option;
DROP TABLE IF EXISTS exercise_set;
DROP TABLE IF EXISTS set_type;
DROP TABLE IF EXISTS step_exercise;
DROP TABLE IF EXISTS training_day_step;
DROP TABLE IF EXISTS training_day;
DROP TABLE IF EXISTS training_technique;
DROP TABLE IF EXISTS laterality;
DROP TABLE IF EXISTS grip_width;
DROP TABLE IF EXISTS grip_type;
DROP TABLE IF EXISTS pulley_attachment;
DROP TABLE IF EXISTS pulley_height;
DROP TABLE IF EXISTS exercise_equipment;
DROP TABLE IF EXISTS body_position;
DROP TABLE IF EXISTS exercise_muscle_group;
DROP TABLE IF EXISTS exercise;
DROP TABLE IF EXISTS muscle_group;
DROP TABLE IF EXISTS complaint_like;
DROP TABLE IF EXISTS complaint;
DROP TABLE IF EXISTS rating_like;
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS trainer_specialty;
DROP TABLE IF EXISTS specialty;
DROP TABLE IF EXISTS save_trainer;
DROP TABLE IF EXISTS trainer;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS training_plan;
DROP TABLE IF EXISTS media;

CREATE TABLE IF NOT EXISTS media (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email_encrypted VARBINARY(255) NOT NULL,
    email_hash CHAR(64) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL,
    is_client BOOLEAN NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    is_dark_theme BOOLEAN NOT NULL DEFAULT 0,
    is_complainter_anonymous BOOLEAN NOT NULL DEFAULT 1,
    is_rater_anonymous BOOLEAN NOT NULL DEFAULT 0,
    email_notification_permission BOOLEAN NOT NULL DEFAULT 1,
    is_english BOOLEAN NOT NULL DEFAULT 0,
    fk_media_ID INT UNSIGNED UNIQUE,
    fk_training_plan_ID INT UNSIGNED,
    FOREIGN KEY (fk_media_ID) REFERENCES media(ID),
    FOREIGN KEY (fk_training_plan_ID) REFERENCES training_plan(ID),
    INDEX idx_name (name),
    INDEX idx_fk_media_ID (fk_media_ID)
    INDEX idx_fk_training_plan_ID (fk_training_plan_ID)
);

CREATE TABLE IF NOT EXISTS trainer (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    cref_number CHAR(11) UNIQUE,   
    description TEXT,
    rate FLOAT UNSIGNED NOT NULL DEFAULT 0.0,
    rates_number INT UNSIGNED NOT NULL DEFAULT 0,  
    contracts_number INT UNSIGNED NOT NULL DEFAULT 0,  
    complaints_number INT UNSIGNED NOT NULL DEFAULT 0, 
    best_price_plan DECIMAL(7,2) UNSIGNED,
    best_value_ratio FLOAT UNSIGNED,
    max_active_contracts TINYINT UNSIGNED NOT NULL DEFAULT 10,
    is_contracts_paused BOOLEAN NOT NULL DEFAULT 0,
    mp_user_id VARCHAR(100),
    mp_access_token VARBINARY(255),
    mp_refresh_token VARBINARY(255),
    mp_token_expiration DATETIME,
    fk_user_ID INT UNSIGNED NOT NULL UNIQUE,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    INDEX idx_fk_user_ID (fk_user_ID)
);

CREATE TABLE IF NOT EXISTS specialty (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS trainer_specialty (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    fk_trainer_ID INT NOT NULL UNSIGNED,
    fk_specialty_ID INT NOT NULL UNSIGNED,
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    FOREIGN KEY (fk_specialty_ID) REFERENCES specialty(ID),
    UNIQUE (fk_trainer_ID, fk_specialty_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID),
    INDEX idx_fk_specialty_ID (fk_specialty_ID)
);

CREATE TABLE IF NOT EXISTS rating (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    rating TINYINT UNSIGNED NOT NULL,   
    comment VARCHAR(255),
    create_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    likes_number INT UNSIGNED NOT NULL DEFAULT 0,
    fk_user_ID INT UNSIGNED,
    fk_trainer_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (fk_user_ID, fk_trainer_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID),
    INDEX idx_fk_user_ID (fk_user_ID)
);

CREATE TABLE IF NOT EXISTS rating_like (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    fk_user_ID INT UNSIGNED,
    fk_rating_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_rating_ID) REFERENCES rating(ID),
    UNIQUE (fk_user_ID, fk_rating_ID),
    INDEX idx_fk_user_ID (fk_user_ID),
    INDEX idx_fk_rating_ID (fk_rating_ID)
);


CREATE TABLE IF NOT EXISTS complaint (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    reason VARCHAR(255),
    create_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    likes_number INT UNSIGNED NOT NULL DEFAULT 0,
    fk_user_ID INT UNSIGNED,
    fk_trainer_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (fk_user_ID, fk_trainer_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID),
    INDEX idx_fk_user_ID (fk_user_ID)
);

CREATE TABLE IF NOT EXISTS complaint_like (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    fk_user_ID INT UNSIGNED,
    fk_complaint_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_complaint_ID) REFERENCES complaint(ID),
    UNIQUE (fk_user_ID, fk_complaint_ID),
    INDEX idx_fk_user_ID (fk_user_ID),
    INDEX idx_fk_complaint_ID (fk_complaint_ID)
);

CREATE TABLE IF NOT EXISTS save_trainer (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    create_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    fk_user_ID INT UNSIGNED NOT NULL,
    fk_trainer_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (fk_user_ID, fk_trainer_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID),
    INDEX idx_fk_user_ID (fk_user_ID)
);

CREATE TABLE IF NOT EXISTS muscle_group (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    fk_male_model_media_ID INT UNSIGNED NOT NULL UNIQUE,
    fk_female_model_media_ID INT UNSIGNED NOT NULL UNIQUE,
    FOREIGN KEY (fk_male_model_media_ID) REFERENCES media(ID),
    FOREIGN KEY (fk_female_model_media_ID) REFERENCES media(ID),
    INDEX idx_fk_male_model_media_ID (fk_male_model_media_ID),
    INDEX idx_fk_female_model_media_ID (fk_female_model_media_ID)
);

CREATE TABLE IF NOT EXISTS exercise (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL UNIQUE,
    is_fixed BOOLEAN NOT NULL,
    fk_media_ID INT UNSIGNED NOT NULL UNIQUE,
    FOREIGN KEY (fk_media_ID) REFERENCES media(ID),
    INDEX idx_fk_media_ID (fk_media_ID)
);

CREATE TABLE IF NOT EXISTS exercise_muscle_group (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    is_primary BOOLEAN NOT NULL DEFAULT 1, 
    fk_exercise_ID INT UNSIGNED NOT NULL,
    fk_muscle_group_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_exercise_ID) REFERENCES exercise(ID),
    FOREIGN KEY (fk_muscle_group_ID) REFERENCES muscle_group(ID),
    UNIQUE (fk_exercise_ID, fk_muscle_group_ID),
    INDEX idx_fk_exercise_ID (fk_exercise_ID),
    INDEX idx_fk_muscle_group_ID (fk_muscle_group_ID)
);

CREATE TABLE IF NOT EXISTS body_position (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS exercise_equipment (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(50) NOT NULL UNIQUE

);

CREATE TABLE IF NOT EXISTS pulley_height (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pulley_attachment (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS grip_type (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS grip_width (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS laterality (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS training_technique (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS training_plan (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    note TEXT,
    fk_trainer_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (name, fk_trainer_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID)
);

CREATE TABLE IF NOT EXISTS training_day (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_in_plan TINYINT UNSIGNED NOT NULL, 
    name VARCHAR(50) NOT NULL,
    is_rest_day BOOLEAN NOT NULL DEFAULT 0,
    note TEXT,
    fk_training_plan_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_training_plan_ID) REFERENCES training_plan(ID),
    INDEX idx_fk_training_plan_ID (fk_training_plan_ID)
);

CREATE TABLE IF NOT EXISTS training_day_step (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_in_day TINYINT UNSIGNED NOT NULL,
    fk_training_day_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_training_day_ID) REFERENCES training_day(ID),
    UNIQUE (order_in_day, fk_training_day_ID),
    INDEX idx_fk_training_day_ID (fk_training_day_ID)
);

CREATE TABLE IF NOT EXISTS step_exercise (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_in_step TINYINT UNSIGNED NOT NULL,
    note TEXT,
    fk_training_day_step_ID INT UNSIGNED NOT NULL,
    fk_exercise_ID INT UNSIGNED NOT NULL,
    fk_exercise_equipment_ID INT UNSIGNED,
    fk_body_position_ID INT UNSIGNED,
    fk_pulley_height_ID INT UNSIGNED,
    fk_pulley_attachment_ID INT UNSIGNED,
    fk_grip_type_ID INT UNSIGNED,
    fk_grip_width_ID INT UNSIGNED,
    fk_laterality_ID INT UNSIGNED,
    FOREIGN KEY (fk_training_day_step_ID) REFERENCES training_day_step(ID),
    FOREIGN KEY (fk_exercise_ID) REFERENCES exercise(ID),
    FOREIGN KEY (fk_exercise_equipment_ID) REFERENCES exercise_equipment(ID),
    FOREIGN KEY (fk_body_position_ID) REFERENCES body_position(ID),
    FOREIGN KEY (fk_pulley_height_ID) REFERENCES pulley_height(ID),
    FOREIGN KEY (fk_pulley_attachment_ID) REFERENCES pulley_attachment(ID),
    FOREIGN KEY (fk_grip_type_ID) REFERENCES grip_type(ID),
    FOREIGN KEY (fk_grip_width_ID) REFERENCES grip_width(ID),    
    FOREIGN KEY (fk_laterality_ID) REFERENCES laterality(ID),
    UNIQUE (order_in_step, fk_training_day_step_ID),
    INDEX idx_fk_training_day_step_ID (fk_training_day_step_ID),
    INDEX idx_fk_exercise_ID (fk_exercise_ID)
);

CREATE TABLE IF NOT EXISTS set_type (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(150) NOT NULL UNIQUE,
    intensity_level TINYINT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS exercise_set (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    min_reps TINYINT UNSIGNED,
    max_reps TINYINT UNSIGNED,
    duration_seconds SMALLINT UNSIGNED,
    required_rest_seconds SMALLINT UNSIGNED NOT NULL,
    order_in_exercise TINYINT UNSIGNED NOT NULL,
    fk_step_exercise_ID INT UNSIGNED NOT NULL,
    fk_set_type_ID INT UNSIGNED NOT NULL,
    fk_training_technique_ID INT UNSIGNED,
    FOREIGN KEY (fk_step_exercise_ID) REFERENCES step_exercise(ID),
    FOREIGN KEY (fk_training_technique_ID) REFERENCES training_technique(ID),
    FOREIGN KEY (fk_set_type_ID) REFERENCES set_type(ID),
    UNIQUE (order_in_exercise, fk_step_exercise_ID),
    INDEX idx_fk_step_exercise_ID (fk_step_exercise_ID),
    INDEX idx_fk_training_technique_ID (fk_training_technique_ID),
    INDEX idx_fk_set_type_ID (fk_set_type_ID)
);

CREATE TABLE IF NOT EXISTS cardio_option (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    fk_media_ID INT UNSIGNED NOT NULL UNIQUE,
    FOREIGN KEY (fk_media_ID) REFERENCES media(ID),
    INDEX idx_fk_media_ID (fk_media_ID)
);

CREATE TABLE IF NOT EXISTS cardio_intensity (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(100) NOT NULL UNIQUE,
    intensity_level TINYINT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS cardio_session (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    session_time TIME, 
    duration_minutes SMALLINT UNSIGNED NOT NULL,
    note TEXT, 
    fk_training_day_ID INT UNSIGNED NOT NULL, 
    fk_cardio_option_ID INT UNSIGNED NOT NULL, 
    fk_cardio_intensity_ID INT UNSIGNED,
    FOREIGN KEY (fk_training_day_ID) REFERENCES training_day(ID),
    FOREIGN KEY (fk_cardio_option_ID) REFERENCES cardio_option(ID),
    FOREIGN KEY (fk_cardio_intensity_ID) REFERENCES cardio_intensity(ID),
    INDEX idx_fk_training_day_ID (fk_training_day_ID),
    INDEX idx_fk_cardio_option_ID (fk_cardio_option_ID),
    INDEX idx_fk_cardio_intensity_ID (fk_cardio_intensity_ID)
);

CREATE TABLE IF NOT EXISTS payment_plan (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    full_price DECIMAL(7,2) UNSIGNED NOT NULL,
    app_fee DECIMAL(6,2) UNSIGNED NOT NULL,
    duration_days SMALLINT UNSIGNED NOT NULL,
    description TEXT,
    fk_trainer_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (name, fk_trainer_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID)
);

CREATE TABLE IF NOT EXISTS payment_transaction (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    amount DECIMAL(7,2) UNSIGNED NOT NULL,
    app_fee = DECIMAL(6,2) UNSIGNED NOT NULL,
    payment_method = VARCHAR(50),
    mp_fee = DECIMAL(6,2) UNSIGNED,
    trainer_received = DECIMAL(7,2) UNSIGNED,
    create_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_finished BOOLEAN NOT NULL DEFAULT 0
    mp_preference_id VARCHAR(100) UNIQUE,
    mp_transaction_id VARCHAR(100) UNIQUE,
    receipt_url TEXT,
    fk_payment_plan_ID INT UNSIGNED,
    fk_user_ID INT UNSIGNED,
    fk_trainer_ID INT UNSIGNED,
    FOREIGN KEY (fk_payment_plan_ID) REFERENCES payment_plan(ID),
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    INDEX idx_fk_payment_plan_ID (fk_payment_plan_ID),
    INDEX idx_fk_user_ID (fk_user_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID)
);

CREATE TABLE IF NOT EXISTS contract_status (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS plan_contract (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    start_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    end_date DATE NOT NULL,
    last_day_full_refund DATE NOT NULL,
    last_day_allowed_refund DATE NOT NULL,
    fk_user_ID INT UNSIGNED,
    fk_trainer_ID INT UNSIGNED,
    fk_payment_plan_ID INT UNSIGNED,
    fk_payment_transaction_ID INT UNSIGNED,
    fk_contract_status_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    FOREIGN KEY (fk_payment_plan_ID) REFERENCES payment_plan(ID),
    FOREIGN KEY (fk_payment_transaction_ID) REFERENCES payment_transaction(ID),
    FOREIGN KEY (fk_contract_status_ID) REFERENCES contract_status(ID),
    INDEX idx_fk_payment_plan_ID (fk_payment_plan_ID),
    INDEX idx_fk_payment_transaction_ID (fk_payment_transaction_ID),
    INDEX idx_fk_user_ID (fk_user_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID)
);

CREATE TABLE IF NOT EXISTS payment_plan_benefit (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(100) NOT NULL,
    fk_payment_plan_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_payment_plan_ID) REFERENCES payment_plan(ID),
    UNIQUE (fk_payment_plan_ID, description),
    INDEX idx_fk_payment_plan_ID (fk_payment_plan_ID)
);

CREATE TABLE IF NOT EXISTS body_composition (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    body_fat_percent DECIMAL(4,2) UNSIGNED NOT NULL,
    lean_mass_percent DECIMAL(4,2) UNSIGNED NOT NULL, 
    water_percent DECIMAL(4,2) UNSIGNED NOT NULL,
    result_date DATE NOT NULL, 
    note TEXT, 
    fk_user_ID INT UNSIGNED NOT NULL,
    fk_trainer_ID INT UNSIGNED, 
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (result_date, fk_user_ID, fk_trainer_ID),
    INDEX idx_fk_user_ID (fk_user_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID)
);

CREATE TABLE IF NOT EXISTS exercise_set_log (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    performed_weight_kg DECIMAL(5,2) UNSIGNED,
    performed_reps TINYINT UNSIGNED,
    target_weight_kg DECIMAL(5,2) UNSIGNED,
    target_reps TINYINT UNSIGNED,
    log_date DATE NOT NULL, 
    fk_exercise_set_ID INT UNSIGNED NOT NULL, 
    fk_user_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_exercise_set_ID) REFERENCES exercise_set(ID),
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    INDEX idx_fk_exercise_set_ID_fk_user_ID (fk_exercise_set_ID, fk_user_ID)
);

CREATE TABLE IF NOT EXISTS chat (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    update_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fk_user_ID INT UNSIGNED,
    fk_trainer_ID INT UNSIGNED,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (fk_trainer_ID, fk_user_ID),
    INDEX idx_fk_user_ID_update_date (fk_user_ID, update_date),
    INDEX idx_fk_trainer_ID_fk_user_ID (fk_trainer_ID, fk_user_ID)
);

CREATE TABLE IF NOT EXISTS message (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    is_from_trainer BOOLEAN NOT NULL,
    is_viewed BOOLEAN NOT NULL,
    create_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fk_chat_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_chat_ID) REFERENCES chat(ID),
    INDEX idx_chat_ID_create_date (fk_chat_ID, create_date)
);

CREATE TABLE IF NOT EXISTS body_composition_exam (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(255) NOT NULL UNIQUE,
    create_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fk_user_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    INDEX idx_fk_user_ID (fk_user_ID)
);

CREATE TABLE IF NOT EXISTS body_composition_exam_send (
    ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    send_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fk_body_composition_exam_ID INT UNSIGNED NOT NULL,
    fk_trainer_ID INT UNSIGNED NOT NULL,
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    FOREIGN KEY (fk_body_composition_exam_ID) REFERENCES body_composition_exam(ID),
    UNIQUE (fk_trainer_ID, fk_body_composition_exam_ID),
    INDEX idx_fk_trainer_ID_fk_body_composition_exam_ID (fk_trainer_ID, fk_body_composition_exam_ID)
);