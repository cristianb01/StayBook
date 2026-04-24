# StayBook - Architecture & Domain Overview

## 🧠 Overview

StayBook es una API de reservas de propiedades (tipo Airbnb simplificado).

Objetivo:
- Aplicar Clean Architecture
- Usar CQRS con MediatR
- Modelar lógica de negocio real (no CRUD)

---

## 🏗️ Arquitectura

### Capas

- **Domain**
    - Entidades puras
    - Value Objects
    - Reglas de negocio
    - Sin dependencias externas

- **Application**
    - CQRS (Commands / Queries)
    - Orquestación del dominio
    - Interfaces (repositorios, servicios)

- **Infrastructure**
    - EF Core
    - Implementaciones de repositorios
    - Servicios externos

- **API**
    - Controllers
    - Expone endpoints HTTP
    - Usa MediatR

---

## 🔗 Dependencias

API → Application → Domain  
↓  
Infrastructure

- Domain no depende de nadie
- Application NO depende de Infrastructure
- Infrastructure implementa interfaces de Application

---

## ⚙️ CQRS + MediatR

- Commands → modifican estado
- Queries → solo lectura

Ejemplo:

- `CreateBookingCommand`
- `SearchPropertiesQuery`

Cada command/query tiene su Handler:
