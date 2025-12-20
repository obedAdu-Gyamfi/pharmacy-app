<h1 align="center">Pharmacy App</h1>
<p align="center"> A modern pharmacy management system for inventory, sales, and reporting </p>

## 🪁 Features

- Point of Sale (POS) system
- Medicine inventory management
- Supplier & purchase order tracking
- Customer records
- Sales reports and analytics
- User roles(Admin, Pharmacist, Cashier)

## 🖥️ Tech Stack

**Frontend**
- React
- Tailwind css
- Typescript

**Backend**
- FastApi
- SqlAlchemy

**Other tools**
- Docker
- git

## 🔌 Enviroment Variables

check sample(`.env.example`). create a `.env` file in the root directory and set the following variables:
    
    ```env
    # Database Configuration
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=your_db
    DB_USER=your_db_username
    DB_PASSWORD=your_db_password

    # Application Configuration
    SECRETE_KEY=set_your_secrete_key

    ```

## 🗼Local Development Installation

1. Installation without a docker-compose.yml file
    
    a. Clone the repository

    ```bash
    git clone https://www.github.com/obedAdu-Gyamfi/pharmacy-app.git
    cd pharmacy-app
    bash script.sh
    ```

2. Installation with a docker-compose.yml file
 Check sample (`docker-compose-example.yml`). Set up a docker configuration file
    ```bash
    docker compose up --build -d
    docker compose up
    ```

