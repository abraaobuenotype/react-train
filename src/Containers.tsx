import styled from 'styled-components'

const Flex = styled('div')`
    display: flex;
    flex-grow: 1;
`

const Box = styled('div')`
    width: 100%;
    display: Flex;
    justify-content: center;
`

const ExternalContainer = styled('div')`
    ${({ width }) => {
        return `
            width: ${width || '100%'};
            display: flex;
            flex-wrap: wrap;
        `
    }}
`

const ArrowContainer = styled('div')`
    display: flex;
    cursor: pointer;
`

const ChildrenContainer = styled('div')`
    display: flex;
    flex-grow: 1;
    overflow-x: hidden;
`

const ContainerChild = styled('div')`
    ${({ width }) => {
        let value = (Math.random() * 0xff) | 0
        let grayscale = (value << 16) | (value << 8) | value
        let color = '#' + grayscale.toString(16)

        return `
        width: ${width}px;
        display: flex;
        flex-shrink: 0;
        flex-basis: 1;
        background-color: ${color}
        cursor: pointer;
        justify-content: center;
        align-items: center;
        `
    }}
`

export { Flex, Box, ExternalContainer, ArrowContainer, ChildrenContainer, ContainerChild }
