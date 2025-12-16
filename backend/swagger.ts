import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Cloud API",
        description: "API",
        version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            in: "header",
            name: "authorization",
            description: "Utilisez le format: Bearer {votre_token_JWT}"
        },
    },
    security: [{
        bearerAuth: []
    }]
};

const outputFile = "./src/swagger/platformcloud.json";

const endpointsFiles = [
    "./src/index.ts",
];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    console.log("Documentation Swagger générée avec succès !");
});

