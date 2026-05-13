export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  services: {
    product: 'http://localhost:8081/api/products',
    order: 'http://localhost:8084/api/orders',
    auth: 'http://localhost:8083/api/auth',
    user: 'http://localhost:8083/api/users',
    payment: 'http://localhost:8086/api/payments',
    delivery: 'http://localhost:8085/api/deliveries',
    vendor: 'http://localhost:8082/api/vendors'
  }
};
