import { SizeAndPos, Vector3, Vector4 } from "./contract/tool/geometry"

declare global {
    namespace jest {
        interface Matchers<R> {
            toEqualSizeAndPos(expected: SizeAndPos): R
            toBeCloseVector3(expected: Vector3): R
            toBeCloseVector4(expected: Vector4): R
        }
    }
}
