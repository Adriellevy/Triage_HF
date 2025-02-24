export const environment = {
    db : {
        host:process.env.DATABASE_HOST || 'localhost',
        port:process.env.DATABASE_PORT || '3309', 
        user:process.env.DATABASE_USER || 'root',
        password:process.env.DATABASE_PASSWORD || '1234',
        database:process.env.DATABASE_NAME || 'triage-refactor-db',
        synchronize:process.env.SYNCHRONIZE == 'true' || true // PARA DESARROLLO SE PUEDE TRUE, PRODUCCION SIEMPRE FALSE (SI LE PEGA LA DB DE PROD)
    },
    production: process.env.PRODUCTION ? process.env.PRODUCTION == 'true' : false,
    port:process.env.PORT || 3010,
    jwt:{
        expiration:process.env.JWT_EXPIRATION || 300000, // 5 min expresados en milisegundos
        secret:process.env.SECRET_JWT_KEY || 'secretKey',
        refreshTokenExpiration:process.env.JWT_REFRESH_TOKEN_EXPIRATION || 14400000 // 4 horas expresados en milisegundos
    }

}

