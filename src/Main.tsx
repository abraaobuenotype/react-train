import React, { Component, ReactElement } from 'react'
import styled from 'styled-components'
import { TweenMax } from 'gsap/TweenMax'

import Arrow from './Arrow'

interface IArrow<P = {}> {
    (props: P, context?: any): ReactElement<P>
}

interface IProps {
    ArrowLeft?: IArrow
    ArrowRight?: IArrow
    slideToShow?: number
    onChange?: (selected: number) => void
}

const ExternalContainer = styled('div')`
    ${props => {
        return `
            display: flex;
            flex-wrap: wrap;
        `
    }}
`

const Box = styled('div')`
    width: 100%;
    display: Flex;
    justify-content: center;
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
    ${props => {
        let value = (Math.random() * 0xff) | 0
        let grayscale = (value << 16) | (value << 8) | value
        let color = '#' + grayscale.toString(16)

        let { width } = props
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

const Flex = styled('div')`
    display: flex;
    flex-grow: 1;
`

class Engine extends Component<IProps> {
    state = {
        widthCalculated: 10
    }

    private _childrenContainer: HTMLDivElement | null = null
    private _childs: Object = {}
    private _selected: number = 0

    componentDidMount () {
        let { onChange } = this.props
        window.addEventListener('resize', this.onResize)
        this.onResize()

        if (onChange) onChange(this._selected)
    }

    onResize = () => {
        this.setState({ widthCalculated: this.calculateChildWidth() }, () => {
            this.centerSelected()
        })
    }

    calculateChildWidth = (): number => {
        let { slideToShow } = this.props
        let width: number = 10
        if (this._childrenContainer && slideToShow) {
            width = this._childrenContainer.clientWidth / slideToShow
        }
        return width
    }

    registerChild = (child: HTMLElement, index: number): void => {
        this._childs[index] = child
    }

    leftClick = () => {
        let { onChange } = this.props
        this._selected--

        if (this._selected < 0) {
            this._selected = 0
        }

        this.centerSelected()

        if (onChange) onChange(this._selected)
    }

    rightClick = () => {
        let { onChange } = this.props
        this._selected++
        let len = Object.keys(this._childs).length
        if (this._selected >= len) {
            this._selected = len - 1
        }

        this.centerSelected()

        if (onChange) onChange(this._selected)
    }

    clicked = (index: number) => () => {
        let { onChange } = this.props
        this._selected = index

        this.centerSelected()

        if (onChange) onChange(this._selected)
    }

    centerSelected = () => {
        let target: HTMLElement = this._childs[this._selected]
        let p: HTMLElement = target.parentElement as HTMLElement

        console.dir(target)

        let pos: number = (this._childrenContainer as HTMLElement).clientWidth / 2 - target.offsetLeft

        console.log(pos)

        if (Math.abs(pos) > p.clientWidth - (this._childrenContainer as HTMLElement).clientWidth) {
            pos = -(p.clientWidth - (this._childrenContainer as HTMLElement).clientWidth)
        }

        if (pos > 0) {
            pos = 0
        }

        TweenMax.to(p, 0.3, { x: pos })
    }

    render () {
        let { ArrowLeft, ArrowRight } = this.props
        let { widthCalculated } = this.state
        console.log(this.props)
        return (
            <ExternalContainer>
                <Box>
                    <ArrowContainer onClick={this.leftClick}>{ArrowLeft ? <ArrowLeft /> : <Arrow />}</ArrowContainer>
                    <ChildrenContainer
                        ref={el => {
                            if (el) this._childrenContainer = el
                        }}
                    >
                        <Flex>
                            {(this.props.children as Array<any>).map((el, i) => {
                                return (
                                    <ContainerChild
                                        ref={el => {
                                            if (el) {
                                                this.registerChild(el, i)
                                            }
                                        }}
                                        key={i}
                                        width={widthCalculated}
                                        onClick={this.clicked(i)}
                                    >
                                        {el}
                                    </ContainerChild>
                                )
                            })}
                        </Flex>
                    </ChildrenContainer>
                    <ArrowContainer onClick={this.rightClick}>
                        {ArrowRight ? <ArrowRight /> : <Arrow rot='180deg' />}
                    </ArrowContainer>
                </Box>
            </ExternalContainer>
        )
    }
}

export { Engine }