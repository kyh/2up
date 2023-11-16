import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const alphaNumeric = alphabet + numbers;

const nanoidUuid = customAlphabet(alphaNumeric, 8);
const nanoidGameCode = customAlphabet(numbers, 4);

export const generateUuid = () => nanoidUuid();

export const generateGameCode = () => nanoidGameCode();
