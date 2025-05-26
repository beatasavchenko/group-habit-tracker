export default function generateOtp(length: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((n) => (n % 10).toString())
    .join("");
}
