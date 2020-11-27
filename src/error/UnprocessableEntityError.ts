import BaseError from "./BaseError";

export default class UnprocessableEntityError extends BaseError {
  constructor(message: string) {
    super(message, 422);
  }
}