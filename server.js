import express from "express";
import executionRoutes from "./src/executionRoutes/executionRoutes.js";

const app = express();

app.use(express.json());

app.use("/api", executionRoutes);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

app.get("/",(req,res)=>{

    res.send("done!!!")
})