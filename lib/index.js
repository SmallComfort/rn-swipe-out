import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    PanResponder,
    Easing,
    Animated,
} from 'react-native';

import {
    emptyFn,
    filterContainerStyle,
    filterSelfStyle,
    filterBackGroundColor,
    toArray
} from './util';

import {
    setOptions,
    setOptionsWidth,
    setActionThreshold,
    setSnapVelocity,
    setInterpolation
} from './state';

import Touchable from './Touchable';

class Swipeout extends React.Component {
    state = {
        /**
         * The left options config, based on `this.props.left`
         */
        left: [],

        /**
         * The left options total width
         */
        leftWidth: 0,

        /**
         * The threshold to finish the transform animation to trigger left options
         */
        leftActionThreshold: 0,

        /**
         * The right options config, based on `this.props.right`
         */
        right: [],

        /**
         * The right options total width
         */
        rightWidth: 0,

        /**
         * The threshold to finish the transform animation to trigger right options
         */
        rightActionThreshold: 0,

        /**
         * If the `gestureState.vx` greater than `this.state.snapVelocity`,
         * The `Swipeout` component would perform animation to trigger swipe options.
         */
        snapVelocity: 0.3,

        /**
         * A collection of interpolate config for all the `Animated.View`
         * Use this to config the gesture animation for left/right/children
         */
        interpolation: {}
    };

    /**
     * To record the absolute distance of the gesture
     */
    panAnimValue = 0;

    /**
     * All of the `Animated.View` use this instance to perform Animation
     * The animation value base on the `this.panAnimValue`
     */
    panAnim = new Animated.Value(this.panAnimValue);

    /**
     * We split `this.panResponderObject` from `PanResponder.create()`, As a separate
     * reference. Because `Touchable` component would use this reference to animated
     * self. Thus in the swipeout options our gesture can get equally effective
     */
    panResponderObject = {
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
            this.panAnim.setValue(this.panAnimValue + gestureState.dx);
        },
        onPanResponderEnd: (event, gestureState) => {
            this.onPanResponderEndTrans(event, gestureState);
        },
        onPanResponderTerminate: (event, gestureState) => {
            this.onPanResponderEndTrans(event, gestureState);
        },
        onPanResponderTerminationRequest: (event, gestureState) => {
            return true;
        },
        onShouldBlockNativeResponder: (event, gestureState) => {
            return false;
        }
    };

    panHandlers = PanResponder.create(this.panResponderObject).panHandlers;

    onPanResponderEndTrans = (event, gestureState) => {
        this.panAnimValue += gestureState.dx;

        if (this.panAnimValue <= this.state.leftActionThreshold &&
            this.panAnimValue >= -this.state.rightActionThreshold) {
                if (gestureState.vx >= this.state.snapVelocity) {
                    if (this.panAnimValue <= 0) {
                        this.performAnimation(0);
                    } else {
                        this.performAnimation(this.state.leftWidth);
                    }
                } else if (gestureState.vx < -this.state.snapVelocity) {
                    if (this.panAnimValue > 0) {
                        this.performAnimation(0);
                    } else {
                        this.performAnimation(-this.state.rightWidth);
                    }
                } else {
                    this.performAnimation(0);
                }
        } else if (this.panAnimValue < -this.state.rightActionThreshold) {
            if (gestureState.vx >= this.state.snapVelocity) {
                this.performAnimation(0);
            } else {
                this.performAnimation(-this.state.rightWidth);
            }
        } else if (this.panAnimValue > this.state.leftActionThreshold) {
            if (gestureState.vx < -this.state.snapVelocity) {
                this.performAnimation(0);
            } else {
                this.performAnimation(this.state.leftWidth);
            }
        }
    };

    performAnimation = (value = 0) => {
        const cachePanAnimValue = this.panAnimValue;
        this.panAnimValue = value;

        Animated.timing(this.panAnim, {
            toValue: value,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
        }).start(() => {
            if (value > 0) {
                this.props.onOpen('left');
            } else if (value < 0) {
                this.props.onOpen('right');
            } else if (value === 0){
                if (cachePanAnimValue > 0) {
                    this.props.onClose('left');
                } else if (cachePanAnimValue < 0) {
                    this.props.onClose('right');
                }
            }
        });
    };

    onPressOption = (v) => {
        v.onPress && v.onPress(v, this.panAnim);
        this.performAnimation(0);
    };
    onPressInOption = (v) => {
        v.onPressIn && v.onPressIn(v, this.panAnim);
    };
    onPressOutOption = (v) => {
        v.onPressOut && v.onPressOut(v, this.panAnim);
    };
    onLongPressOption = (v) => {
        v.onLongPress && v.onLongPress(v, this.panAnim);
    };

    onPressChildren = (i) => {
        this.panAnimValue === 0 && this.props.onPress(i, this.panAnim);
        this.performAnimation(0);
    };
    onPressInChildren = (i) => {
        this.panAnimValue === 0 && this.props.onPressIn(i, this.panAnim);
    };
    onPressOutChildren = (i) => {
        this.panAnimValue === 0 && this.props.onPressOut(i, this.panAnim);
    };
    onLongPressChildren = (i) => {
        this.panAnimValue === 0 && this.props.onLongPress(i, this.panAnim);
    };

    renderLeftOptions = (options) => {
        return (
            <Animated.View style={[styles.optionWrapper, {
                left: -this.state.leftWidth,
                width: this.state.leftWidth,
                transform: [{
                    translateX: this.panAnim.interpolate(this.state.interpolation.left)
                }]
            }]}>
                {options.map((v, i) => {
                    return v && this.renderCommonOption(v, i);
                })}
            </Animated.View>
        );
    }

    renderRightOptions = (options) => {
        return (
            <Animated.View style={[styles.optionWrapper, {
                right: -this.state.rightWidth,
                width: this.state.rightWidth,
                transform: [{
                    translateX: this.panAnim.interpolate(this.state.interpolation.right)
                }]
            }]}>
                {options.map((v, i) => {
                    return v && this.renderCommonOption(v, i);
                })}
            </Animated.View>
        );
    }

    renderCommonOption = (option, index) => {
        let optionStyle, filterBackGroundColorStyle;
        if (option.style) {
            optionStyle = StyleSheet.flatten(option.style);
            filterBackGroundColorStyle = filterBackGroundColor(optionStyle);
        }
        if (typeof option.component === 'function') {
            return (
                <option.component key={index} hide={() => this.performAnimation(0)} animatedValue={this.panAnim} />
            );
        }
        return (
            <Touchable
                panResponderObject={this.panResponderObject}
                onPress = {() => this.onPressOption(option)}
                onPressIn = {() => this.onPressInOption(option)}
                onPressOut = {() => this.onPressOutOption(option)}
                onLongPress = {() => this.onLongPressOption(option)}
                underlayColor = {option.underlayColor}
                activeOpacity = {option.activeOpacity}
                style={[
                    styles.option,
                    optionStyle && optionStyle.backgroundColor && {backgroundColor: optionStyle.backgroundColor},
                    index === 0 && {borderLeftWidth: 0}
                ]}
                key={index}
            >
                <Text style={[styles.text, filterBackGroundColorStyle]}>{option.text}</Text>
            </Touchable>
        );
    }

    renderChildren = (children, key) => {
        return (
            <Animated.View key={key} style={[styles.flexGrow, {
                transform: [{
                    translateX: this.state.left.length === 0 &&
                        this.state.right.length === 0 ? 0 : this.panAnim.interpolate(this.state.interpolation.children)
                }],
            }]}>
                <Touchable style={[styles.flexGrow, filterContainerStyle(this.props.style)]}
                    panResponderObject={this.panResponderObject}
                    onPress={() => this.onPressChildren(key)}
                    onPressIn={() => this.onPressInChildren(key)}
                    onPressOut={() => this.onPressOutChildren(key)}
                    onLongPress={() => this.onLongPressChildren(key)}
                    underlayColor = {this.props.underlayColor}
                    activeOpacity = {this.props.activeOpacity}
                >
                    {children}
                </Touchable>
            </Animated.View>
        );
    }

    componentWillMount() {
        this.setState(setOptions);
        this.setState(setOptionsWidth);
        this.setState(setActionThreshold);
        this.setState(setSnapVelocity);
        this.setState(setInterpolation);
    }

    render() {
        return (
            <View style={[styles.container, filterSelfStyle(this.props.style)]}>
                {this.state.left.length > 0 ? this.renderLeftOptions(this.state.left) : null}
                {this.state.right.length > 0 ? this.renderRightOptions(this.state.right) : null}
                {toArray(this.props.children).map((v, i) => this.renderChildren(v, i))}
            </View>
        );
    }
}

Swipeout.propTypes = {
    style: View.propTypes.style,
    left: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]),
    right: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]),
    snapVelocity: React.PropTypes.number,
    optionWidth: React.PropTypes.number,
    actionThreshold: React.PropTypes.number,
    useNativeDriver: React.PropTypes.bool,
    onPress: React.PropTypes.func,
    onPressIn: React.PropTypes.func,
    onPressOut: React.PropTypes.func,
    onLongPress: React.PropTypes.func,
    onOpen: React.PropTypes.func,
    onClose: React.PropTypes.func,
    underlayColor: React.PropTypes.string,
    activeOpacity: React.PropTypes.number,

    /**
     * unopen
     */
    leftActionThreshold: React.PropTypes.number,
    rightActionThreshold: React.PropTypes.number,
};

Swipeout.defaultProps = {
    style: {},
    left: [],
    right: [],
    snapVelocity: 0.3,
    optionWidth: 64,
    actionThreshold: 0.5,
    useNativeDriver: true,
    onPress: emptyFn,
    onPressIn: emptyFn,
    onPressOut: emptyFn,
    onLongPress: emptyFn,
    onOpen: emptyFn,
    onClose: emptyFn,
    underlayColor: '',
    activeOpacity: 1
};

Swipeout.Touchable = Touchable;

const styles = StyleSheet.create({
    flexGrow: {
        flexGrow: 1
    },
    container: {
        position: 'relative',
        overflow: 'hidden'
    },
    optionWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        flexDirection: 'row'
    },
    option: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#fff',
        borderLeftWidth: StyleSheet.hairlineWidth,
    },
    text: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center'
    }
});

export default Swipeout;
export {Touchable};