import {
	UIManager,
	AppRegistry,
} from 'react-native';

//import SwipeoutDemo from './example/basic';
import SwipeoutDemo from './example/complete';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

AppRegistry.registerComponent('swipeout', () => SwipeoutDemo);
