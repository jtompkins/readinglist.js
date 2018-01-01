const tap = require('./tap')

const VALUE = {}
const mockFunc = jest.fn()

describe('tap', () => {
  beforeEach(() => {
    mockFunc.mockReset()
  })

  it('passes the value it is given to the func', () => {
    tap(VALUE, mockFunc)

    expect(mockFunc).toHaveBeenCalledWith(VALUE)
  })

  it('returns the value it is given', () => {
    expect(tap(VALUE, mockFunc)).toBe(VALUE)
  })
})
