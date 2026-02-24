Database Tables 

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `phone_number` varchar(16) DEFAULT NULL,
  `email_address` varchar(100) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `profile_img` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `email_address` (`email_address`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci |


CREATE TABLE `friendships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `requester_id` int NOT NULL,
  `addressee_id` int NOT NULL,
  `status` enum('pending','accepted','rejected','blocked') NOT NULL DEFAULT 'pending',
  `blocked_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_low` int GENERATED ALWAYS AS (least(`requester_id`,`addressee_id`)) STORED,
  `user_high` int GENERATED ALWAYS AS (greatest(`requester_id`,`addressee_id`)) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pair` (`user_low`,`user_high`),
  KEY `fk_requester` (`requester_id`),
  KEY `fk_addressee` (`addressee_id`),
  KEY `fk_blocked_by` (`blocked_by`),
  CONSTRAINT `check_not_self` CHECK ((`requester_id` <> `addressee_id`))
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci |

CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token_hash` char(64) NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_hash` (`token_hash`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1711 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci |


CREATE TABLE `location_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int NOT NULL,
  `viewer_id` int NOT NULL,
  `is_allowed` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_permission` (`owner_id`,`viewer_id`),
  KEY `viewer_id` (`viewer_id`),
  CONSTRAINT `location_permissions_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  CONSTRAINT `location_permissions_ibfk_2` FOREIGN KEY (`viewer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci |
