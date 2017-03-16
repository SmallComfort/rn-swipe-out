import {
    StyleSheet
} from 'react-native';

const CONTAINER_STYLE = ['alignItems', 'justifyContent', 'flexDirection', 'flexWrap'];
const BACKGROUND_STYLE = ['backgroundColor'];

export function toArray(v) {
    if (!Array.isArray(v)) {
        return [v].filter(_v => !!_v);
    } else {
        return v.filter(_v => !!_v);
    }
}

export function uniqueSortArray(arr = []) {
    let uniqueArr = [];
    let item = null;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            continue;
        }
        item = arr[i];
        uniqueArr.push(item);
    }
    return uniqueArr;
}

export function emptyFn() {}

export function filterContainerStyle(style) {
    style = StyleSheet.flatten(style);
    let cStyle = {};
    CONTAINER_STYLE.map(v => {
        if (style[v]) {
            cStyle[v] = style[v];
        }
    });
    return StyleSheet.create({cStyle}).cStyle;
}

export function filterSelfStyle(style) {
    style = StyleSheet.flatten(style);
    let sStyle = Object.assign({}, style);
    CONTAINER_STYLE.map(v => {
        delete sStyle[v];
    });
    return StyleSheet.create({sStyle}).sStyle;
}

export function filterBackGroundColor(style) {
    style = StyleSheet.flatten(style);
    let bStyle = Object.assign({}, style);
    BACKGROUND_STYLE.map(v => {
        delete bStyle[v];
    });
    return StyleSheet.create({bStyle}).bStyle;
}

export function decaySeries(num = 0, count = 5, coef = 1) {
    let arr = [];
    let n = num;
    for (let i = 0; i < count; i++) {
        arr.push(n);
        if (n !== 0) {
            n = n + Math.pow(n, coef);
        }
    }
    return arr;
}

export function debounce(fn, time = 100) {
    let timer = 0;
    return function() {
        const self = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(self, args);
        }, time);
    };
}

