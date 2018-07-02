/**
 * A simple queue for objects based on a singly linked list.
 * All the basic operations are O(1).
 *
 * @class ObjectQueue
 * @template Entry The optional type to use as antries.
 */
class ObjectQueue<Entry extends {} | Function | any[]> {
  /**
   * Property: The head of the queue, the first element.
   *
   * Contains the next item to be dequeued.
   *
   * @type {(Object | null)}
   * @readonly
   * @memberof ObjectQueue
   */
  public head: Entry | null = null

  /**
   * Property: The tail of the queue, the last element.
   *
   * Contains the last item to be dequeued.
   *
   * @type {(Entry | null)}
   * @readonly
   * @memberof ObjectQueue
   */
  public tail: Entry | null = null

  /**
   * Property: The number of items in the queue.
   *
   * @type {number}
   * @readonly
   * @memberof ObjectQueue
   */
  public size: number = 0

  /**
   * Property: The symbol used to read or write the 'next' property in the Entry object
   *
   * @type {Symbol}
   * @memberof ObjectQueue
   */
  public readonly nextSymbol: symbol = Symbol('ObjectQueue.next')

  /**
   * Checks wether the given entry exists in the queue or not.
   *
   * Complexity is O(1).
   *
   * @param {Entry | null | undefined} entry The entry to look for.
   * @returns {boolean} True if the entry exists in the queue, false if not.
   * @memberof ObjectQueue
   */
  public has(entry: Entry | null | undefined): boolean {
    if ((typeof entry !== 'object' && typeof entry !== 'function') || entry === null) {
      return false // Entry is not a valid reference type
    }
    return (entry as any)[this.nextSymbol] !== undefined
  }

  /**
   * Given an element in the queue, returns the next element.
   * Returns null if the element is not owned by the queue or is the last element.
   *
   * Complexity is O(1)
   *
   * @param {(Entry | null | undefined)} entry The entry to look for.
   * @returns {(Entry | null)} The next entry in the query or null if not available.
   * @memberof ObjectQueue
   */
  public getNext(entry: Entry | null | undefined): Entry | null {
    if ((typeof entry !== 'object' && typeof entry !== 'function') || entry === null) {
      return null
    }
    return (entry as any)[this.nextSymbol] || null
  }

  /**
   * Adds a new item into the queue.
   * Returns true if operation succeeded, false if not.
   *
   * Complexity is O(1).
   *
   * @param {Entry} entry The entry to enqueue.
   * @returns {boolean} True if entry was enqueued, false if not
   * @memberof ObjectQueue
   */
  public enqueue(entry: Entry): boolean {
    if ((typeof entry !== 'object' && typeof entry !== 'function') || entry === null) {
      return false // Entry is not a valid reference type
    }

    const nextSymbol = this.nextSymbol

    if ((entry as any)[nextSymbol] !== undefined) {
      return false // Entry already in this queue
    }

    const tail = this.tail
    if (tail === null) {
      this.tail = entry
      this.head = entry
    } else {
      ;(tail as any)[nextSymbol] = entry
      this.tail = (tail as any)[nextSymbol]
    }
    ;(entry as any)[nextSymbol] = null
    ++this.size

    return true
  }

  /**
   * Removes an entry from the queue.
   * Returns null if the queue is empty.
   *
   * Complexity is O(1).
   *
   * @returns {Entry | null} The entry dequeued or null if the queue is empty.
   * @memberof ObjectQueue
   */
  public dequeue(): Entry | null {
    const entry = this.head
    if (entry === null) {
      return null // Queue is empty
    }

    const next = (entry as any)[this.nextSymbol]
    this.head = next
    if (next === null) {
      this.tail = null
    }
    --this.size
    ;(entry as any)[this.nextSymbol] = undefined
    return entry
  }

  /**
   * Empties the queue.
   *
   * Complexity is O(n).
   *
   * @memberof ObjectQueue
   * @returns {void}
   */
  public clear(): void {
    const nextSymbol = this.nextSymbol
    let next
    for (let entry = this.head; entry; entry = next) {
      next = (entry as any)[nextSymbol]
      ;(entry as any)[nextSymbol] = undefined
    }
    this.head = null
    this.tail = null
    this.size = 0
  }

  /**
   * Copies all items in the queue in a new array and returns it.
   *
   * Complexity is O(n).
   *
   * @returns {Entry[]} An array that contains all entries in the queue.
   * @memberof ObjectQueue
   */
  public toArray(): Entry[] {
    const array: Entry[] = []
    const nextSymbol = this.nextSymbol
    for (let entry = this.head; entry; entry = (entry as any)[nextSymbol]) {
      array.push(entry)
    }
    return array
  }
}

export = ObjectQueue
