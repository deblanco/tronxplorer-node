require('dotenv').config(); // instatiate environment variables

CONFIG = {}; // Make this global to use all over the application

CONFIG.app = process.env.APP || 'development';
CONFIG.port = process.env.PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mongo';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '27017';
CONFIG.db_name = process.env.DB_NAME || 'name';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || 'db-password';

CONFIG.tron_node = process.env.TRON_NODE;
CONFIG.tron_node_port = process.env.TRON_NODE_PORT;
CONFIG.solidity_node = process.env.SOLIDITY_NODE;
CONFIG.solidity_node_port = process.env.SOLIDITY_NODE_PORT;
