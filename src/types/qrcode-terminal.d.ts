declare module 'qrcode-terminal' {
  interface QROptions {
    small?: boolean;
  }

  function generate(text: string, options?: QROptions): void;
  
  export { generate };
  export default { generate };
}