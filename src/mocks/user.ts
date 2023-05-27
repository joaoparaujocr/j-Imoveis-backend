import * as bcrypt from 'bcrypt';

export const userLogin = {
  email: 'araujo1@email.com',
  password: '12345678',
};

export const userCreateMock = {
  ...userLogin,
  name: 'João',
};

export const userReturnMock = {
  id: 1,
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
  password: bcrypt.hashSync(userCreateMock.password, 10),
};
