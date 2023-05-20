import { Request, Response, NextFunction } from 'express';
import { Schema } from 'zod';

const validateSchema =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.format();
      return res.json(formatted).status(400);
    }

    req.body = result.data;

    next();
  };

export default validateSchema;
