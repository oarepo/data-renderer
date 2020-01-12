import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import install, { KVPairComponent } from '@oarepo/data-renderer'

const sampleDoc = {
    title: 'titleContent',
    location: {
        street: '1'
    },
    array: [
        {
            name: 'first',
            idx: 1,
            subobj: {
                test: 1
            }
        },
        {
            name: 'second',
            idx: 2,
            subobj: {
                test: 2
            }
        }
    ]
}

describe('KVPairComponent.vue', () => {
    let cmp
    beforeEach(() => {
        const localVue = createLocalVue()
        localVue.use(install)
        cmp = shallowMount(KVPairComponent, {
            localVue
        })
    })

    it('gets values for empty path', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            layout: {},
            paths: ['p1/p2', 'p2'],
            jsonPointer: 'abc'
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                value: sampleDoc,
                jsonPointer: 'abc',
                paths: ['p1/p2', 'p2']
            }
        ])
    })

    it('gets values for short path', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            layout: {
                path: 'title'
            },
            paths: ['abc']
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                value: sampleDoc.title,
                jsonPointer: '/title',
                paths: ['abc/title', 'title'],
            }
        ])
    })

    it('gets values for nested path', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            layout: {
                path: 'location.street'
            },
            paths: ['abc']
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                value: sampleDoc.location.street,
                jsonPointer: '/location/street',
                paths: ['abc/location/street', 'location/street', 'street'],
            }
        ])
    })

    it('gets values for array members', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            layout: {
                path: 'array'
            },
            paths: ['abc']
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                "jsonPointer": "/array",
                "paths": [
                    "abc/array",
                    "array"
                ],
                "value": [
                    {
                        "idx": 1,
                        "name": "first",
                        "subobj": {
                            "test": 1
                        }
                    },
                    {
                        "idx": 2,
                        "name": "second",
                        "subobj": {
                            "test": 2
                        }
                    }
                ]
            }
        ])
    })

    it('gets values for array item', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            layout: {
                path: 'array[*].name'
            },
            paths: ['abc']
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                value: sampleDoc.array[0].name,
                jsonPointer: '/array/0/name',
                paths: ['abc/array/arritm/name', 'array/arritm/name', 'arritm/name', 'name']
            },
            {
                value: sampleDoc.array[1].name,
                jsonPointer: '/array/1/name',
                paths: ['abc/array/arritm/name', 'array/arritm/name', 'arritm/name', 'name']
            }
        ])
    })

    it('gets values for array nested', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            layout: {
                path: 'array[*].subobj'
            },
            paths: ['abc']
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                value: sampleDoc.array[0].subobj,
                jsonPointer: '/array/0/subobj',
                paths: ['abc/array/arritm/subobj', 'array/arritm/subobj', 'arritm/subobj', 'subobj']
            },
            {
                value: sampleDoc.array[1].subobj,
                jsonPointer: '/array/1/subobj',
                paths: ['abc/array/arritm/subobj', 'array/arritm/subobj', 'arritm/subobj', 'subobj']
            }
        ])
    })

    it('gets values for array nested value', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            layout: {
                path: 'array[*].subobj.test'
            },
            paths: ['abc']
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                value: sampleDoc.array[0].subobj.test,
                jsonPointer: '/array/0/subobj/test',
                paths: ['abc/array/arritm/subobj/test', 'array/arritm/subobj/test', 'arritm/subobj/test', 'subobj/test', 'test']
            },
            {
                value: sampleDoc.array[1].subobj.test,
                jsonPointer: '/array/1/subobj/test',
                paths: ['abc/array/arritm/subobj/test', 'array/arritm/subobj/test', 'arritm/subobj/test', 'subobj/test', 'test']
            }
        ])
    })

    it('paths for non-present item', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            layout: {
                path: 'nonpresent'
            }
        })
        expect(cmp.vm.pathValues).to.eql(undefined)
    })


    it('paths for empty array item', () => {

        cmp.setProps({
            context: {empty: []},
            data: {empty: []},
            layout: {
                path: 'empty'
            }
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                "jsonPointer": "/empty",
                "paths": [
                    "empty"
                ],
                "value": []
            }
        ])
    })
})
