import React, { Component } from "react";
import "./CurrencyComponent.scss";
interface StateType {
  isClicked?: boolean;
}
interface PropsType {
  name?: string;
}

export default class CurrencyComponent extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      isClicked: true,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState((state) => ({
      isClicked: !state.isClicked,
    }));
  }
  render(): React.ReactNode {
    return (
      <button
        style={{ color: "green" }}
        className={this.state.isClicked ? "gold" : "silver"}
        onClick={this.handleClick}
      >
        {this.state.isClicked ? "Hi, " : "Bye"}
        {this.state.isClicked && this.props.name}
      </button>
    );
  }
}
