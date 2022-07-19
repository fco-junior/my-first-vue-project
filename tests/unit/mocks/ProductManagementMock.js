export const mockSuccessGetAllProducts = {
  status: 200,
  data: {
    data: [
      {
        id: 2,
        name: 'Bean',
        description: 'Description',
        price: 8.5,
        isActive: true,
        createdDate: '2022-07-14T12:06:50.498Z',
        updatedDate: '2022-07-14T12:06:50.498Z'
      },
      {
        id: 1,
        name: 'Rice',
        description: 'Description',
        price: 7.5,
        isActive: true,
        createdDate: '2022-07-14T12:06:50.498Z',
        updatedDate: '2022-07-14T12:06:50.498Z'
      }
    ],
    errors: []
  }
};

export const mockErrorGetAllProducts = {
  response: {
    status: 400,
    data: {
      data: [],
      errors: []
    }
  }
};
