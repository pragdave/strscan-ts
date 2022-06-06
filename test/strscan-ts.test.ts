import { StringScanner } from "../src/strscan"

// function expect(bool) {.toBeTruthy
//   if (!bool) {
//     throw("Assertion failed")
//   }
// }

// function expect(actual, expected) {
//   if (actual != expected) {
//     throw(`Expected ${expected}, but got ${actual}`)
//   }
// }

test("Concat() can add to a string being parsed", () => {
  const s = new StringScanner("Fri Dec 12 1975 14:39")
  s.scan(/Fri /)
  s.concat(" +1000 GMT")
  expect(s.getSource()).toBe("Fri Dec 12 1975 14:39 +1000 GMT")
  expect(s.scan(/Dec/)).toBe("Dec")

  s.reset()
  expect(s.getPosition()).toBe(0)
  expect(s.getPreMatch()).toBeFalsy
  expect(s.getMatch()).toBeFalsy
  expect(s.getPostMatch()).toBeFalsy
  expect(s.getRemainder()).toBe(s.getSource())
  expect(s.scan(/Fri /)).toBeTruthy
})

test("Captures", () => {
  const s = new StringScanner("Fri Dec 12 1975 14:39")
  expect(s.scan(/(\w+) (\w+) (\d+) /)).toBe("Fri Dec 12 ")
  expect(s.getMatch()).toBe("Fri Dec 12 ")
  expect(s.getCapture(0)).toBe("Fri")
  expect(s.getCapture(1)).toBe("Dec")
  expect(s.getCapture(2)).toBe("12")
  expect(s.getPostMatch()).toBe("1975 14:39")
  expect(s.getPreMatch()).toBe("")
})

test("termination detection", () => { 
  const s = new StringScanner("test string")
  expect(s.hasTerminated()).toBeFalsy
  s.scan(/test/)
  expect(s.hasTerminated()).toBeFalsy
  s.terminate()
  expect(s.hasTerminated()).toBeTruthy

  expect(s.getPosition()).toBe(11)
  s.concat("123")
  expect(s.hasTerminated()).toBeFalsy
  expect(s.getRemainder()).toBe("123")
  expect(s.scan(/123/)).toBeTruthy
  expect(s.getPosition()).toBe(14)
})

test("scanChar", () => {
  const s = new StringScanner("ab")
  expect(s.scanChar()).toBe("a")
  expect(s.scanChar()).toBe("b")
  expect(s.scanChar()).toBeFalsy
})

test("utf characters", () => {
  const s = new StringScanner("☃\n1")
  expect(s.scanChar()).toBe("☃")
  expect(s.scanChar()).toBe("\n")
  expect(s.scanChar()).toBe("1")
  expect(s.scanChar()).toBeFalsy
})

test("peek", () => {
  const s = new StringScanner("test string")
  expect(s.peek(7)).toBe("test st")
  expect(s.peek(7)).toBe("test st")
})

test("regexp character classes", () => {
  const s = new StringScanner("test string")
  expect(s.scan(/\w+/)).toBe("test")
  expect(s.scan(/\w+/)).toBeFalsy
  expect(s.scan(/\s+/)).toBe(" ")
  expect(s.scan(/\w+/)).toBe("string")
  expect(s.scan(/\w+/)).toBeFalsy
})

test("pre and post match with character classses", () => {
  const s = new StringScanner("test string")
  expect(s.scan(/\w+/)).toBe("test")
  expect(s.scan(/\s+/)).toBe(" ")
  expect(s.getPreMatch()).toBe("test")
  expect(s.getPostMatch()).toBe("string")
})

test("scanUntil", () => {
  const s = new StringScanner("Fri Dec 12 1975 14:39")
  expect(s.scanUntil(/1/)).toBe("Fri Dec 1")
  expect(s.getPreMatch()).toBe("Fri Dec ")
  expect(s.scanUntil(/XYZ/)).toBeFalsy
})

test("scanUntil with backtracking", () => {
  const s = new StringScanner("abaabaaab")
  expect(s.scanUntil(/b/)).toBe("ab")
  expect(s.scanUntil(/b/)).toBe("aab")
  expect(s.scanUntil(/b/)).toBe("aaab")
})

test("skip", () => {
  const s = new StringScanner("test string")
  expect(s.skip(/\w+/)).toBe(4)
  expect(s.skip(/\w+/)).toBeFalsy
  expect(s.skip(/\s+/)).toBe(1)
  expect(s.skip(/\w+/)).toBe(6)
  expect(s.skip(/./)).toBeFalsy
})

test("skipUntil", () => {
  const s = new StringScanner("Fri Dec 12 1975 14:39")
  expect(s.skipUntil(/12/)).toBe(10)
  expect(s.peek()).toBe(" ")
  expect(s.peek(3)).toBe(" 19")
})

test("basic unscan", () => {
  const s = new StringScanner("test string")
  expect(s.scan(/\w+/)).toBe("test")
  s.unscan()
  expect(s.scan(/../)).toBe("te")
  expect(s.scan(/\d/)).toBeFalsy
  expect(() => s.unscan()).toThrow()
})

test("check", () => {
  const s = new StringScanner("Fri Dec 12 1975 14:39")
  expect(s.check(/Fri/)).toBe("Fri")
  expect(s.getPosition()).toBe(0)
  expect(s.getMatch()).toBe("Fri")
  expect(s.check(/12/)).toBeFalsy
  expect(s.getMatch()).toBeFalsy
})

test("checkUntil", () => {
  const s = new StringScanner("Fri Dec 12 1975 14:39")
  expect(s.checkUntil(/12/)).toBe("Fri Dec 12")
  expect(s.getPosition()).toBe(0)
  expect(s.getMatch()).toBe("12")
})
