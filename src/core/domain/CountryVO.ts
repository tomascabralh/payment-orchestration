export class CountryVO {
  constructor(public readonly code: string) {
    if (!/^[A-Z]{2}$/.test(code)) {
      throw new Error("Invalid country code");
    }
  }
}
