const mongoose = require('mongoose');
const uri = "mongodb+srv://deepak212576_db_user:QMR190xDLgfGLk5V@cluster0.roi5q91.mongodb.net/?appName=Cluster0";
mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
