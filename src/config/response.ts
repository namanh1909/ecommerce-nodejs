export type CommonResponseType<T> = {
  code: number;
  data: T;
  message: string;
  success: boolean;
};
