import React from 'react';

import {
    StyleSheet,
    LayoutAnimation
} from 'react-native';

import CustomOption from './CustomOption';
import CustomOptionAnimated from './CustomOptionAnimated';

function sticky(arr = [], key) {
    let tagIndex;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].key === key) {
            tagIndex = i;
            break;
        }
    }
    let tag = arr.splice(tagIndex, 1);
    arr.unshift(tag[0]);
    return arr;
}

function remove(arr = [], key) {
    return arr.filter(v => v.key !== key);
}

function stateOptions(fn, key) {
    LayoutAnimation.easeInEaseOut();
    this.setState(function(state) {
        return {
            options: fn(state.options, key)
        };
    });
}

const keys = [
    'Swipe out from right to left',
    'Swipe out from left to right',
    'Swipe out two options from left to right',
    'Swipe out both left and right',
    'Swipe out with custom component',
    'Swipe out custom component with animation'
];

export default function() {

    return [
        /**
         * Swipe out from right to left
         */
        {
            key: keys[0],
            style: styles.swipe,
            right: {
                text: 'Cancel',
                style: {
                    backgroundColor: '#ccc'
                },
                underlayColor: '#666',
                activeOpacity: 0.5,
                onPress: () => {
                    console.log('Cancel');
                }
            },
        },

        /**
         * Swipe out from left to right
         */
        {
            key: keys[1],
            style: styles.swipe,
            left: {
                text: 'Sticky',
                style: {
                    backgroundColor: '#44b549'
                },
                onPress: (option, animtedValue) => {
                    stateOptions.call(this, sticky, keys[1]);
                }
            }
        },

        /**
         * Swipe out two options from left to right
         */
        {
            key: keys[2],
            style: styles.swipe,
            right: [{
                text: 'Delete',
                style: {
                    backgroundColor: 'red'
                },
                activeOpacity: 0.6,
                onPress: (option, animtedValue) => {
                    console.log('onpress delete');
                    stateOptions.call(this, remove, keys[2]);
                }
            }, {
                text: 'Cancel',
                style: {
                    backgroundColor: '#ccc'
                }
            }]
        },

        /**
         * Swipe out both left and right
         */
        {
            key: keys[3],
            style: styles.swipe,
            left: {
                text: 'Sticky',
                style: {
                    backgroundColor: '#44b549'
                },
                onPress: (option, animtedValue) => {
                    stateOptions.call(this, sticky, keys[3]);
                }
            },
            right: [{
                text: 'Delete',
                style: {
                    backgroundColor: 'red'
                },
                onPress: (option, animtedValue) => {
                    stateOptions.call(this, remove, keys[3]);
                }
            }, {
                text: 'Cancel',
                style: {
                    backgroundColor: '#ccc'
                }
            }]
        },

        /**
         * Swipe out with custom component
         */
        {
            key: keys[4],
            style: [styles.swipe, styles.custom],
            right: {
                component: (props) => {
                    return (
                        <CustomOption {...props} onPressDelete={() => {
                            props.hide();
                            stateOptions.call(this, remove, keys[4]);
                        }}/>
                    );
                },
                style: {
                    width: 80
                }
            }
        },

        /**
         * Swipe out custom component with animation
         */
        {
            key: keys[5],
            style: [styles.swipe, styles.custom],
            right: {
                component: (props) => {
                    return (
                        <CustomOptionAnimated {...props} onPressDelete={() => {
                            props.hide();
                            stateOptions.call(this, remove, keys[5]);
                        }}/>
                    );
                },
                style: {
                    width: 80
                }
            }
        }
    ];
}


const styles = StyleSheet.create({
    swipe: {
        height: 44,
        marginTop: 16,
        justifyContent: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
        borderBottomColor: '#ccc',
        backgroundColor: '#fff'
    },
    custom: {
        height: 80
    }
});