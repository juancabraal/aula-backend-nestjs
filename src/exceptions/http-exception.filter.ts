import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let Message =
            exception instanceof HttpException
                ? exception.message
                : 'Ocorreu um erro desconhecido';

        console.log(exception);

        let _exception: any = exception;

        if (_exception.response) {
            if (_exception.response.status) status = _exception.response.status;

            if (_exception.response.data && _exception.response.data.Message)
                Message = _exception.response.data.Message;
            if (_exception.response.data && _exception.response.data.message)
                Message = _exception.response.data.message;
            if (_exception.response.data && _exception.response.data.Errors)
                Message = _exception.response.data.Errors;
        }

        response.status(status).json({
            statusCode: status,
            Message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
