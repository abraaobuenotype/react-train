import React, { Fragment, Component, ReactElement } from 'react'
import { TweenMax } from 'gsap/TweenMax'
import { Flex, Box, ExternalContainer, ArrowContainer, ChildrenContainer, ContainerChild } from './Containers'
import Arrow from './Arrow'

interface IArrow<P = {}> {
    (props: P, context?: any): ReactElement<P>
}

interface IProps {
    ArrowLeft?: IArrow
    ArrowRight?: IArrow
    slideToShow?: number
    width?: number | string
    selected?: number | undefined
    onChange?: (selected: number) => void
}

class Engine extends Component<IProps> {
    state = {
        widthCalculated: 10
    }

    private _childrenContainer: HTMLDivElement | null = null
    private _childs: Object = {}
    private _selected: number = 0
    private _updating: boolean = false
    private _updateWidth: boolean = false
    private _enter_frame: number | undefined = undefined
    private _tempWidth: string = ''
    private _awaitUpdate:boolean = false

    componentDidMount () {
        window.addEventListener('resize', this.onResize)
        this.onResize()
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

    clicked = (index: number) => (dispatch = true) => {
        let { onChange } = this.props
        this._selected = index

        this.centerSelected()

        if (onChange && Boolean(dispatch)) onChange(this._selected)
    }

    centerSelected = () => {
        if (this._enter_frame) {
            clearInterval(this._enter_frame)
        }

        this._enter_frame = setInterval(() => {
            if (!this._updating) {
                clearInterval(this._enter_frame)
                this._enter_frame = undefined

                let target: HTMLElement = this._childs[this._selected]
                let p: HTMLElement = target.parentElement as HTMLElement

                if(!this._childrenContainer) return

                let pos: number =
                    (this._childrenContainer.clientWidth / 2) -
                    target.offsetLeft -
                    (target.offsetWidth / 2)

                if (Math.abs(pos) > p.clientWidth - this._childrenContainer.clientWidth) {
                    pos = -(p.clientWidth - this._childrenContainer.clientWidth)
                }

                if (pos > 0) {
                    pos = 0
                }

                TweenMax.to(p, 0.3, { x: pos })
            }
        }, 1000 / 60)
    }

    calcdulateChildrenContainer = () => {
        let parent: HTMLElement = this._childrenContainer.parentElement as HTMLElement;
        let fc: HTMLElement = parent.firstChild as HTMLElement
        let lc: HTMLElement = parent.lastChild as HTMLElement

        let w = parent.clientWidth - fc.clientWidth - lc.clientWidth
        this._childrenContainer.style.width = `${w}px`

        this.setState({ widthCalculated: this.calculateChildWidth() }, () => {
            this.centerSelected()
        })
    }

    shouldComponentUpdate (next) {
        this._updating = true
        this._updateWidth = false
        if (this._childs && Object.keys(this._childs).length > 0) {
            this._childs = {}
        }        

        if(next.width != this._tempWidth){
            this._tempWidth = next.width
            this._updateWidth = true
        }

        return true
    }

    componentDidUpdate () {
        let { selected } = this.props
        this._updating = false

        if (this._childs && Object.keys(this._childs).length > 0 && selected && selected != this._selected) {
            if (this._childs[selected]) {
                this.clicked(selected)(false)
            }
        }

        if(this._updateWidth) {
            this._updateWidth = false
            if (!this._awaitUpdate){
                this._awaitUpdate = true
                setTimeout(() => {                                
                    this.calcdulateChildrenContainer()                    
                }, 1000)
            }
        }
    }

    componentWillUnmount () {
        if (this._enter_frame) {
            clearInterval(this._enter_frame)
        }
    }

    render () {
        let { ArrowLeft, ArrowRight, width } = this.props
        let { widthCalculated } = this.state

        return (
            <ExternalContainer width={width}>
                <Box>
                    <ArrowContainer onClick={this.leftClick}>
                        {ArrowLeft ? <ArrowLeft /> : <Arrow />}
                    </ArrowContainer>
                    <ChildrenContainer
                        ref={el => {
                            if (el) {
                                this._childrenContainer = el
                                // this.calcdulateChildrenContainer()
                            }
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
