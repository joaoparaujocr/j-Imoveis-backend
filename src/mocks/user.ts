export const userCreateMock = {
  name: 'João',
  email: 'araujo1@email.com',
  password: '12345678',
};

export const userReturnMock = {
  id: 4,
  name: 'João',
  email: 'araujo1@email.com',
  isAdmin: false,
  isActive: true,
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
  deletedAt: null,
};

export const userSaveMock = {
  ...userReturnMock,
  password: '12345678',
};
