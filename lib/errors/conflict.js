class Conflict extends Error {
  constructor (message) {
    super(message);

    Error.captureStackTrace(this, Conflict);
  }
}

module.exports = Conflict;
