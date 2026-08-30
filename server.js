import express from "express";
import executionRoutes from "./src/executionRoutes/executionRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
const app = express();

app.use(express.json());

app.use("/api", executionRoutes);

app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});

app.get("/",(req,res)=>{

    res.send("done!!!")
})


