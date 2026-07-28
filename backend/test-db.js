require('dotenv').config();
const mongoose = require('mongoose');

const uri = "mongodb+srv://campus_admin:campus123@cluster0.kl18as.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
.then(() => {
    console.log("MongoDB Connected Successfully");
    process.exit();
})
.catch(err => {
    console.log("Connection Error:");
    console.log(err);
    process.exit(1);
});
