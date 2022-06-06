/**
*  @module strscan-ts
*
*/ 


/**
 * Something that is either a string or that has a toString() function
 */
interface Stringable {
  toString(): string
}

interface Values {
  head: number,
  // tail?: number,
  last: number,
}

export class StringScanner {
  /** @ignore */ private source:    string
  /** @ignore */ private match!:    string
  /** @ignore */ private captures!: RegExpMatchArray
  /** @ignore */ private head!:     number
  /** @ignore */ private last!:     number

  /**
   * Create a new StringScanner containing the given string.
   *
   * @param source The string to be scanned. If not a string, 
   * it will be converted using `toSAtring()`
   */
  constructor(source: Stringable) {
    this.source = source.toString()
    this.reset()
  }

  /**
   * The `scan`, `scanUntil`, `scanChar`, `skip`, and `skipUntil` methods look
   * for matching strings and advance the scanner's position. The _scan_
   * methods return the matched string; the _skip_ methods return the number
   * of characters by which the scan position advanced.
   * -------------------------------------------------------------------------
   * Matches `regexp` at the current position. Returns the matched string
   * and advances the scanner's position, or returns `null` if there is no
   * match.
   *
   * @category Scanning and Skipping 
   */
  scan(regexp: RegExp) {
    const matches = regexp.exec(this.getRemainder())
    if (matches?.index == 0) {
      return this.setState(matches, {
        head: this.head + matches[0].length,
        last: this.head
      })
    }
    else
      return this.setState([])
  }

  /**
   * Matches `regexp` at _or after_ the current position. Returns the
   * portion of the source string after the scanner's position up to and
   * including the end of the match and advances the scanner's position,
   * or returns `null` if there is no match.
   *
   * @category Scanning and Skipping
   */
  scanUntil(regexp: RegExp) {
    const matches = regexp.exec(this.getRemainder())
    if (matches) {
      this.setState(matches, {
        head: this.head + matches.index + matches[0].length,
        last: this.head
      })
      return this.source.slice(this.last, this.head)
    }
    else
      return this.setState([])
  }

  /**
   * Scans one character, returns it, and advances the scanner's position.
   *
   * @category Scanning and Skipping
   */
  scanChar() {
    return this.scan(/[\s\S]/)
  }

  /**
   * Skips over the given `regexp` at the current position. Returns the
   * length of the matched string and advances the scanner's position, or
   * returns `null` if there is no match.
   *
   * @category Scanning and Skipping
   */
  skip(regexp: RegExp) {
    if (this.scan(regexp)) {
      return this.match.length
    }
  }

  /**
   * Skips over the given `regexp` at _or after_ the current position.
   * Returns the length of the string up to and including the end of the
   * match and advances the scanner's position, or returns `null` if there
   * is no match.
   *
   * @category Scanning and Skipping
   */
  skipUntil(regexp: RegExp) {
    if (this.scanUntil(regexp)) {
      return this.head - this.last
    }
  }


  /**
   * The `check`, `checkUntil` and `peek` methods look for matching strings
   * without advancing the scanner's position.
   * -------------------------------------------------------------------------
   * Checks to see if `regexp` can be matched at the current position and
   * returns the matched string without advancing the scanner's position, or
   * returns `null` if there is no match.
   * @category Looking Ahead
   * 
   */
  check(regexp: RegExp) {
    const matches = regexp.exec(this.getRemainder())
    if (matches?.index == 0) {
      return this.setState(matches)
    }
    else
      return this.setState([])
  }

  /**
   * Checks to see if `regexp` can be matched at _or after_ the current
   * position. Returns the portion of the source string after the current
   * position up to and including the end of the match without advancing the
   * scanner's position, or returns `null` if there is no match.
   * @category Looking Ahead
   * 
   */
  checkUntil(regexp: RegExp) {
    const matches = regexp.exec(this.getRemainder())
    if (matches) {
      this.setState(matches)
      return this.source.slice(this.head, this.head + matches.index + matches[0].length)
    }
    else
      return this.setState([])
  }

  /**
   * Returns the next `length` characters after the current position. If
   * called without a `length`, returns the next character. The scanner's
   * position is not advanced.
   *
   * @category Looking Ahead
   * 
   */
  peek(length = 1) {
    return this.source.substring(this.head, this.head+length)
  }


  /**
   * The `getSource`, `getRemainder`, `getPosition` and `hasTerminated`
   * methods provide information about the scanner's source string and
   * position.
   * -------------------------------------------------------------------------
   * Returns the scanner's source string.
   *
   * @category Accessing Scanner State
   *
   */
  getSource() {
    return this.source
  }

  /**
   * Returns the portion of the source string from the scanner's position
   * onward.
   * 
   * @category Accessing Scanner State
   *
   */
  getRemainder() {
    return this.source.slice(this.head)
  }

  /**
   * Returns the scanner's position. In the _reset_ position, this value is
   * zero. In the _terminated_ position, this value is the length of the
   * source string.
   * @category Accessing Scanner State
   *
   */
  getPosition() {
    return this.head
  }

  /**
   * Checks to see if the scanner has reached the end of the string.
   *
   * @category Accessing Scanner State
   *
   */
  hasTerminated() {
    return this.head == this.source.length
  }

  /**
   * The `getPreMatch`, `getMatch`, `getPostMatch` and `getCapture` methods
   * provide information about the most recent match.
   * -------------------------------------------------------------------------
   * Returns the portion of the source string leading up to, but not
   * including, the most recent match. (Returns `null` if there is no recent
   * match.)
   *
   * @category Accessing Match Data
   */
  getPreMatch() {
    if (this.match) {
      return this.source.slice(0, this.head - this.match.length)
    }
  }

  /**
   * Returns the most recently matched portion of the source string (or
   * `null` if there is no recent match).
   *
   * @category Accessing Match Data
   */
  getMatch() {
    return this.match
  }

  /**
   * Returns the portion of the source string immediately following the most
   * recent match. (Returns `null` if there is no recent match.)
   *
   * @category Accessing Match Data
   */
  getPostMatch() {
    if (this.match)
      return this.source.slice(this.head)
  }

  /**
   * Returns the `index`th capture from the most recent match (or `null` if
   * there is no recent match).
   *
   * @category Accessing Match Data
   */
  getCapture(index: number) {
    return this.captures[index]
  }


  /**
   * The `reset`, `terminate`, `concat` and `unscan` methods let you change
   * the state of the scanner.
   * -------------------------------------------------------------------------
   * Resets the scanner back to its original position and clears its match
   * data.
   *
   * @category Modifying Scanner State
   */
  reset() {
    this.setState([], { head: 0, last: 0 })
  }

  /**
   * Advances the scanner position to the end of the string and clears its
   * match data.
   *
   * @category Modifying Scanner State
   */
  terminate() {
    this.setState([], { head: this.source.length, last: this.head })
  }

  /**
   * Appends `string` to the scanner's source string. The scanner's position
   * is not affected.
   *
   * @category Modifying Scanner State
   */
  concat(string: string) {
    this.source += string
  }

  /**
   * Sets the scanner's position to its previous position and clears its
   * match data. Only one previous position is stored. Throws an exception
   * if there is no previous position.
   *
   * @category Modifying Scanner State
   */
  unscan() {
    if (this.match)
      return this.setState([], { head: this.last, last: 0 })
    throw "nothing to unscan"
  }

  //#### Private methods

  /**
    *  Sets the state of the scanner
    *  @internal
    */
  private setState(matches: RegExpMatchArray, values?: Values): string {
    if (values) {
      if ("head" in values)
        this.head = values.head
      if ("last" in values)
        this.last = values.last
    }

    this.captures = matches.slice(1)
    this.match = matches[0]
    return this.match
  }
}

