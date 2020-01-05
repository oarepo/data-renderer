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
            definition: {},
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
            definition: {
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
            definition: {
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
            definition: {
                path: 'array'
            },
            paths: ['abc']
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                value: sampleDoc.array[0],
                jsonPointer: '/array/0',
                paths: ['abc/array', 'array'],
            },
            {
                value: sampleDoc.array[1],
                jsonPointer: '/array/1',
                paths: ['abc/array', 'array'],
            }
        ])
    })

    it('gets values for array item', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            definition: {
                path: 'array[*].name'
            },
            paths: ['abc']
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                value: sampleDoc.array[0].name,
                jsonPointer: '/array/0/name',
                paths: ['abc/array/name', 'array/name', 'name']
            },
            {
                value: sampleDoc.array[1].name,
                jsonPointer: '/array/1/name',
                paths: ['abc/array/name', 'array/name', 'name']
            }
        ])
    })

    it('gets values for array nested', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            definition: {
                path: 'array[*].subobj'
            },
            paths: ['abc']
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                value: sampleDoc.array[0].subobj,
                jsonPointer: '/array/0/subobj',
                paths: ['abc/array/subobj', 'array/subobj', 'subobj']
            },
            {
                value: sampleDoc.array[1].subobj,
                jsonPointer: '/array/1/subobj',
                paths: ['abc/array/subobj', 'array/subobj', 'subobj']
            }
        ])
    })

    it('gets values for array nested value', () => {

        cmp.setProps({
            context: sampleDoc,
            data: sampleDoc,
            definition: {
                path: 'array[*].subobj.test'
            },
            paths: ['abc']
        })
        expect(cmp.vm.pathValues).to.eql([
            {
                value: sampleDoc.array[0].subobj.test,
                jsonPointer: '/array/0/subobj/test',
                paths: ['abc/array/subobj/test', 'array/subobj/test', 'subobj/test', 'test']
            },
            {
                value: sampleDoc.array[1].subobj.test,
                jsonPointer: '/array/1/subobj/test',
                paths: ['abc/array/subobj/test', 'array/subobj/test', 'subobj/test', 'test']
            }
        ])
    })
})
