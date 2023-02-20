import * as bcrypt from "bcrypt";
const saltRounds = 10;

// For generate hash from password
export const generatehash = (password) => {
  const res = new Promise((accept, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      else accept({ hash });
    });
  });
  return res;
};

// For Verifying Password with hash
export async function verifyPassword(password, hashAlready) {
  return new Promise((accept, reject) => {
    bcrypt.compare(password, hashAlready, function (err, result) {
      if (err) reject(err);
      else accept(result);
    });
  });
}
