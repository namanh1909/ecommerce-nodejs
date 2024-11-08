import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import { CommonResponseType } from '../../config/response';

const validate =
  (schema: Record<string, any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' } })
      .validate(object);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      const errorResponse: CommonResponseType<null> = {
        code: httpStatus.BAD_REQUEST,
        data: null,
        message: errorMessage,
        success: false,
      };
      res.status(httpStatus.BAD_REQUEST).send(errorResponse);
      return;
    }
    Object.assign(req, value);
    return next();
  };

export default validate;
