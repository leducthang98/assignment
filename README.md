# Assignment

## Technical Requirements

- Docker
- Docker Compose
- Node.js >= 20
- Yarn >= 1.22

## Installation Guide

### 1. Install Dependencies

```bash
yarn install
```

### 2. Prepare Project's Configurations

Ensure the following files are configured correctly:

- `.env.example`
- `docker-compose.yaml`
- `package.json`

### 3. Copy `.env` File

```bash
cp .env.example .env
```

### 4. Run Infrastructure Services

```bash
docker-compose up mysql redis -d
```

### 5. Migrate Database

```bash
make sync-db
```

### 6. Start the Application

#### 6.1 Development Environment

```bash
yarn start:dev
```

#### 6.2 Production Environment

```bash
yarn build
yarn start:prod
```

## Other Notes

### Generate New Modules

To generate a new module, use the following command:

```bash
nest g res ${module-name} modules
```

Replace `${module-name}` with the name of the module you wish to create.