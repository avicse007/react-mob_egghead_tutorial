import { observable } from "mobx";
import { observer } from "mobx-react";
import { Component } from "react";
import React from "react";
import ReactDOM from "react-dom";

const appStore = observable({
  count: 0
});

appStore.increment = function() {
  this.count++;
};

appStore.decrement = function() {
  this.count--;
};

@observer
class Counter extends Component {
  render() {
    return (
      <div>
        Counter {this.props.store.count} <br />
        <button onClick={this.handleInc}> + </button>
        <button onClick={this.handleDec}> - </button>
      </div>
    );
  }

  handleInc = () => {
    this.props.store.increment();
  };

  handleDec = () => {
    this.props.store.decrement();
  };
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter store={appStore} />, rootElement);
