import { createElement } from 'react';
import Subscription from './Subscription';

function makeSelectorStateful(sourceSelector, store) {
  const selector = {
    run: function(props) {
      const nextProps = sourceSelector(store.getState(), props)
      if (nextProps !== selector.props || selector.error) {
        selector.shouldComponentUpdate = true
        selector.props = nextProps
        selector.error = null
      }
    }
  }

  return selector
}


// connectAdvanced((dispatch, options) => (state, props) => ({
//   thing: state.things[props.thingId],
//   saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
// }))(YourComponent)
export default function connectAdvanced(
  selectorFactory
) {

  return function wrapWithConnect(WrappedComponent) {
    class Connect extends Component {
      constructor(props, context) {
        this.state = {};
        this.store = props.store || context.store;
        this.initSelector();
        this.initSubscription();
      }

      initSelector() {
        const sourceSelector = selectorFactory(this.store.dispatch)
        this.selector = makeSelectorStateful(sourceSelector, this.store)
        this.selector.run(this.props)
      }

      initSubscription() {
        this.subscription = new Subscription(
          this.store, 
          this.context.storeSubscription, 
          this.onStateChange.bind(this)
        )

        this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription)
      }

      render() {
        return createElement(WrappedComponent)
      }
    }
    
    return Connect;
  }
}

