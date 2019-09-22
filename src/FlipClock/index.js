import "./index.css";
import React, {Component} from "react";
import {withStyles} from "@material-ui/core";

const styles = theme => ({});

class FlipCounter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            d: 0,
            h: 0,
            m: 0,
            s: 0,
            v: 10,
        }
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState(prevState => ({
            v: (prevState.v - 1 + 60) % 60,
            change: !prevState.change,
        }));
    }

    render() {
        const {v, change} = this.state;
        const old_v = (v + 1) % 60;
        const animation1 = change ? 'fold' : 'unfold';
        const animation2 = !change ? 'fold' : 'unfold';
        const number1 = change ? old_v : v;
        const number2 = !change ? old_v : v;

        return (
            <div className={'flipCounter'}>
                <div className={'upperCard'}>
                    <span>{normalize(v)}</span>
                </div>
                <div className={'lowerCard'}>
                    <span>{normalize(old_v)}</span>
                </div>
                <div className={`flipCard first ${animation1}`}>
                    <span>{normalize(number1)}</span>
                </div>
                <div className={`flipCard second ${animation2}`}>
                    <span>{normalize(number2)}</span>
                </div>
            </div>
        );
    }
}

function normalize(n) {
    if (n < 10)
        return "0" + n;
    return "" + n;
}

export default withStyles(styles, {withTheme: true})(FlipCounter);