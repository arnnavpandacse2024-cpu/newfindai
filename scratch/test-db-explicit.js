const mongoose = require('mongoose');

// Use the explicit shard hostnames since SRV resolution is failing in this environment
const uri = "mongodb://AITFINALLAB:202456090@ac-a74p3de-shard-00-00.mqpvubr.mongodb.net:27017,ac-a74p3de-shard-00-01.mqpvubr.mongodb.net:27017,ac-a74p3de-shard-00-02.mqpvubr.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority";

console.log('Connecting to explicit hostnames...');

mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error details:', err);
    process.exit(1);
  });
