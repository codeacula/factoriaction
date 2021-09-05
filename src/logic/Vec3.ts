export class Vec3 {
  constructor(x = 0, y = 0, z = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public x: number;
  public y: number;
  public z: number;

  /**
   * Add the properties of the vector by the provided value
   * @param num
   * @returns
   */
  public add(num: number): Vec3 {
    return new Vec3(this.x + num, this.y + num, this.z + num);
  }

  /**
   * Add the properties of the target vector by the provided values
   * @param targetVec
   * @param providedVec
   * @returns
   */
  public static add(targetVec: Vec3, providedVec: Vec3): Vec3 {
    return new Vec3(targetVec.x + providedVec.x, targetVec.y + providedVec.y, targetVec.z + providedVec.z);
  }

  /**
   * Divide the properties of the vector by the provided value
   * @param num
   * @returns
   */
  public div(num: number): Vec3 {
    return new Vec3(this.x / num, this.y / num, this.z / num);
  }

  /**
   * Divide the targetVector by the provided vector
   * @param targetVec
   * @param providedVec
   * @returns
   */
  public static div(targetVec: Vec3, providedVec: Vec3): Vec3 {
    return new Vec3(targetVec.x / providedVec.x, targetVec.y / providedVec.y, targetVec.z / providedVec.z);
  }

  /**
   * Return the current vector with its properties floor'd
   * @returns
   */
  public floor(): Vec3 {
    return new Vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
  }

  /**
   * Modulo the properties of the vector by the provided values
   * @param num
   * @returns
   */
  public mod(num: number): Vec3 {
    return new Vec3(this.x % num, this.y % num, this.z % num);
  }

  /**
   * Modulo the properties of the target vector by the provided values
   * @param targetVec
   * @param providedVec
   * @returns
   */
  public static mod(targetVec: Vec3, providedVec: Vec3): Vec3 {
    return new Vec3(targetVec.x % providedVec.x, targetVec.y % providedVec.y, targetVec.z % providedVec.z);
  }

  /**
   * Multiply the properties of the vector by the provided values
   * @param num
   * @returns
   */
  public mul(num: number): Vec3 {
    return new Vec3(this.x * num, this.y * num, this.z * num);
  }

  /**
   * Multiply the properties of the target vector by the provided values
   * @param targetVec
   * @param providedVec
   * @returns
   */
  public static mul(targetVec: Vec3, providedVec: Vec3): Vec3 {
    return new Vec3(targetVec.x * providedVec.x, targetVec.y * providedVec.y, targetVec.z * providedVec.z);
  }

  /**
   * Subtract the properties of the vector by the provided value
   * @param num
   * @returns
   */
  public sub(num: number): Vec3 {
    return new Vec3(this.x - num, this.y - num, this.z - num);
  }

  /**
   * Subtract the properties of the target vector by the provided values
   * @param targetVec
   * @param providedVec
   * @returns
   */
  public static sub(targetVec: Vec3, providedVec: Vec3): Vec3 {
    return new Vec3(targetVec.x - providedVec.x, targetVec.y - providedVec.y, targetVec.z - providedVec.z);
  }
}
