import { JSONPath } from 'jsonpath-plus'
import { expect } from 'chai'


describe('jsonpath', () => {

    it('returns undefined for non-existent path', () => {
        let values = JSONPath({ path: 'non-existent', json: {}, resultType: 'all', flatten: true })
        expect(values).to.eql([])
    })


    it('returns empty array', () => {
        let values = JSONPath({ path: 'empty', json: { empty: [] }, resultType: 'all', flatten: true })
        expect(values).to.eql([
            {
                'parent': {
                    'empty': []
                },
                'parentProperty': 'empty',
                'path': '$[\'empty\']',
                'pointer': '/empty',
                'value': []
            }

        ])
    })
})
