const mongoose = require('mongoose');

const dbName = 'SPCDB';

if (!process.env.DB) {
  console.error(
    'WARNING: the DB environment variable is not set. ' +
    'Set it to your MongoDB connection string (e.g. in Render > Environment).'
  );
}

// A failed connection is logged but does NOT crash the process, so the host
// keeps the service alive and the real error is visible in the logs.
mongoose
  .connect(process.env.DB || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((err) => console.error('MongoDB connection error:', err.message));

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err.message));
db.once('open', () => console.log(`Connected to Database ${dbName}`));

process.on('SIGINT', () => {
  db.close(() => {
    console.log(`Closing connection to ${dbName}`);
    process.exit(0);
  });
});

module.exports = db;
