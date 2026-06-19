// One response shape everywhere.
//   success: { success: true, data, ...meta }
//   error:   { success: false, error }

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export const ok = (res, data, meta = {}, status = 200) =>
  res.status(status).json({ success: true, data, ...meta });

export const fail = (res, status, error) =>
  res.status(status).json({ success: false, error });
