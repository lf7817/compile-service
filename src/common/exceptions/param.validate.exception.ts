import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ExceptionCode } from './exception.constants';

export class ParamValidateException extends HttpException {
  constructor(errors: ValidationError[]) {
    super({ ...ExceptionCode.PARAM_VALIDATE_ERROR, errors }, HttpStatus.OK);
  }
}
