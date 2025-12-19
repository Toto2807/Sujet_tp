import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Manga API",
            version: "1.0.0",
            description: "API documentation for the Manga application.",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: "Local development server",
            },
        ],
    },
    apis: [path.join(process.cwd(), "src/routes/*.js")],
};

export const swaggerSpec = swaggerJSDoc(options);
