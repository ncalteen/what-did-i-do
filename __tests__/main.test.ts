import * as main from 'src/main.js'

let main_runMock: jest.SpyInstance

describe('Entrypoint', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  beforeEach(() => {
    main_runMock = jest.spyOn(main, 'run').mockImplementation()
  })

  it('Calls main.run() when imported', () => {
    require('../src/index')

    expect(main_runMock).toHaveBeenCalled()
  })
})
