import setup from '../setup';
import plugins from '../plugins';
import { config, flushPromises, mount } from '@vue/test-utils';
import ProductManagement from '../../../src/components/pages/ProductManagement.vue';

import {
  getAllProducts
} from '../../../src/services/productService';

import {
  mockResponseGetAllProducts
} from '../mocks/ProductManagementMock';

config.global = setup.global;

jest.mock('../../../src/services/productService');

describe('ProductManagement.vue', () => {
  test('Get all products', async () => {
    //mock
    getAllProducts.mockResolvedValueOnce(mockResponseGetAllProducts);
    //build
    const wrapper = mount(ProductManagement, {
      global: {
        plugins,
      }
    });
    //exec
    await flushPromises();
    let results = wrapper.vm.products;
    //expect
    expect(results).toHaveLength(2);
  });
});
