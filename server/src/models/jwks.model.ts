export type jwks = {
  keys: key[];
};

export type key = {
  crv: string;
  d?: string | null;
  ext: boolean;
  key_ops: string[];
  kty: string;
  x: string;
  y: string;
};
