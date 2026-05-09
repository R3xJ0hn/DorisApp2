namespace DorisApp2.API.Services
{
    public interface IServiceResult
    {
        bool Succeeded { get; }
        ServiceError Error { get; }
        string? Message { get; }
    }

    public class ServiceResult : IServiceResult
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
            return new ServiceResult { Succeeded = false, Error = ServiceError.NotFound, Message = message };
        }

        public static ServiceResult Conflict(string message)
        {
            return new ServiceResult { Succeeded = false, Error = ServiceError.Conflict, Message = message };
        }

        public static ServiceResult BadRequest(string message)
        {
            return new ServiceResult { Succeeded = false, Error = ServiceError.BadRequest, Message = message };
        }
    }

    public class ServiceResult<T> : IServiceResult
    {
        public bool Succeeded { get; init; }
        public ServiceError Error { get; init; }
        public string? Message { get; init; }
        public T? Value { get; init; }

        public static ServiceResult<T> Ok(T value)
        {
            return new ServiceResult<T> { Succeeded = true, Value = value };
        }

        public static ServiceResult<T> NotFound(string message)
        {
            return new ServiceResult<T> { Succeeded = false, Error = ServiceError.NotFound, Message = message };
        }

        public static ServiceResult<T> Conflict(string message)
        {
            return new ServiceResult<T> { Succeeded = false, Error = ServiceError.Conflict, Message = message };
        }

        public static ServiceResult<T> BadRequest(string message)
        {
            return new ServiceResult<T> { Succeeded = false, Error = ServiceError.BadRequest, Message = message };
        }
    }
}
