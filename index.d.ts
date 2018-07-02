/**
 * A simple queue for objects based on a singly linked list.
 * All the basic operations are O(1).
 *
 * @class ObjectQueue
 * @template Entry The optional type to use as antries.
 */
declare class ObjectQueue<Entry extends {} | Function | any[]> {
  /**
   * Property: The head of the queue, the first element.
   *
   * Contains the next item to be dequeued.
   *
   * @type {(Object | null)}
   * @readonly
   * @memberof ObjectQueue
   */
  public head: Entry | null
  /**
   * Property: The tail of the queue, the last element.
   *
   * Contains the last item to be dequeued.
   *
   * @type {(Entry | null)}
   * @readonly
   * @memberof ObjectQueue
   */
  public tail: Entry | null
  /**
   * Property: The number of items in the queue.
   *
   * @type {number}
   * @readonly
   * @memberof ObjectQueue
   */
  public size: number
  /**
   * Property: The symbol used to read or write the 'next' property in the Entry object
   *
   * @type {Symbol}
   * @memberof ObjectQueue
   */
  public readonly nextSymbol: symbol
  /**
   * Checks wether the given entry exists in the queue or not.
   *
   * Complexity is O(1).
   *
   * @param {Entry | null | undefined} entry The entry to look for.
   * @returns {boolean} True if the entry exists in the queue, false if not.
   * @memberof ObjectQueue
   */
  public has(entry: Entry | null | undefined): boolean
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
  public getNext(entry: Entry | null | undefined): Entry | null
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
  public enqueue(entry: Entry): boolean
  /**
   * Removes an entry from the queue.
   * Returns null if the queue is empty.
   *
   * Complexity is O(1).
   *
   * @returns {Entry | null} The entry dequeued or null if the queue is empty.
   * @memberof ObjectQueue
   */
  public dequeue(): Entry | null
  /**
   * Empties the queue.
   *
   * Complexity is O(n).
   *
   * @memberof ObjectQueue
   * @returns {void}
   */
  public clear(): void
  /**
   * Copies all items in the queue in a new array and returns it.
   *
   * Complexity is O(n).
   *
   * @returns {Entry[]} An array that contains all entries in the queue.
   * @memberof ObjectQueue
   */
  public toArray(): Entry[]
}
export = ObjectQueue
