import axios from 'axios';

const baseURL = 'http://localhost:8080/api/v1/products';

export function getAllProducts(isActive) {
  return axios.get(baseURL + `?isActive=${isActive}`);
}

export function getProductById(productId) {
  return axios.get(baseURL + `/${productId}`);
}

export function postProduct(product) {
  return axios.post(baseURL, product);
}

export function deleteProduct(productId) {
  return axios.delete(baseURL + `/${productId}`);
}

export function putProduct(productId, product) {
  return axios.put(baseURL + `/${productId}`, product);
}

export function pathInactiveProductById(productId) {
  return axios.patch(baseURL + `/${productId}/inactive`);
}

export function pathActiveProductById(productId) {
  return axios.patch(baseURL + `/${productId}/active`);
}
