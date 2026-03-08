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
- Swagger API Documentation
- Jest (unit testing)

## Frontend
- Angular 

---

# Funciones principales

## Autenticacion y Roles
- JWT authentication
- Role-based authorization

### Roles:
- **SUPERVISOR**
  - Registra nuevos usuarios
- **OPERATOR**
  - Maneja los envios

### Endpoints:
- POST /auth/register
- POST /auth/login

---

# Gestión de los envios

## Funciones de los Operadores:

- Crear envios
- Ver lista de envios con paginación
- Filtrar la lista de envios por estado
- Ver los detalles de cada envio con su historial de eventos
- Actualizar el estado del envio
- Cancelar el envio, solo si no fue entregado

## Ciclo de los estados de un envio:

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

Los clientes pueden realizar un seguimiento de un envio sin autenticacion usando un codigo unico de seguimiento

## Endpoint:

- GET /tracking/:trackingCode

## Datos obtenidos:

- Estado actual del envio
- Historia completa de eventos del envio
- Detalles del envio

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

# Estrutura del proyecto

backend/
  src/
  auth/
  users/
  shipments/
  tracking/
  common/

---

# Documentación de la API

Al utilizar Swagger, la documentacion esta disponible en http://localhost:3000/docs

---
