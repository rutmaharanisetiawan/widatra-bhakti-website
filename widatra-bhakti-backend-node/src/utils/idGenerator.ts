export class IdGenerator {
  static make(prefix: string): string {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const seq = String(Math.floor(Math.random() * 9000) + 1000);
    return `${prefix}-${yy}${mm}${dd}-${seq}`;
  }

  static publicUserId(): string {
    return `USR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
