import React from 'react';

import PropTypes from 'prop-types';

import {
    PanResponder,
    View,
    StyleSheet
} from 'react-native';

class Touchable extends React.Component {

    _timestamp = -1;
    _timer = 0;
    _ref = null;

    _setRef = (ref) => {
        this._ref = ref;
    };

    _flatStyle = StyleSheet.flatten(this.props.style);

    _setActiveOpacity = () => {
        if (this._ref) {
            this._ref.setNativeProps({
                style: {
                    opacity: this.props.activeOpacity
                }
            });
        }
    };

    _recoverByActiveOpacity = () => {
        if (this._ref) {
            this._ref.setNativeProps({
                style: {
                    opacity: this._flatStyle.opacity ? this._flatStyle.opacity : 1
                }
            });
        }
    };

    _setUnderlayColor = () => {
        if (this.props.underlayColor && this._ref) {
            this._ref.setNativeProps({
                style: {
                    backgroundColor: this.props.underlayColor
                }
            });
        }
    };

    _recoverByUnderlayColor = () => {
        if (this._ref) {
            this._ref.setNativeProps({
                style: {
                    backgroundColor: this._flatStyle.backgroundColor || 'transparent'
                }
            });
        }
    };

    _onPress = (...args) => {
        this.props.onPress(...args);
    };

    _onPressIn = (...args) => {
        this._setActiveOpacity();
        this._setUnderlayColor();
        this.props.onPressIn(...args);
    };

    _onPressOut = (...args) => {
        this._recoverByActiveOpacity();
        this._recoverByUnderlayColor();
        this.props.onPressOut(...args);
    };

    _onLongPress = (...args) => {
        this.props.onLongPress(...args);
    };

    _panResponderObject = {
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event, gestureState) => {
            /**
             * onPressIn onLongPress
             */
            this._timestamp = event.timeStamp;
            this._onPressIn(event, gestureState);
            clearInterval(this._timer);
            this._timer = setTimeout(() => {
                if (this._timestamp !== -1) {
                    this._onLongPress && this._onLongPress(event, gestureState);
                }
            }, 500);
        },
        onPanResponderRelease: (event, gestureState) => {
            /**
             * onPress onPressOut
             */
            if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.vx) < 0.1) {
                if (event.timeStamp - this._timestamp < 300) {
                    this._onPress(event, gestureState);
                }
            }
            setTimeout(() => this._onPressOut(event, gestureState), 10);
            this._timestamp = -1;
        }
    };

    render() {
        return (
            <View ref={(_ref) => this._setRef(_ref)} style={this.props.style} {...PanResponder.create(Object.assign({}, this.props.panResponderObject, this._panResponderObject)).panHandlers}>
                {this.props.children}
            </View>
        );
    }
}

Touchable.propTypes = {
    style: View.propTypes.style,
    activeOpacity: PropTypes.number,
    underlayColor: PropTypes.string,
    onPressIn: PropTypes.func,
    onPress: PropTypes.func,
    onPressOut: PropTypes.func,
    onLongPress: PropTypes.func
};

Touchable.defaultProps = {
    activeOpacity: 1,
    underlayColor: '',
    onPressIn: function() {},
    onPress: function() {},
    onPressOut: function() {},
    onLongPress: function() {},
};

export default Touchable;