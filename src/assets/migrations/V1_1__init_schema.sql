CREATE TABLE
    `permissions` (
        `id` varchar(255) NOT NULL,
        `label` varchar(255) NOT NULL,
        `description` varchar(255) DEFAULT NULL,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT 0,
        PRIMARY KEY (`id`),
        UNIQUE KEY `IDX_1d269eed4300a2aa85a201c527` (`label`)
    );

CREATE TABLE
    `roles` (
        `id` varchar(36) NOT NULL,
        `label` varchar(255) NOT NULL,
        `description` varchar(255) DEFAULT NULL,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`),
        UNIQUE KEY `IDX_54dfc4a418c052c458703ae7d8` (`label`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `role_permissions` (
        `id` int NOT NULL AUTO_INCREMENT,
        `roleId` varchar(255) NOT NULL,
        `permissionId` varchar(255) NOT NULL,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`),
        KEY `FK_b4599f8b8f548d35850afa2d12c` (`roleId`),
        KEY `FK_06792d0c62ce6b0203c03643cdd` (`permissionId`),
        CONSTRAINT `FK_06792d0c62ce6b0203c03643cdd` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
        CONSTRAINT `FK_b4599f8b8f548d35850afa2d12c` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE
    ) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `users` (
        `id` varchar(36) NOT NULL,
        `firstName` varchar(255) DEFAULT NULL,
        `lastName` varchar(255) DEFAULT NULL,
        `dateOfBirth` datetime DEFAULT NULL,
        `isActive` tinyint NOT NULL DEFAULT '0',
        `isApproved` tinyint NOT NULL DEFAULT '0',
        `password` varchar(255) DEFAULT NULL,
        `username` varchar(255) NOT NULL,
        `email` varchar(255) NOT NULL,
        `emailVerified` timestamp NULL DEFAULT NULL,
        `image` varchar(255) DEFAULT NULL,
        `roleId` varchar(255) NOT NULL,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`),
        UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`),
        UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `log` (
        `id` int NOT NULL AUTO_INCREMENT,
        `event` enum (
            'SIGNIN',
            'SIGNUP',
            'SIGNOUT',
            'USER_CREATE',
            'USER_UPDATE',
            'USER_DELETE',
            'USER_ACTIVATE',
            'USER_DEACTIVATE',
            'USER_APPROVE',
            'USER_DISAPPROVE',
            'ROLE_CREATE',
            'ROLE_UPDATE',
            'ROLE_DELETE',
            'ROLE_DUPLICATE',
            'DEVICE_INFO_CREATE',
            'DEVICE_INFO_DELETE',
            'BUG_CREATE',
            'BUG_DELETE',
            'FEEDBACK_CREATE',
            'FEEDBACK_DELETE'
        ) DEFAULT NULL,
        `api` varchar(255) DEFAULT NULL,
        `method` varchar(255) DEFAULT NULL,
        `userId` varchar(255) DEFAULT NULL,
        `logInfo` json DEFAULT NULL,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`),
        KEY `FK_cea2ed3a494729d4b21edbd2983` (`userId`),
        CONSTRAINT `FK_cea2ed3a494729d4b21edbd2983` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `templates` (
        `id` varchar(36) NOT NULL,
        `name` varchar(255) DEFAULT NULL,
        `content` longtext NOT NULL,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `template-styles` (
        `id` varchar(36) NOT NULL,
        `name` varchar(255) NOT NULL,
        `content` longtext,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`),
        UNIQUE KEY `IDX_f89caee9b323abfc0abaeea8b8` (`name`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `template_template_styles` (
        `templateId` varchar(36) NOT NULL,
        `styleId` varchar(36) NOT NULL,
        PRIMARY KEY (`templateId`, `styleId`),
        KEY `IDX_17694cf06ef5a0e0dcc8fac049` (`templateId`),
        KEY `IDX_da6b0f561e3324d22e771e5af4` (`styleId`),
        CONSTRAINT `FK_17694cf06ef5a0e0dcc8fac0494` FOREIGN KEY (`templateId`) REFERENCES `templates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `FK_da6b0f561e3324d22e771e5af41` FOREIGN KEY (`styleId`) REFERENCES `template-styles` (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `upload` (
        `id` int NOT NULL AUTO_INCREMENT,
        `slug` varchar(255) NOT NULL,
        `filename` varchar(255) NOT NULL,
        `relativePath` varchar(255) NOT NULL,
        `mimetype` varchar(255) NOT NULL,
        `size` int NOT NULL,
        `isTemporary` tinyint NOT NULL DEFAULT '0',
        `isPrivate` tinyint NOT NULL DEFAULT '1',
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `device-infos` (
        `id` int NOT NULL AUTO_INCREMENT,
        `model` varchar(255) DEFAULT NULL,
        `platform` varchar(255) DEFAULT NULL,
        `version` varchar(255) DEFAULT NULL,
        `manufacturer` varchar(255) DEFAULT NULL,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `bugs` (
        `id` int NOT NULL AUTO_INCREMENT,
        `event` enum (
            'Crash',
            'UI Issue',
            'Performance Issue',
            'Feature Not Working',
            'Other'
        ) NOT NULL,
        `title` varchar(255) NOT NULL,
        `description` text NOT NULL,
        `deviceId` int DEFAULT NULL,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`),
        KEY `FK_4d27d4b86accd8af3f35daad8fd` (`deviceId`),
        CONSTRAINT `FK_4d27d4b86accd8af3f35daad8fd` FOREIGN KEY (`deviceId`) REFERENCES `device-infos` (`id`) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `feedback` (
        `id` int NOT NULL AUTO_INCREMENT,
        `message` text,
        `category` enum ('General Feedback', 'Feature Request', 'Other') NOT NULL,
        `rating` int DEFAULT NULL,
        `deviceId` int NOT NULL,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`),
        KEY `FK_1927d990407e091b1b45add4c13` (`deviceId`),
        CONSTRAINT `FK_1927d990407e091b1b45add4c13` FOREIGN KEY (`deviceId`) REFERENCES `device-infos` (`id`) ON DELETE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `store` (
        `id` varchar(255) NOT NULL,
        `value` json DEFAULT NULL,
        `createdAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        `updatedAt` datetime (6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        `deletedAt` datetime (6) DEFAULT NULL,
        `isDeletionRestricted` tinyint NOT NULL DEFAULT '0',
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;