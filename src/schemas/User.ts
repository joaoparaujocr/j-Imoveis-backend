import zod from 'zod';
import * as bcrypt from 'bcrypt';

const user = zod.object({
  id: zod.number(),
  email: zod.string().email(),
  password: zod.string().transform((value) => bcrypt.hashSync(value, 10)),
  isAdmin: zod.boolean().optional(),
});

const userCreate = user.omit({ id: true });
const userReturn = user.omit({ password: true });

export { user, userCreate, userReturn };
