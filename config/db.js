const mongoose = require("mongoose");

const connectDBWithRetry = async (MONGO_DB_ADRESS) => {
    return mongoose.connect(MONGO_DB_ADRESS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("Connected to MongoDB : " + MONGO_DB_ADRESS.split('@')[1]))
        .catch((err) => {
            console.log("Failed to connect to mongo - retrying in 5 sec : " + MONGO_DB_ADRESS, err);
            setTimeout(connectDBWithRetry, 5000);
        });
};

exports.connectDBWithRetry = connectDBWithRetry;