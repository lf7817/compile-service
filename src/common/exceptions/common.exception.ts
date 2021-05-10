import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrCode } from './interfaces/exception.interface';

export class CommonException extends HttpException {
  constructor(
    private resCode: ErrCode,
    private httpStatus?: number,
    private errors?: any,
  ) {
    super({ ...resCode, errors }, httpStatus || HttpStatus.OK);
  }
}
