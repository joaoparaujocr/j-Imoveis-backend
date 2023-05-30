import zod from 'zod';
import * as bcrypt from 'bcrypt';

const user = zod.object({
  id: zod.number(),
  name: zod.string(),
  email: zod.string().email(),
  password: zod.string().transform((value) => bcrypt.hashSync(value, 10)),
  isAdmin: zod.boolean(),
  isActive: zod.boolean(),
  createdAt: zod.date(),
  updatedAt: zod.date(),
  deletedAt: zod.date().nullable(),
});

const userCreate = user
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    isActive: true,
  })
  .partial({ isAdmin: true });
const userReturn = user.omit({ password: true });
const userUpdate = userCreate.partial().omit({ password: true, isAdmin: true });

export { user, userCreate, userReturn, userUpdate };
