import { nanoid } from 'nanoid';

function generateShortCode(): string {
  return nanoid(6);
}

export default generateShortCode;
