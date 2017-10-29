export class SolveCipherRequest {
  public ciphertext: string;
  public iterations: number;
}

export class SolveCipherResult {
  public key: string;
  public plaintext: string;
  public score: number;
}

export class SolveCipherResponse {
  public results: SolveCipherResult[];
}

export const SOLVE_CIPHER_URL = "/api/solve_cipher";
