const pe = require('parse-error');

const to = (promise) => promise.then(data => [null, data]).catch(err => [pe(err)]);

const TE = (err_message, log) => {
  // TE stands for Throw Error
  if (log === true) {
    console.error(err_message);
  }
  throw new Error(err_message);
};

const ReE = (res, err, code) => {
  // Error Web Response
  if (typeof err === 'object' && typeof err.message !== 'undefined') {
    err = err.message;
  }
  if (typeof code !== 'undefined') res.statusCode = code;
  return res.json({ success: false, error: err });
};

const ReS = (res, data, code) => {
  // Success Web Response
  let send_data = { success: true };
  if (typeof data === 'object') {
    send_data = Object.assign(data, send_data); // merge the objects
  }
  if (typeof code !== 'undefined') res.statusCode = code;
  return res.json(send_data);
};

// This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Uncaught Error', pe(error));
});

module.exports = {
  to,
  ReS,
  ReE,
};
