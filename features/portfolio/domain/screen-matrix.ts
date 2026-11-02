export type Point = readonly [number, number]
// top-left, top-right, bottom-right, bottom-left
export type Quad = readonly [Point, Point, Point, Point]

type ScreenMatrixInput = { width: number; height: number; corners: Quad }

const isPoint = (point: unknown): point is Point =>
  Array.isArray(point) && point.length === 2 && point.every((value) => Number.isFinite(value))

function validate(input: unknown): asserts input is ScreenMatrixInput {
  if (typeof input !== "object" || input === null) throw new TypeError("screenMatrix needs { width, height, corners }")
  const { width, height, corners } = input as Partial<ScreenMatrixInput>
  if (!Number.isFinite(width) || !Number.isFinite(height) || width! <= 0 || height! <= 0) throw new TypeError("screenMatrix needs a positive width and height")
  if (!Array.isArray(corners) || corners.length !== 4 || !corners.every(isPoint)) throw new TypeError("screenMatrix needs four corners as [x, y] pairs")
}

// Gauss-Jordan with partial pivoting on an augmented n x (n+1) matrix; returns the n unknowns.
function solve(rows: number[][]): number[] {
  const size = rows.length
  for (let column = 0; column < size; column++) {
    let pivot = column
    for (let row = column + 1; row < size; row++) if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) pivot = row
    if (Math.abs(rows[pivot][column]) < 1e-12) throw new RangeError("the four corners do not form a quadrilateral")
    ;[rows[column], rows[pivot]] = [rows[pivot], rows[column]]
    for (let row = 0; row < size; row++) {
      if (row === column) continue
      const factor = rows[row][column] / rows[column][column]
      for (let at = column; at <= size; at++) rows[row][at] -= factor * rows[column][at]
    }
  }
  return rows.map((row, index) => row[size] / row[index])
}

// The CSS matrix3d() that maps a width x height rectangle (origin at its top-left, transform-origin 0 0) onto the four
// corners of a drawn screen: the homography of four point pairs, so the interface follows the screen's angle and perspective.
export function screenMatrix(input: ScreenMatrixInput): string {
  validate(input)
  const { width, height, corners } = input
  const source: Point[] = [[0, 0], [width, 0], [width, height], [0, height]]
  const rows: number[][] = []
  source.forEach(([x, y], index) => {
    const [u, v] = corners[index]
    rows.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u])
    rows.push([0, 0, 0, x, y, 1, -v * x, -v * y, v])
  })
  const [a, b, c, d, e, f, g, h] = solve(rows)
  return `matrix3d(${[a, d, 0, g, b, e, 0, h, 0, 0, 1, 0, c, f, 0, 1].join(",")})`
}
