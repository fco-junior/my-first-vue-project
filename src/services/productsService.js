import axios from 'axios';

const baseURL = 'http://localhost:8080/api/v1/products';

export function getAllProducts() {
  return axios.get(baseURL);
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

export function putProduct(product) {
  return axios.put(baseURL + `/${product.id}`, product);
}