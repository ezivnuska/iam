export default {
    MONGO_URI: 'mongodb+srv://eric:K1ngfish@iameric-serverless.pvh4pp1.mongodb.net/iameric?retryWrites=true&w=majority',
    IMAGE_PATH: 'https://www.iameric.me/assets',
    API_PATH: 'https://www.iameric.me/api',
    GOOGLE_MAPS_API_KEY: 'AIzaSyDHdT4IZ747lyHYGT53SHsoq31rRkdco6I',
    GEOCODING_API_KEY: 'AIzaSyBuEElH7fPlAj2OEseRvPkxomhkJeoe4mQ',
    JWT_SECRET: 'super.super.secret.shhhh',
    development: {
        port: 4000, // Development port for server
        origin: 'http://localhost:3000', // Development origin for CORS
    },
    production: {
        port: 3000, // Production port for server
        origin: 'https://iameric.me', // Production origin for CORS
    },
}