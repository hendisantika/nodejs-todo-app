module.exports = function () {
    MongoClient.connect(url, (err, database) => {
        console.log('Mongodb Connected');
        return database;
    });
};
