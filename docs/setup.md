# ToDo Challenge

## Introducción

**ToDo Challenge** es un proyecto que consta de un backend y un frontend. El backend está desarrollado en **Django**, mientras que el frontend utiliza **React**. Este proyecto permite la administración de tareas y autenticación de usuarios.

Este proyecto está diseñado para levantarse fácilmente usando **Docker** y **Docker Compose**, además de configuraciones locales. En este documento se describen ambas opciones.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

### Para Levantar con Docker

1. **Docker**
   - Descárgalo desde [Docker](https://www.docker.com/).
2. **Docker Compose**
   - Generalmente incluido con Docker Desktop. Verifica con:
     ```bash
     docker-compose --version
     ```

### Para Levantar Localmente

1. **Python 3.12** (para el backend)
   - Descárgalo desde [python.org](https://www.python.org/).
2. **Node.js y npm** (para el frontend)
   - Instálalo desde [nodejs.org](https://nodejs.org/).
3. **Git**
   - Descárgalo desde [git-scm.com](https://git-scm.com/).

---

## Estructura del Proyecto

### Backend

El backend utiliza **Django** y cubre las funcionalidades de:

- Autenticación de usuarios.
- CRUD de tareas.

El entorno virtual de **Python** (`venv`) se utiliza si decides manejar dependencias localmente.

### Frontend

El frontend está desarrollado con **React**, usa **Vite** como su herramienta de desarrollo, y librerías complementarias como **MUI**, **Dayjs**, y **Axios**. Se enlista como un servicio separado en los archivos `docker-compose.yml`.

---

## Configuración Inicial

### Variables de Entorno

Tanto el backend como el frontend requieren archivos `.env` para su configuración. Asegúrate de crear estos archivos en las ubicaciones correspondientes:

#### Para el Backend
Crea un archivo `.env` dentro del directorio correspondiente del backend:
```env
ALLOWED_HOSTS=backend

DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_PASSWORD=admin

POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_DB=todo

DATABASE_URL=postgres://postgres:1234@postgres:5432/todo
```

#### Para el Frontend
Crea un archivo `.env` dentro del directorio correspondiente del frontend:
```env
VITE_BASE_URLBASE_URL=http://localhost:8000/api
```

---

## Levantar el Proyecto con Docker

Este proyecto incluye varios archivos `docker-compose.yml` para facilitar diferentes escenarios. A continuación, te explico cómo levantarlos completamente con contenedores:

### Pasos Generales

1. **Clona el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```

2. **Construye las imágenes de Docker:**
   ```bash
   docker-compose -f docker-compose.yaml -f docker-compose.dev.yml build
   ```

3. **Levanta los servicios:**
   ```bash
   docker-compose -f docker-compose.yaml -f docker-compose.dev.yml up
   ```

*Nota*: se usa ```docker-compose -f docker-compose.yaml -f docker-compose.dev.yml``` debido a que es necesario hacer merge de los 2 docker compose files para construir las imagenes.

Esto levantará:

- Backend: disponible en `http://localhost:9000/`
- Frontend: accesible en `http://localhost:5173/`

Sin embargo, esta dockerizacion tambien cuenta con nginx para entornos de desarrollo, por lo tanto, podra acceder al proyecto unificado desde ```http://127.0.0.1/``` o ```http://localhost/```

### Levantar un Servicio Específico

Si necesitas levantar solo el backend o solo el frontend, puedes especificarlo:

#### Levantar Solo el Backend
```bash
docker-compose -f docker-compose.dev.yml up backend
```

#### Levantar Solo el Frontend
```bash
docker-compose -f docker-compose.yaml -f docker-compose.dev.yml up frontend
```

---

## Levantar el Proyecto de Forma Local

Si prefieres no usar Docker, puedes levantar el proyecto localmente siguiendo estos pasos.

### Backend (Django)

1. Activa el entorno virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # En Windows: .\venv\Scripts\activate
   ```

2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

3. Configura el archivo `.env`.

4. Realiza las migraciones y ejecuta el servidor:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

El backend estará disponible en: `http://localhost:9000/`.

### Frontend (React)

1. Ve al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el archivo `.env`.

4. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El frontend estará disponible en: `http://localhost:5173/`.

---

## Comandos Útiles de Docker

- **Para listar contenedores corriendo:**
  ```bash
  docker ps
  ```

- **Para detener los servicios:**
  ```bash
  docker-compose -f docker-compose.yaml -f docker-compose.dev.yml down
  ```

- **Para limpiar contenedores, imágenes y volúmenes no utilizados:**
  ```bash
  docker system prune -a
  ```

---

## Scripts Útiles

### Backend (dentro del container)

- Correr pruebas automáticas:
  ```bash
  python manage.py test
  ```

- Crear y aplicar migraciones:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```
  
---

🚀🚀🚀🚀🚀🚀