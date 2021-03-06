import React from 'react'
import styled from 'styled-components'

const Arrow = props => {
    const ArrowContainer = styled('div')`
        display: block;
        position: relative;
        border-radius: 4px;
        transform: rotate(90deg)scale(0.4);
        transform-origin: center center;
        left: 50%;
        top: -40%
    `

    const Icon = styled('div')`
        ${props => {
            let { x, rot, color } = props
            return `
            position: absolute;
            background-color: transparent;
            top: 0;
            left: ${x ? x : 0};
            width: 40px;
            height: 10px;
            display: block;
            border-radius: 2px;
            transform: rotate(${rot ? rot : '45deg'});
            &:after {
                content: "";
                background-color: ${color || '#aaa'};
                width: 40px;
                height: 10px;
                display: block;
                border-radius: ${rot ? '10px 6px 6px 10px' : '6px 10px 10px 6px'};
                z-index: -1;
            }
            `
        }}
    `

    const Circle = styled('div')`
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #ccc;
        border-radius: 50%;
        transform: rotate(${props => props.rot || '0'});
    `

    return (
        <Circle rot={props.rot}>
            <ArrowContainer>
                <Icon />
                <Icon x='21px' rot='-45deg' />
            </ArrowContainer>
        </Circle>
    )
}

export default Arrow
