CREATE TABLE IF NOT EXISTS `code_directory` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(20)  NOT NULL,
  `name` varchar(255)  NOT NULL,
  `parent_id` varchar(36) DEFAULT '',
  `full_path` varchar(256)  DEFAULT NULL,
  `level` smallint DEFAULT '0',
  `sort_order` int DEFAULT '0',
  `icon` varchar(100)  DEFAULT NULL,
  `description` text ,
  `is_visible` tinyint(1) DEFAULT '1',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ptye` smallint DEFAULT '0',
  `project_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_project_parent_name` (`user_id`,`project_id`,`full_path`),
  KEY `idx_parent_visible` (`user_id`,`project_id`,`is_deleted`,`is_visible`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(191) DEFAULT NULL,
  `password` longtext NOT NULL,
  `display_name` varchar(191) DEFAULT NULL,
  `role` bigint DEFAULT '1',
  `status` bigint DEFAULT '1',
  `email` varchar(191) DEFAULT NULL,
  `github_id` varchar(191) DEFAULT NULL,
  `wechat_id` varchar(191) DEFAULT NULL,
  `lark_id` varchar(191) DEFAULT NULL,
  `oidc_id` varchar(191) DEFAULT NULL,
  `access_token` char(32) DEFAULT NULL,
  `quota` bigint DEFAULT '0',
  `used_quota` bigint DEFAULT '0',
  `request_count` bigint DEFAULT '0',
  `group` varchar(32) DEFAULT 'default',
  `aff_code` varchar(32) DEFAULT NULL,
  `inviter_id` bigint DEFAULT NULL,
    `deleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_access_token` (`access_token`),
  UNIQUE KEY `idx_users_aff_code` (`aff_code`),
  UNIQUE KEY `uni_users_username` (`username`),
  KEY `idx_users_username` (`username`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_lark_id` (`lark_id`),
  KEY `idx_users_oidc_id` (`oidc_id`),
  KEY `idx_users_display_name` (`display_name`),
  KEY `idx_users_git_hub_id` (`github_id`),
  KEY `idx_users_we_chat_id` (`wechat_id`),
  KEY `idx_users_inviter_id` (`inviter_id`),
   KEY `idx_users_deleted` (`deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `project` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(20)  NOT NULL,
  `project_name` varchar(128)  DEFAULT NULL,
  `actived` tinyint DEFAULT '0',
  `deleted` tinyint DEFAULT '0',
  `create_time` bigint DEFAULT '0',
  `update_time` bigint DEFAULT '0',
  `status` tinyint default 0,
  PRIMARY KEY (`id`),
  KEY `idx_parent_visible` (`user_id`,`deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 alter table project add column project_dir varchar(100) default '';
 
CREATE TABLE IF NOT EXISTS `project_ext` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` varchar(36)  NOT NULL,
  `git_url` varchar(256) DEFAULT NULL,
  `image_name` varchar(64) DEFAULT NULL,
  `deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_parent_visible` (`project_id`,`deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO users (username, password, display_name, role, email, deleted)
VALUES ('admin', '$2a$10$he.d4PqEe1lGaQ2ZrdbfLew1/vspBk9Pf3YHicQrQ9u5BdSjw.npm', '管理员', 0, 'admin@163.com', 0);