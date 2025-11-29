// jose is also a servicible library for working with JWTs
import jwt from "jsonwebtoken";
import fs from "fs";

const signingKey = process.env.SECRET_HS256;

const secret = new TextEncoder().encode(signingKey);

const anonKey = jwt.sign({ "x-triplit-token-type": "anon" }, secret, {
  algorithm: "HS256",
});
const serviceKey = jwt.sign({ "x-triplit-token-type": "secret" }, secret, {
  algorithm: "HS256",
});

console.log("ANON_KEY:", anonKey);
console.log("SERVICE_KEY:", serviceKey);
