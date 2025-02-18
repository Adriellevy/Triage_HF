export const environment = {
    db : {
        host:process.env.DATABASE_HOST || '127.0.0.1',
        port:process.env.DATABASE_PORT || '3309',
        user:process.env.DATABASE_USER || 'root',
        password:process.env.DATABASE_PASSWORD || '1234',
        database:process.env.DATABASE_NAME || 'triage-refactor-db',
        synchronize:true // PARA DESARROLLO SE PUEDE TRUE, PRODUCCION SIEMPRE FALSE (SI LE PEGA LA DB DE PROD)
    },
    production: process.env.PRODUCTION ? process.env.PRODUCTION == 'true' : false,
    port:process.env.PORT || 3010

}
console.log("ENVIRONMENT",process.env.DATABASE_HOST)
console.log("ENVIRONMENT",process.env.DATABASE_PORT)
console.log("ENVIRONMENT",process.env.DATABASE_USER)
console.log("ENVIRONMENT",process.env.DATABASE_PASSWORD)
console.log("a",process.env.DATABASE_NAME)
