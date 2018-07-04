'use strict'

/**
 * A simple and high performance queue for objects based on a singly linked list.
 * It acts like a Set, the same entry cannot exists twice in the queue.
 * Entries must be reference types (objects or functions).
 * All the basic operations are O(1).
 *
 * Note: This queue works by setting a private symbol property to
 * the target object. If you don't dequeue all the elements or don't
 * clear the queue after you finish using it or the entries,
 * the link between entries will not be garbage collected.
 * This may create memory leaks.
 *
 * Note: Despite the fact that this queue is iterable,
 * modifying the queue while iterating is unsafe
 * (it may break the queue, enter infinite loops, create memory leaks).
 *
 * @class ObjectQueue
 * @template Entry The optional type to use as antries.
 */
class ObjectQueue {
  constructor() {
    /**
     * Readonly Property: The head of the queue, the first element.
     *
     * Contains the next item to be dequeued.
     *
     * @readonly
     * @type {(Object | null)}
     * @memberof ObjectQueue
     */
    this.head = null
    /**
     * Readonly Property: The tail of the queue, the last element.
     *
     * Contains the last item to be dequeued.
     *
     * @readonly
     * @type {(Entry | null)}
     * @memberof ObjectQueue
     */
    this.tail = null
    /**
     * Readonly Property: The number of items in the queue.
     *
     * @readonly
     * @type {number}
     * @memberof ObjectQueue
     */
    this.size = 0
    /**
     * Readonly Property: The symbol used to read or write the 'next' property in the Entry object
     *
     * @private
     * @readonly
     * @type {Symbol}
     * @memberof ObjectQueue
     */
    this._next = Symbol('#next')
  }

  /**
   * Checks wether the given entry exists in the queue or not.
   *
   * Complexity is O(1).
   *
   * @param {Entry | null | undefined} entry The entry to look for.
   * @returns {boolean} True if the entry exists in the queue, false if not.
   * @memberof ObjectQueue
   */
  has(entry) {
    if ((typeof entry !== 'object' && typeof entry !== 'function') || entry === null) {
      return false // Entry is not a valid reference type
    }
    return entry[this._next] !== undefined
  }

  /**
   * Given an element in the queue, returns the next element.
   * Returns null if the element is not owned by the queue or is the last element.
   *
   * Note: Despite the fact that this queue is iterable,
   * modifying the queue while iterating is unsafe
   * (it may break the queue, enter infinite loops, create memory leaks).
   *
   * Complexity is O(1)
   *
   * @param {(Entry | null | undefined)} entry The entry to look for.
   * @returns {(Entry | null)} The next entry in the query or null if not available.
   * @memberof ObjectQueue
   */
  getNext(entry) {
    if ((typeof entry !== 'object' && typeof entry !== 'function') || entry === null) {
      return null
    }
    return entry[this._next] || null
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
  enqueue(entry) {
    if ((typeof entry !== 'object' && typeof entry !== 'function') || entry === null) {
      return false // Entry is not a valid reference type
    }
    const nextSymbol = this._next
    if (entry[nextSymbol] !== undefined) {
      return false // Entry already in this queue
    }
    const tail = this.tail
    if (tail === null) {
      this.tail = entry
      this.head = entry
    } else {
      tail[nextSymbol] = entry
      this.tail = tail[nextSymbol]
    }
    entry[nextSymbol] = null
    ++this.size
    return true
  }

  /**
   * Enqueues many entries in one single call.
   *
   * Returns the number of enqueued entries.
   *
   * @param {Iterable<Entry>} entries The iterable of entries to enqueue.
   * @returns {number} The number of enqueued entries.
   * @memberof ObjectQueue
   */
  enqueueMany(entries) {
    let result = 0
    for (const entry of entries) {
      if (this.enqueue(entry)) {
        ++result
      }
    }
    return result
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
  dequeue() {
    const entry = this.head
    if (entry === null) {
      return null // Queue is empty
    }
    const next = entry[this._next]
    this.head = next
    if (next === null) {
      this.tail = null
    }
    --this.size
    delete entry[this._next]
    return entry
  }

  /**
   * Empties the queue.
   *
   * Complexity is O(n).
   *
   * @memberof ObjectQueue
   * @returns {undefined}
   */
  clear() {
    const nextSymbol = this._next
    let next
    for (let entry = this.head; entry; entry = next) {
      next = entry[nextSymbol]
      delete entry[nextSymbol]
    }
    this.head = null
    this.tail = null
    this.size = 0
  }

  /**
   * Removes an element from the queue.
   *
   * Since this operation have to loop all entries in the queue,
   * try to avoid deleting elements.
   *
   * Complexity is O(n).
   *
   * @param {(Entry | null | undefined)} entry The entry to remove
   * @returns {boolean} True if entry was removed during this call, false if invalid or not found.
   * @memberof ObjectQueue
   */
  delete(entry) {
    if ((typeof entry !== 'object' && typeof entry !== 'function') || entry === null) {
      return false // Entry is not a valid reference type
    }
    const nextSymbol = this._next
    if (entry[nextSymbol] === undefined) {
      return false // Entry does not belong to this queue
    }
    let prev = null
    let next
    for (let current = this.head; current; prev = current, current = next) {
      next = current[nextSymbol]
      if (current === entry) {
        if (prev === null) {
          this.head = next
        } else {
          prev[nextSymbol] = next
        }
        if (next === null) {
          this.tail = prev
        }
        --this.size
        delete current[nextSymbol]
        return true
      }
    }
    return false
  }

  /**
   * Copies all items in the queue in a new array and returns it.
   *
   * Complexity is O(n).
   *
   * @returns {Entry[]} An array that contains all entries in the queue.
   * @memberof ObjectQueue
   */
  toArray() {
    const array = []
    const nextSymbol = this._next
    for (let entry = this.head; entry; entry = entry[nextSymbol]) {
      array.push(entry)
    }
    return array
  }

  /**
   * Copies all items in the queue in a new Set and returns it.
   *
   * Complexity is O(n).
   *
   * @returns {Set<Entry>} A set that contains all entries in the queue.
   * @memberof ObjectQueue
   */
  toSet() {
    const set = new Set()
    const nextSymbol = this._next
    for (let entry = this.head; entry; entry = entry[nextSymbol]) {
      set.add(entry)
    }
    return set
  }

  /**
   * Iterates all elements in the queue, from head to tail.
   *
   * Note: Despite the fact that this queue is iterable,
   * modifying the queue while iterating is unsafe
   * (it may break the queue, enter infinite loops, create memory leaks).
   *
   * @returns {Iterator<Entry>} An iterable iterator that can be used to iterate all entries.
   * @memberof ObjectQueue
   */
  *[Symbol.iterator]() {
    const nextSymbol = this._next
    let next
    for (let entry = this.head; entry; entry = next) {
      next = entry[nextSymbol]
      yield entry
    }
  }
}

module.exports = ObjectQueue
