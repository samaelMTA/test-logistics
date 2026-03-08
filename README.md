# Prueba tecnica - TransLog

Prueba tecnica para un puesto como Fullstack Developer (NestJS + Angular)

En la prueba tecnica realizada se implementa un sistema logistico que permite a los operadores gestionar los envios, actualizar su estado y permite a los clientes rastrear sus paquetes mediante un codigo de seguimiento publico. 

---

# Tecnologías utilizadas

## Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Swagger (API Documentation)
- Jest (unit testing)

## Frontend
- Angular 
- Angular Material
- Reactive Forms
- Angular Router
- Signals for state handling

## Infraestructura
- Docker
- Docker Compose

---

# Sistema TransLog

La aplicación consta de dos módulos principales:

## Sistema de Logística Interna

Utilizado por el personal de la empresa para gestionar los envíos.

Las funciones incluyen:
- Crear envíos
- Actualizar el estado de los envíos
- Seguir el ciclo de eventos de los envíos
- Gestionar usuarios con permisos basados ​​en roles

## Portal de seguimiento público

Los clientes pueden rastrear sus envíos mediante un código de seguimiento sin necesidad de autenticación.

---
# Roles de usuario:

## Supervisor

- Registrar nuevos usuarios
- Acceder al sistema interno

## Operador

- Autenticarse
- Crear envíos
- Actualizar el estado de los envíos
- Gestionar el ciclo de eventos de los envíos

---

# Gestión de los envios

## Ciclo de estados de un envio:

  CREATED -> IN_WAREHOUSE -> IN_TRANSIT -> OUT_FOR_DELIVERY -> DELIVERED

## Estados alternativos:

  RETURNED & CANCELLED

## Endpoints

- POST /shipments
- GET /shipments
- GET /shipments/:id
- PATCH /shipments/:id/status
- DELETE /shipments/:id

---

# Seguimiento publico del envio

Los clientes pueden realizar un seguimiento de un envio sin autenticacion usando un codigo unico de seguimiento (Ejemplo: ENV-20260308-0001)

## Endpoint:

- GET /tracking/:trackingCode

## Informacion obtenida:

- Estado actual del envio
- Historial completo de eventos del envio
- Detalles del envio

---

# Decisiones técnicas

### NestJS

Seleccionado por su arquitectura modular y su uso intensivo de TypeScript, caracteristicas utiles para construir aplicaciones backend escalables y mantenibles.

### Angular

Seleccionado para crear una aplicación frontend estructurada basada en componentes y el uso de TypeScript.

### PostgreSQL

Proporciona almacenamiento de datos relacionales confiable y avanzada, destacando su alto rendimiento y escalabilidad.

### TypeORM

Se utiliza para el modelado de entidades y la interacción con la base de datos PostgreSQL.

### Docker

Docker Compose garantiza la ejecución consistente de la aplicación en diferentes entornos y simplifica la configuración del proyecto para su evaluación, agilizando el despligue.

---

# Algoritmo de asignación de vehiculos

La API incluye un endpoint para distribuir los envios en los vehiculos de entrega segun el peso permitido

## Endpoint

- POST /shipments/assign-vehicles

## Input

```json
{
  "shipmentIds": ["uuid-1", "uuid-2"],
  "vehicleCapacity": 100
}
```

## First Fit Decreasing (FFD)

El sistema logistico utiliza el algoritmo FFD para minimizar el numero de vehiculos utilizados

- Ordena los envios por peso, en orden descendente
- Asigna cada envio al primer vehiculo con suficiente capacidad restante
- Si no cabe en ningun vehiculo, crea uno nuevo

---

# Instrucciones para levantar el entorno

Se necesita:
- Docker
- Docker Compose

Desde la raiz del proyecto:
  docker compose up --build

Esto iniciará:
- La base de datos PostgreSQL
- La API de backend NestJS
- La aplicación frontend Angular

---

# Variables de entorno

Se incluye un archivo `.env.example` con las variables de entorno necesarias para el backend.

Al ejecutar el proyecto con Docker Compose, estas variables ya se proporcionan en la configuración del contenedor, por lo que no se requiere configuración manual.

Pero se incluye el archivo `.env.example` como referencia y para ejecutar el backend fuera de Docker si se desea.

---

# Acceder a la aplicación

- Frontend:
  http://localhost:4200

- Seguimiento público:
  http://localhost:4200/tracking

- API de backend:
  http://localhost:3000

- Documentación de la API de Swagger:
  http://localhost:3000/docs

---

# Primer inicio

Para comenzar el sistema crea automáticamente un usuario supervisor predeterminado, puesto que es el único que puede crear usuarios con rol de operador.

### Credenciales predeterminadas:

- Correo electrónico: supervisor@translog.com

- Contraseña: 123456*

Este usuario puede iniciar sesión y registrar cuentas de operador.

### Flujo recomendado

1. Levantar con Docker

2. Login con supervisor

3. Crear operador

4. Crear envío

5. Cambiar estados

6. Probar tracking público

---

# Ejecución de pruebas

Las pruebas unitarias de backend se pueden ejecutar con (estando dentro de la carpeta backend):

      npm run test

Las pruebas incluyen:

- Algoritmo de asignación de vehículos
- Lógica de negocio de envíos

En donde, se validan transiciones válidas e inválidas del ciclo de eventos de un envio y el comportamiento del algoritmo First Fit Decreasing

---

# Autor

Miguel Colunche