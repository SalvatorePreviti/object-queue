import ObjectQueue = require('../')

describe('ObjectQueue', () => {
  it('initializes al fields in constructor', () => {
    const q = new ObjectQueue()
    expect(q.size).toBe(0)
    expect(q.head).toBe(null)
    expect(q.tail).toBe(null)
  })

  describe('enqueue', () => {
    it('returns false for null and undefined', () => {
      const q = new ObjectQueue()
      expect(q.enqueue(undefined)).toBe(false)
      expect(q.enqueue(null)).toBe(false)
      expect(q.size).toBe(0)
    })

    it('returns false for value types', () => {
      const q = new ObjectQueue()
      expect(q.enqueue(false)).toBe(false)
      expect(q.enqueue(true)).toBe(false)
      expect(q.enqueue(1)).toBe(false)
      expect(q.enqueue('string')).toBe(false)
      expect(q.enqueue(Symbol('symbol'))).toBe(false)
    })

    it('inserts an object into the queue', () => {
      const q = new ObjectQueue()
      const entry = {}
      expect(q.enqueue(entry)).toBe(true)
      expect(q.head).toBe(entry)
      expect(q.tail).toBe(entry)
      expect(q.size).toBe(1)
      expect(q.getNext(entry)).toBe(null)
    })

    it('inserts an object into the queue only once', () => {
      const q = new ObjectQueue()
      const entry = {}
      expect(q.enqueue(entry)).toBe(true)
      expect(q.enqueue(entry)).toBe(false)
      expect(q.head).toBe(entry)
      expect(q.tail).toBe(entry)
      expect(q.size).toBe(1)
      expect(q.getNext(entry)).toBe(null)
    })

    it('inserts multiple objects only once', () => {
      const q = new ObjectQueue()

      const entries = [{}, {}, {}, {}, {}]

      for (const entry of entries) {
        expect(q.enqueue(entry)).toBe(true)
      }

      for (const entry of entries) {
        expect(q.enqueue(entry)).toBe(false)
      }

      for (let index = 0; index < entries.length; ++index) {
        expect(q.getNext(entries[index])).toBe(entries[index + 1] || null)
      }

      expect(q.size).toBe(entries.length)
      expect(q.head).toBe(entries[0])
      expect(q.tail).toBe(entries[entries.length - 1])
    })
  })

  describe('dequeue', () => {
    it('returns null if the queue is empty', () => {
      const q = new ObjectQueue()
      expect(q.dequeue()).toBe(null)
    })

    it('dequeues a single entry', () => {
      const q = new ObjectQueue()
      const entry = {}
      for (let repeat = 0; repeat < 2; ++repeat) {
        expect(q.enqueue(entry)).toBe(true)
        expect(q.dequeue()).toBe(entry)
        expect(q.size).toBe(0)
        expect(q.head).toBe(null)
        expect(q.tail).toBe(null)
        expect(q.getNext(entry)).toBe(null)
      }
    })

    it('dequeues multiple entries', () => {
      const q = new ObjectQueue()
      const entries = [{}, {}, {}, {}, {}]

      for (let repeat = 0; repeat < 2; ++repeat) {
        for (const entry of entries) {
          q.enqueue(entry)
        }

        for (const entry of entries) {
          expect(q.dequeue()).toBe(entry)
        }

        for (const entry of entries) {
          expect(q.getNext(entry)).toBe(null)
        }

        expect(q.size).toBe(0)
        expect(q.head).toBe(null)
        expect(q.tail).toBe(null)

        expect(q.dequeue()).toBe(null)
      }
    })
  })

  describe('has', () => {
    it('returns false with invalid types', () => {
      const q = new ObjectQueue()
      expect(q.has(undefined)).toBe(false)
      expect(q.has(null)).toBe(false)
      expect(q.has(123)).toBe(false)
    })

    it('returns false for entries not enqueued', () => {
      const q = new ObjectQueue()
      q.enqueue({})
      expect(q.has({})).toBe(false)
      expect(q.has(() => {})).toBe(false)
      expect(q.has([])).toBe(false)
    })

    it('returns true for entries enqueued', () => {
      const q = new ObjectQueue()
      const a = {}
      const b = () => {}
      const c: any[] = []
      expect(q.has(a)).toBe(false)
      expect(q.has(b)).toBe(false)
      expect(q.has(c)).toBe(false)
      q.enqueue(a)
      expect(q.has(a)).toBe(true)
      expect(q.has(b)).toBe(false)
      expect(q.has(c)).toBe(false)
      q.enqueue(b)
      expect(q.has(a)).toBe(true)
      expect(q.has(b)).toBe(true)
      expect(q.has(c)).toBe(false)
      q.enqueue(c)
      expect(q.has(a)).toBe(true)
      expect(q.has(b)).toBe(true)
      expect(q.has(c)).toBe(true)
      q.dequeue()
      expect(q.has(a)).toBe(false)
      expect(q.has(b)).toBe(true)
      expect(q.has(c)).toBe(true)
      q.dequeue()
      expect(q.has(a)).toBe(false)
      expect(q.has(b)).toBe(false)
      expect(q.has(c)).toBe(true)
    })
  })

  describe('clear', () => {
    it('does nothing on an empty queue', () => {
      const q = new ObjectQueue()
      q.clear()
      expect(q.head).toBe(null)
      expect(q.tail).toBe(null)
      expect(q.size).toBe(0)
    })

    it('empties a queue with one single element', () => {
      const q = new ObjectQueue()
      const entry = {}
      q.enqueue(entry)
      q.clear()
      expect(q.size).toBe(0)
      expect(q.head).toBe(null)
      expect(q.tail).toBe(null)
      expect(q.getNext(entry)).toBe(null)
    })

    it('empties a queue with multiple elements', () => {
      const q = new ObjectQueue()
      const entries = [{}, {}, {}, {}, {}]

      for (let repeat = 0; repeat < 2; ++repeat) {
        for (const entry of entries) {
          q.enqueue(entry)
        }

        q.clear()

        for (const entry of entries) {
          expect(q.getNext(entry)).toBe(null)
        }

        expect(q.size).toBe(0)
        expect(q.head).toBe(null)
        expect(q.tail).toBe(null)

        expect(q.dequeue()).toBe(null)
      }
    })
  })

  it('allows enqueuing the same element in two queues', () => {
    const a = new ObjectQueue()
    const b = new ObjectQueue()

    const pA = {}
    const pB = {}

    expect(a.enqueue(pA)).toBe(true)

    expect(b.has(pA)).toBe(false)

    expect(b.enqueue(pA)).toBe(true)

    expect(b.enqueue(pB)).toBe(true)

    expect(a.has(pB)).toBe(false)

    expect(a.enqueue(pB)).toBe(true)

    expect(a.has(pA))
    expect(a.has(pB))

    expect(b.has(pA))
    expect(b.has(pB))

    expect(a.dequeue()).toBe(pA)
    expect(a.dequeue()).toBe(pB)

    expect(b.dequeue()).toBe(pA)
    expect(b.dequeue()).toBe(pB)

    expect(a.dequeue()).toBe(null)
    expect(b.dequeue()).toBe(null)
  })

  describe('toArray', () => {
    it('returns an empty array for an empty queue', () => {
      const q = new ObjectQueue()
      expect(q.toArray()).toEqual([])
    })

    it('returns an array with one item', () => {
      const q = new ObjectQueue()
      const entry = { x: 1 }
      q.enqueue(entry)
      expect(q.toArray()).toEqual([entry])
    })

    it('returns an array with multiple items', () => {
      const q = new ObjectQueue()
      const entries = [{ a: 1 }, { a: 2 }, { a: 3 }]
      for (const entry of entries) {
        q.enqueue(entry)
      }
      expect(q.toArray()).toEqual(entries)
    })
  })
})
