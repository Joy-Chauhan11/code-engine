export const LANGUAGES = {
    javascript: {
        extension: "js",
        image: "node:22",

        compile: null,

        run: (fileName) => [
            "node",
            fileName,
        ],
    },

    python: {
        extension: "py",
        image: "python:3.12",

        compile: null,

        run: (fileName) => [
            "python",
            fileName,
        ],
    },

    cpp: {
        extension: "cpp",
        image: "gcc:14",

        compile: (fileName) => [
            "g++",
            fileName,
            "-o",
            "/app/main",
        ],

        run: () => [
            "/app/main",
        ],
    },

    java: {
        extension: "java",
        image: "openjdk:21",

        compile: () => [
            "javac",
            "-d",
            "/app",
            "Main.java",
        ],

        run: () => [
            "java",
            "-cp",
            "/app",
            "Main",
        ],
    },
};