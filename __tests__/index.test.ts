/**
 * Unit tests for the action's entrypoint, src/index.ts
 */
import * as main from 'src/main.js'

const runMock = jest.spyOn(main, 'run').mockImplementation()

describe('index', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('calls run when imported', () => {
    require('../src/index')

    expect(runMock).toHaveBeenCalled()
  })
})
