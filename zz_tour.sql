CREATE TABLE `admin_user` (
  `id` varchar(12) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(45) NOT NULL,
  `pwd_hash` varchar(45) NOT NULL,
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `holiday` (
  `id` int NOT NULL AUTO_INCREMENT,
  `holiday_type` varchar(10) NOT NULL COMMENT 'day(매주 휴일), except(특정일 제외), date(특정일 지정)',
  `holiday_date` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `holiday_type` (`holiday_type`,`holiday_date`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `id_sequence` (
  `id` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '시퀀스 id',
  `no` int NOT NULL COMMENT '시퀀스 no',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tour_reservation` (
  `id` varchar(12) NOT NULL,
  `user_id` varchar(12) NOT NULL,
  `tour_date` date NOT NULL,
  `approval` tinyint NOT NULL DEFAULT '0',
  `cancel` tinyint DEFAULT '0',
  `status_text` varchar(45) DEFAULT NULL COMMENT '예약, 예약 대기, 예약 취소',
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`tour_date`),
  CONSTRAINT `tour_reservation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user` (
  `id` varchar(12) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(45) NOT NULL,
  `pwd_hash` varchar(45) NOT NULL,
  `created_dt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 트리거
CREATE DEFINER=`root`@`localhost` TRIGGER `t_update_tour_reservation` BEFORE UPDATE ON `tour_reservation` FOR EACH ROW BEGIN
    IF NEW.approval = true AND NEW.cancel = false THEN
		SET NEW.status_text = '예약';
    END IF;
    
    IF NEW.cancel = true THEN
		SET NEW.status_text = '예약 취소';
    END IF;
END

-- routines
DELIMITER $$
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_get_seq_12`(p_seq_name VARCHAR(2)) RETURNS varchar(12) CHARSET utf8mb4
BEGIN
    DECLARE RTN_VAL VARCHAR(12);

    INSERT INTO id_sequence (id, no)
    VALUES (p_seq_name, LAST_INSERT_ID(1))
    ON DUPLICATE KEY UPDATE no = IF(LAST_INSERT_ID(no + 1) = 10000, LAST_INSERT_ID(1), LAST_INSERT_ID(no + 1));

    SET RTN_VAL =
            (SELECT CONCAT(p_seq_name, CONCAT(DATE_FORMAT(NOW(), '%y%m%d'), LPAD(LAST_INSERT_ID(), 4, '0'))));

    RETURN RTN_VAL;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` FUNCTION `insert_admin_user`(username_val VARCHAR(20), email_val VARCHAR(45), pwd_hash_val VARCHAR(45)) RETURNS varchar(20) CHARSET utf8mb4
BEGIN
	DECLARE duplicated_user BOOL;
    DECLARE return_val VARCHAR(20);
    
    SELECT IF (id IS NOT NULL, true, false) 
    INTO duplicated_user
    FROM admin_user 
    WHERE username = username_val
    OR email = email_val;
    
    IF duplicated_user = true THEN
		SET return_val = 'DUPLICATED USERNAME';
	ELSE
		SET return_val = fn_get_seq_12('AM');
        
		INSERT INTO admin_user (id, username, email, pwd_hash)
		VALUES (return_val, username_val, email_val, pwd_hash_val);
	END IF;

	RETURN return_val;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` FUNCTION `insert_tour_reservation`(user_id_val VARCHAR(12), tour_date_val DATE, approval_val TINYINT) RETURNS varchar(50) CHARSET utf8mb4
BEGIN
	DECLARE duplicated_reservation BOOL;
    DECLARE return_val VARCHAR(50);
    DECLARE status_text_val VARCHAR(45);
    
    SELECT IF (id IS NOT NULL, true, false) 
    INTO duplicated_reservation
    FROM tour_reservation 
    WHERE user_id = user_id_val
    AND tour_date = tour_date_val;
    
    IF duplicated_reservation = true THEN
		SET return_val = 'DUPLICATED RESERVATION';
	ELSE
		SET return_val = fn_get_seq_12('TR');
        SET status_text_val = IF(approval_val, '예약', '예약 대기');
        
		INSERT INTO tour_reservation (id, user_id, tour_date, approval, status_text)
		VALUES (return_val, user_id_val, tour_date_val, approval_val, status_text_val);
	END IF;

	RETURN return_val;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` FUNCTION `insert_user`(username_val VARCHAR(20), email_val VARCHAR(45), pwd_hash_val VARCHAR(45)) RETURNS varchar(20) CHARSET utf8mb4
BEGIN
	DECLARE duplicated_user BOOL;
    DECLARE return_val VARCHAR(20);
    
    SELECT IF (id IS NOT NULL, true, false) 
    INTO duplicated_user
    FROM user 
    WHERE username = username_val
    OR email = email_val;
    
    IF duplicated_user = true THEN
		SET return_val = 'DUPLICATED USERNAME';
	ELSE
		SET return_val = fn_get_seq_12('US');
        
		INSERT INTO user (id, username, email, pwd_hash)
		VALUES (return_val, username_val, email_val, pwd_hash_val);
	END IF;

	RETURN return_val;
END$$
DELIMITER ;




