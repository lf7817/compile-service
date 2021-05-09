import { ErrCode } from './exception.interface';

/**
 * 异常码
 */
export const ExceptionCode: Record<string, ErrCode> = {
  PARAM_VALIDATE_ERROR: { code: 10001, message: '参数传递错误' },
};
