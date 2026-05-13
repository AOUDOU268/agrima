# Agrima Backend

Backend microservices starter for Agrima e-commerce platform.

Modules:
- discovery-server
- config-server
- api-gateway
- product-service
- user-service
- auth-service
- order-service
- payment-service
- delivery-service

## ExÃ©cution

1. DÃ©marrer PostgreSQL avec des bases de donnÃ©es:
   - productdb
   - userdb
   - authdb
   - orderdb
   - paymentdb
   - deliverydb
2. Depuis `backend`, exÃ©cuter:
   - `mvn -pl discovery-server spring-boot:run`
   - `mvn -pl config-server spring-boot:run`
   - `mvn -pl api-gateway spring-boot:run`
   - `mvn -pl product-service spring-boot:run`
   - `mvn -pl user-service spring-boot:run`
   - `mvn -pl auth-service spring-boot:run`
   - `mvn -pl order-service spring-boot:run`
   - `mvn -pl payment-service spring-boot:run`
   - `mvn -pl delivery-service spring-boot:run`

## Endpoints clÃ©s

- API Gateway: `http://localhost:8080/api/...`
- Product: `/api/products`
- User: `/api/users`
- Auth: `/api/auth/register`, `/api/auth/login`
- Order: `/api/orders`
- Payment: `/api/payments`
- Delivery: `/api/deliveries`
