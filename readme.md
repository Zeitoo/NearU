# **1️⃣ users**

Armazena dados dos usuários cadastrados.

| Campo         | Tipo                    | Descrição                         |
| ------------- | ----------------------- | --------------------------------- |
| id            | INT, AUTO_INCREMENT, PK | Identificador único do usuário    |
| user_name     | VARCHAR(50), UNIQUE     | Nome de usuário, único            |
| email_address | VARCHAR(100), UNIQUE    | E-mail do usuário, único          |
| password_hash | VARCHAR(255)            | Hash da senha                     |
| profile_img   | INT, DEFAULT 1          | ID da imagem de perfil (padrão 1) |

Relacionamentos:

-   `refresh_tokens.user_id` → `users.id`
-   `friendships.requester_id` / `friendships.addressee_id` → `users.id`
-   `user_locations.user_id` → `users.id`
-   `location_requests.requester_id` / `location_requests.target_id` → `users.id`
-   `location_permissions.owner_id` / `viewer_id` → `users.id`
-   `user_preferences.user_id` → `users.id`
-   `notifications.user_id` → `users.id`

---

# **2️⃣ refresh_tokens**

Armazena tokens de atualização JWT para autenticação.

| Campo      | Tipo                                 | Descrição                       |
| ---------- | ------------------------------------ | ------------------------------- |
| id         | INT, AUTO_INCREMENT, PK              | Identificador único do token    |
| user_id    | INT, FK → users(id)                  | Usuário a quem pertence o token |
| token_hash | CHAR(64), UNIQUE                     | Hash do token                   |
| revoked    | TINYINT(1), DEFAULT 0                | Indica se o token foi revogado  |
| created_at | TIMESTAMP, DEFAULT CURRENT_TIMESTAMP | Data de criação                 |
| expires_at | TIMESTAMP                            | Data de expiração do token      |

---

# **3️⃣ friendships**

Gerencia pedidos e status de amizades.

| Campo        | Tipo                                                               | Descrição                |
| ------------ | ------------------------------------------------------------------ | ------------------------ |
| id           | INT, AUTO_INCREMENT, PK                                            | Identificador único      |
| requester_id | INT, FK → users(id)                                                | Quem enviou o pedido     |
| addressee_id | INT, FK → users(id)                                                | Quem recebe o pedido     |
| status       | ENUM('pending','accepted','rejected','blocked'), DEFAULT 'pending' | Status do relacionamento |
| created_at   | TIMESTAMP, DEFAULT CURRENT_TIMESTAMP                               | Data do pedido           |
| updated_at   | TIMESTAMP                                                          | Última atualização       |

Notas:

-   `unique_request (requester_id, addressee_id)` evita duplicidade de pedidos.
-   Status `accepted` indica amizade ativa.

---

# **4️⃣ user_locations**

Guarda a **última localização** de cada usuário.

| Campo      | Tipo                                                             | Descrição                         |
| ---------- | ---------------------------------------------------------------- | --------------------------------- |
| user_id    | INT, PK, FK → users(id)                                          | Usuário associado                 |
| latitude   | DECIMAL(10,8)                                                    | Latitude atual                    |
| longitude  | DECIMAL(11,8)                                                    | Longitude atual                   |
| accuracy   | FLOAT                                                            | Precisão da localização em metros |
| updated_at | TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Última atualização                |

---

# **5️⃣ location_history** _(opcional)_

Armazena histórico completo de localização do usuário.

| Campo       | Tipo                                 | Descrição            |
| ----------- | ------------------------------------ | -------------------- |
| id          | BIGINT, AUTO_INCREMENT, PK           | Identificador único  |
| user_id     | INT, FK → users(id)                  | Usuário associado    |
| latitude    | DECIMAL(10,8)                        | Latitude registrada  |
| longitude   | DECIMAL(11,8)                        | Longitude registrada |
| recorded_at | TIMESTAMP, DEFAULT CURRENT_TIMESTAMP | Momento da gravação  |

---

# **6️⃣ location_requests**

Registra pedidos de um usuário para ver a localização de outro.

| Campo        | Tipo                                                     | Descrição               |
| ------------ | -------------------------------------------------------- | ----------------------- |
| id           | INT, AUTO_INCREMENT, PK                                  | Identificador do pedido |
| requester_id | INT, FK → users(id)                                      | Quem solicita           |
| target_id    | INT, FK → users(id)                                      | Quem recebe o pedido    |
| status       | ENUM('pending','accepted','rejected'), DEFAULT 'pending' | Status do pedido        |
| created_at   | TIMESTAMP, DEFAULT CURRENT_TIMESTAMP                     | Data do pedido          |
| updated_at   | TIMESTAMP                                                | Última atualização      |

---

# **7️⃣ location_permissions**

Define quem pode ver a localização de quem.

| Campo      | Tipo                                 | Descrição                 |
| ---------- | ------------------------------------ | ------------------------- |
| id         | INT, AUTO_INCREMENT, PK              | Identificador             |
| owner_id   | INT, FK → users(id)                  | Dono da localização       |
| viewer_id  | INT, FK → users(id)                  | Quem tem permissão        |
| is_allowed | TINYINT(1), DEFAULT 1                | 1 = permitido, 0 = negado |
| created_at | TIMESTAMP, DEFAULT CURRENT_TIMESTAMP | Data da permissão         |

---

# **8️⃣ user_preferences**

Configurações do usuário sobre recebimento de solicitações.

| Campo                   | Tipo                    | Descrição                      |
| ----------------------- | ----------------------- | ------------------------------ |
| user_id                 | INT, PK, FK → users(id) | Usuário associado              |
| allow_friend_requests   | TINYINT(1), DEFAULT 1   | Receber pedidos de amizade     |
| allow_location_requests | TINYINT(1), DEFAULT 1   | Receber pedidos de localização |

---

# **9️⃣ notifications**

Registra notificações enviadas aos usuários.

| Campo        | Tipo                                      | Descrição                                         |
| ------------ | ----------------------------------------- | ------------------------------------------------- |
| id           | BIGINT, AUTO_INCREMENT, PK                | Identificador da notificação                      |
| user_id      | INT, FK → users(id)                       | Usuário que recebe                                |
| type         | ENUM('friend_request','location_request') | Tipo da notificação                               |
| reference_id | INT                                       | ID de referência (friendship ou location_request) |
| is_read      | TINYINT(1), DEFAULT 0                     | Marcador de leitura                               |
| created_at   | TIMESTAMP, DEFAULT CURRENT_TIMESTAMP      | Data de criação                                   |

========================================================================================================================

{
email: 'josejoaozeito@gmail.com',
password: 'kkndk@3m',
name: 'Tech',
phone: '+258 87 131 5904',
avatar: 14
}

CREATE TABLE `users` (
`id` int NOT NULL AUTO_INCREMENT,
`user_name` varchar(50) NOT NULL,
`phone_number` varchar(16) NOT NULL,
`email_address` varchar(100) NOT NULL,
`password_hash` varchar(255) NOT NULL,
`profile_img` int NOT NULL DEFAULT '1',
PRIMARY KEY (`id`),
UNIQUE KEY `user_name` (`user_name`),
UNIQUE KEY `phone_number` (`phone_number`),
UNIQUE KEY `email_address` (`email_address`)
) ENGINE=InnoDB

CREATE TABLE friendships (
id INT NOT NULL AUTO_INCREMENT,
requester_id INT NOT NULL,
addressee_id INT NOT NULL,
status ENUM('pending', 'accepted', 'rejected', 'blocked') NOT NULL DEFAULT 'pending',
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NULL,
PRIMARY KEY (id),
UNIQUE KEY unique_request (requester_id, addressee_id),
FOREIGN KEY (requester_id) REFERENCES users(id),
FOREIGN KEY (addressee_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE user_locations (
user_id INT NOT NULL,
latitude DECIMAL(10,8) NOT NULL,
longitude DECIMAL(11,8) NOT NULL,
accuracy FLOAT NULL,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (user_id),
FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE location_requests (
id INT NOT NULL AUTO_INCREMENT,
requester_id INT NOT NULL,
target_id INT NOT NULL,
status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NULL,
PRIMARY KEY (id),
FOREIGN KEY (requester_id) REFERENCES users(id),
FOREIGN KEY (target_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE location_permissions (
id INT NOT NULL AUTO_INCREMENT,
owner_id INT NOT NULL,
viewer_id INT NOT NULL,
is_allowed TINYINT(1) NOT NULL DEFAULT 1,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id),
UNIQUE KEY unique_permission (owner_id, viewer_id),
FOREIGN KEY (owner_id) REFERENCES users(id),
FOREIGN KEY (viewer_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE user_preferences (
user_id INT NOT NULL PRIMARY KEY,
allow_friend_requests TINYINT(1) DEFAULT 1,
allow_location_requests TINYINT(1) DEFAULT 1,
FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE notifications (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
type ENUM('friend_request', 'location_request') NOT NULL,
reference_id INT NOT NULL,
is_read TINYINT(1) DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;
