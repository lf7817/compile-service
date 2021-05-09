import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ErrCode } from './exception.interface';

export class CommonException extends HttpException {
  constructor(
    private resCode: ErrCode,
    private httpStatus?: number,
    private errors?: ValidationError[],
  ) {
    super({ ...resCode, errors }, httpStatus || HttpStatus.OK);
  }
}
