# DorisApp2 API

## Local secrets

Do not store `Jwt:Key` in `appsettings.json`. For local development, configure it with user secrets:

```powershell
dotnet user-secrets set "Jwt:Key" "<random-256-bit-secret>"
```

Use an environment variable such as `Jwt__Key` or your deployment secret manager outside local development. The key must be at least 32 bytes for HS256.
