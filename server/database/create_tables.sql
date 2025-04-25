CREATE TABLE IF NOT EXISTS media (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email_encrypted VARBINARY(255) NOT NULL,
    email_hash CHAR(64) NOT NULL UNIQUE,
    contact_encrypted VARBINARY(255) NOT NULL,
    contact_hash CHAR(64) NOT NULL UNIQUE,
    user_password VARCHAR(60) NOT NULL,
    is_client BOOLEAN NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    is_female_model_preferred BOOLEAN DEFAULT 0,
    is_dark_theme BOOLEAN NOT NULL DEFAULT 0,
    is_complainter_visible BOOLEAN NOT NULL DEFAULT 1,
    is_rater_visible BOOLEAN NOT NULL DEFAULT 1,
    email_notification_permission BOOLEAN NOT NULL DEFAULT 1,
    device_notification_permission BOOLEAN NOT NULL DEFAULT 1,
    is_english BOOLEAN NOT NULL DEFAULT 0,
    fk_media_ID INT UNIQUE,
    FOREIGN KEY (fk_media_ID) REFERENCES media(ID),
    INDEX idx_name (name),
    INDEX idx_fk_media_ID (fk_media_ID)
);

CREATE TABLE IF NOT EXISTS trainer (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    cref_number CHAR(11) NOT NULL UNIQUE,   
    description TEXT,
    fk_user_ID INT NOT NULL UNIQUE,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    INDEX idx_fk_user_ID (fk_user_ID)
);

CREATE TABLE IF NOT EXISTS rating (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    rating TINYINT NOT NULL,   
    comment VARCHAR(255),
    fk_user_ID INT NOT NULL,
    fk_trainer_ID INT NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (fk_user_ID, fk_trainer_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID),
    INDEX idx_fk_user_ID (fk_user_ID)
);

CREATE TABLE IF NOT EXISTS complaint (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    reason VARCHAR(255),
    fk_user_ID INT NOT NULL,
    fk_trainer_ID INT NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (fk_user_ID, fk_trainer_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID),
    INDEX idx_fk_user_ID (fk_user_ID)
);

CREATE TABLE IF NOT EXISTS muscle_group (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    fk_male_model_media_ID INT NOT NULL UNIQUE,
    fk_female_model_media_ID INT NOT NULL UNIQUE,
    FOREIGN KEY (fk_male_model_media_ID) REFERENCES media(ID),
    FOREIGN KEY (fk_female_model_media_ID) REFERENCES media(ID),
    INDEX idx_fk_male_model_media_ID (fk_male_model_media_ID),
    INDEX idx_fk_female_model_media_ID (fk_female_model_media_ID)
);

CREATE TABLE IF NOT EXISTS exercise (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    alternative_name VARCHAR(50) UNIQUE,
    description VARCHAR(100) NOT NULL UNIQUE,
    fk_media_ID INT NOT NULL UNIQUE,
    FOREIGN KEY (fk_media_ID) REFERENCES media(ID),
    INDEX idx_fk_media_ID (fk_media_ID)
);

CREATE TABLE IF NOT EXISTS exercise_muscle_group (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    is_primary BOOLEAN NOT NULL DEFAULT 1, 
    fk_exercise_ID INT NOT NULL,
    fk_muscle_group_ID INT NOT NULL,
    FOREIGN KEY (fk_exercise_ID) REFERENCES exercise(ID),
    FOREIGN KEY (fk_muscle_group_ID) REFERENCES muscle_group(ID),
    UNIQUE (fk_exercise_ID, fk_muscle_group_ID),
    INDEX idx_fk_exercise_ID (fk_exercise_ID),
    INDEX idx_fk_muscle_group_ID (fk_muscle_group_ID)
);

CREATE TABLE IF NOT EXISTS exercise_location (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS training_technique (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description varchar(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS training_plan (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    note TEXT,
    fk_user_ID INT NOT NULL,
    fk_trainer_ID INT NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (name, fk_user_ID, fk_trainer_ID),
    INDEX idx_fk_user_ID (fk_user_ID),
    INDEX idx_fk_trainer_ID_fk_user_ID (fk_trainer_ID, fk_user_ID)
);

CREATE TABLE IF NOT EXISTS training_day (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    day_order INT NOT NULL, 
    is_rest_day BOOLEAN NOT NULL DEFAULT 0,
    note TEXT,
    fk_plan_ID INT NOT NULL,
    FOREIGN KEY (fk_plan_ID) REFERENCES training_plan(ID),
    INDEX idx_fk_plan_ID (fk_plan_ID)
);

CREATE TABLE IF NOT EXISTS training_day_step (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    order_in_day TINYINT NOT NULL,
    fk_training_day_ID INT NOT NULL,
    FOREIGN KEY (fk_training_day_ID) REFERENCES training_day(ID),
    UNIQUE (order_in_day, fk_training_day_ID),
    INDEX idx_fk_training_day_ID (fk_training_day_ID)
);

CREATE TABLE IF NOT EXISTS step_exercise (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    order_in_step TINYINT NOT NULL,
    note TEXT,
    fk_training_day_step_ID INT NOT NULL,
    fk_exercise_ID INT NOT NULL,
    fk_exercise_location_ID INT NOT NULL,
    FOREIGN KEY (fk_training_day_step_ID) REFERENCES training_day_step(ID),
    FOREIGN KEY (fk_exercise_ID) REFERENCES exercise(ID),
    FOREIGN KEY (fk_exercise_location_ID) REFERENCES exercise_location(ID),
    UNIQUE (order_in_step, fk_training_day_step_ID),
    INDEX idx_fk_training_day_step_ID (fk_training_day_step_ID),
    INDEX idx_fk_exercise_ID (fk_exercise_ID),
    INDEX idx_fk_exercise_location_ID (fk_exercise_location_ID)
);

CREATE TABLE IF NOT EXISTS set_type (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS exercise_set (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    min_reps TINYINT NOT NULL,
    max_reps TINYINT NOT NULL,
    required_rest_seconds SMALLINT NOT NULL,
    order_in_exercise TINYINT NOT NULL,
    fk_step_exercise_ID INT NOT NULL,
    fk_training_technique_ID INT,
    fk_set_type_ID INT NOT NULL,
    FOREIGN KEY (fk_step_exercise_ID) REFERENCES step_exercise(ID),
    FOREIGN KEY (fk_training_technique_ID) REFERENCES training_technique(ID),
    FOREIGN KEY (fk_set_type_ID) REFERENCES set_type(ID),
    UNIQUE (order_in_exercise, fk_step_exercise_ID),
    INDEX idx_fk_step_exercise_ID (fk_step_exercise_ID),
    INDEX idx_fk_training_technique_ID (fk_training_technique_ID),
    INDEX idx_fk_set_type_ID (fk_set_type_ID)
);

CREATE TABLE IF NOT EXISTS cardio_option (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    fk_media_ID INT NOT NULL UNIQUE,
    FOREIGN KEY (fk_media_ID) REFERENCES media(ID),
    INDEX idx_fk_media_ID (fk_media_ID)
);

CREATE TABLE IF NOT EXISTS cardio_intensity (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    intensity VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cardio_session (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    session_time TIME NOT NULL, 
    duration_minutes TINYINT NOT NULL,
    note TEXT, 
    fk_training_day_ID INT NOT NULL, 
    fk_cardio_option_ID INT NOT NULL, 
    fk_cardio_intensity_ID INT NOT NULL,
    FOREIGN KEY (fk_training_day_ID) REFERENCES training_day(ID),
    FOREIGN KEY (fk_cardio_option_ID) REFERENCES cardio_option(ID),
    FOREIGN KEY (fk_cardio_intensity_ID) REFERENCES cardio_intensity(ID),
    INDEX idx_fk_training_day_ID (fk_training_day_ID),
    INDEX idx_fk_cardio_option_ID (fk_cardio_option_ID),
    INDEX idx_fk_cardio_intensity_ID (fk_cardio_intensity_ID)
);

CREATE TABLE IF NOT EXISTS payment_plan (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    full_price DECIMAL(7,2) NOT NULL,
    duration_days SMALLINT NOT NULL,
    description TEXT,
    fk_trainer_ID INT NOT NULL,
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (name, fk_trainer_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID)
);

CREATE TABLE IF NOT EXISTS payment_installment (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    installments_count TINYINT NOT NULL,
    installment_price DECIMAL(7,2) NOT NULL,
    total_price DECIMAL(7,2) GENERATED ALWAYS AS (installments_count * installment_price) STORED,
    fk_payment_plan_ID INT NOT NULL,
    FOREIGN KEY (fk_payment_plan_ID) REFERENCES payment_plan(ID),
    UNIQUE (fk_payment_plan_ID, installments_count, installment_price),
    INDEX idx_fk_payment_plan_ID (fk_payment_plan_ID)
);

CREATE TABLE IF NOT EXISTS payment_method (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS payment_transaction_status (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS payment_transaction (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    amount DECIMAL(7,2) NOT NULL,
    criation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    mercadopago_transaction_ID VARCHAR(100) UNIQUE,
    receipt_url TEXT,
    fk_payment_plan_ID INT NOT NULL,
    fk_payment_method_ID INT NOT NULL,
    fk_payment_transaction_status_ID INT NOT NULL,
    fk_users_ID INT NOT NULL,
    FOREIGN KEY (fk_payment_plan_ID) REFERENCES payment_plan(ID),
    FOREIGN KEY (fk_payment_method_ID) REFERENCES payment_method(ID),
    FOREIGN KEY (fk_payment_transaction_status_ID) REFERENCES payment_transaction_status(ID),
    FOREIGN KEY (fk_users_ID) REFERENCES users(ID),
    INDEX idx_fk_payment_plan_ID (fk_payment_plan_ID),
    INDEX idx_fk_payment_method_ID (fk_payment_method_ID),
    INDEX idx_payment_transaction_status_ID (payment_transaction_status_ID),
    INDEX idx_users_ID (users_ID)
);

CREATE TABLE IF NOT EXISTS payment_plan_benefit (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    benefit_text VARCHAR(100) NOT NULL,
    fk_payment_plan_ID INT NOT NULL,
    FOREIGN KEY (fk_payment_plan_ID) REFERENCES payment_plan(ID),
    UNIQUE (fk_payment_plan_ID, benefit_text),
    INDEX idx_fk_payment_plan_ID (fk_payment_plan_ID)
);

CREATE TABLE IF NOT EXISTS body_composition (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    body_fat_percent DECIMAL(4,2) NOT NULL,
    lean_mass_percent DECIMAL(4,2) NOT NULL, 
    water_percent DECIMAL(4,2) NOT NULL,
    result_date DATE NOT NULL, 
    note TEXT, 
    fk_user_ID INT NOT NULL,
    fk_trainer_ID INT NOT NULL, 
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES users(ID),
    UNIQUE (result_date, fk_user_ID, fk_trainer_ID),
    INDEX idx_fk_user_ID (fk_user_ID),
    INDEX idx_fk_trainer_ID (fk_trainer_ID)
);

CREATE TABLE IF NOT EXISTS exercise_set_log (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    performed_weight_kg DECIMAL(5,2),
    performed_reps TINYINT,
    target_weight_kg DECIMAL(5,2),
    target_reps TINYINT,
    log_date DATE NOT NULL, 
    fk_exercise_set_ID INT NOT NULL, 
    FOREIGN KEY (fk_exercise_set_ID) REFERENCES exercise_set(ID),
    INDEX idx_fk_exercise_set_ID (fk_exercise_set_ID)
);

CREATE TABLE chat (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fk_user_ID INT NOT NULL,
    fk_trainer_ID INT NOT NULL,
    FOREIGN KEY (fk_user_ID) REFERENCES users(ID),
    FOREIGN KEY (fk_trainer_ID) REFERENCES trainer(ID),
    UNIQUE (fk_trainer_ID, fk_user_ID),
    INDEX idx_fk_user_ID_update_date (fk_user_ID, update_date),
    INDEX idx_fk_trainer_ID_fk_user_ID (fk_trainer_ID, fk_user_ID)
);

CREATE TABLE message (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT,
    is_from_trainer BOOLEAN NOT NULL,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_chat_ID INT NOT NULL,
    FOREIGN KEY (fk_chat_ID) REFERENCES chat(ID),
    INDEX idx_chat_ID_creation_date (fk_chat_ID, creation_date)
);
