namespace DorisApp2.API.Services
{
    public class ServiceResult
    {
        public bool Succeeded { get; init; }
        public ServiceError Error { get; init; }
        public string? Message { get; init; }

        public static ServiceResult Ok()
        {
            return new ServiceResult { Succeeded = true };
        }

        public static ServiceResult NotFound(string message)
        {
            return new ServiceResult { Error = ServiceError.NotFound, Message = message };
        }

        public static ServiceResult Conflict(string message)
        {
            return new ServiceResult { Error = ServiceError.Conflict, Message = message };
        }

        public static ServiceResult BadRequest(string message)
        {
            return new ServiceResult { Error = ServiceError.BadRequest, Message = message };
        }
    }

    public class ServiceResult<T> : ServiceResult
    {
        public T? Value { get; init; }

        public static ServiceResult<T> Ok(T value)
        {
            return new ServiceResult<T> { Succeeded = true, Value = value };
        }

        public new static ServiceResult<T> NotFound(string message)
        {
            return new ServiceResult<T> { Error = ServiceError.NotFound, Message = message };
        }

        public new static ServiceResult<T> Conflict(string message)
        {
            return new ServiceResult<T> { Error = ServiceError.Conflict, Message = message };
        }

        public new static ServiceResult<T> BadRequest(string message)
        {
            return new ServiceResult<T> { Error = ServiceError.BadRequest, Message = message };
        }
    }
}
