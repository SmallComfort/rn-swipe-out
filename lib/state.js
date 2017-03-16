import {
    toArray,
    decaySeries,
    uniqueSortArray
} from './util';

export function setOptions(state, props) {
    return {
        left: toArray(props.left),
        right: toArray(props.right)
    };
}

export function setOptionsWidth(state, props) {
    return {
        leftWidth: _reduceWidth(state.left, props.optionWidth),
        rightWidth: _reduceWidth(state.right, props.optionWidth)
    };
}

export function setActionThreshold(state, props) {
    const leftThreshold = props.leftActionThreshold || props.actionThreshold;
    const rightThreshold = props.rightActionThreshold || props.actionThreshold;
    const leftThresholdDistance = leftThreshold <= 1 ? state.leftWidth * leftThreshold : leftThreshold;
    const rightThresholdDistance = rightThreshold <= 1 ? state.rightWidth * rightThreshold : rightThreshold;

    return {
        leftActionThreshold: leftThresholdDistance,
        rightActionThreshold: rightThresholdDistance
    };
}

export function setSnapVelocity(state, props) {
    return {
        snapVelocity: props.snapVelocity,
        leftSnapVelocity: props.leftSnapVelocity || props.snapVelocity,
        rightSnapVelocity: props.rightSnapVelocity || props.snapVelocity,
    };
}

export function setInterpolation(state, props) {
    return {
        interpolation: _buildInterpolate(state.leftWidth, state.rightWidth)
    };
}

function _reduceWidth(arr, optionWidth) {
    return arr.map(v => {
        return v.style ? v.style.width ? v.style.width : optionWidth : optionWidth;
    }).reduce((acc, val) => {
        return acc + val;
    }, 0);
}

function _buildInterpolate(leftWidth, rightWidth) {
    const leftDecaySeriesInputRange = decaySeries(leftWidth, 30, 1);
    const leftDecaySeriesOutputRange = decaySeries(leftWidth, 30, 0.77);
    const rightDecaySeriesInputRange = decaySeries(rightWidth, 30, 1).map(v => -v).sort((v1, v2) => v1 - v2);
    const rightDecaySeriesOutputRange = decaySeries(rightWidth, 30, 0.77).map(v => -v).sort((v1, v2) => v1 - v2);
    const childrenInputRange = [...rightDecaySeriesInputRange, 0, ...leftDecaySeriesInputRange];
    const childrenOutputRange = [...rightDecaySeriesOutputRange, 0, ...leftDecaySeriesOutputRange];
    const childrenInputRangeUnique = uniqueSortArray(childrenInputRange);
    const childrenOutputRangeUnique = uniqueSortArray(childrenOutputRange);

    return {
        left: {
            inputRange: [0, leftWidth],
            outputRange: [0, leftWidth],
            extrapolate: 'clamp'
        },
        right: {
            inputRange: [-rightWidth, 0],
            outputRange: [-rightWidth, 0],
            extrapolate: 'clamp'
        },
        children: {
            inputRange: childrenInputRangeUnique,
            outputRange: childrenOutputRangeUnique,
            extrapolateRight: leftWidth === 0 ? 'clamp' : 'extend',
            extrapolateLeft: rightWidth === 0 ? 'clamp' : 'extend'
        }
    };
}