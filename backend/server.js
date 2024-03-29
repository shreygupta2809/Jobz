const express = require("express");
const connectDB = require("./utils/db_loader");

const app = express();

// Connecting to DB
connectDB();

// Applying global middleware
app.use(express.json());

// apply google strategy

// Connect routers

// app.use("/api/users", require("./routes/api/users"));
// app.use("/api/auth", require("./routes/api/auth"));
// app.use("/api/course", require("./routes/api/course"));
// app.use("/api/topic", require("./routes/api/topic"));
// app.use("/api/comment", require("./routes/api/comment"));
// app.use("/api/test", require("./routes/api/test"));
app.use("/api/users", require("./routes/users"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/ratings", require("./routes/ratings"));
app.use("/api/applicant", require("./routes/applicant"));
app.use("/api/recruiter", require("./routes/recruiter"));

// app.get("/", (req, res) => {
//   res.send("Server setup successfully");
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server started on port ${PORT}`)
);
