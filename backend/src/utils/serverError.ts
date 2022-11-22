import { Response } from "express";

class ServerError extends Error {
  statusCode: number;

  constructor(message?: string, statusCode?: number) {
    super(message || "Internal Server Error");

    this.statusCode = statusCode || 500;

    this.name = Error.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ServerError;
