import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const createRAF = function(callback) {
  let isWorking = false;
  let _callback = null;
  let animationTick = function(now) {
    if (!_callback) return;
    isWorking = true;
    _callback();
    isWorking = false;
    _callback = null;
  };
  return function(...args) {
    if (isWorking) return;
    _callback = () => callback.apply(this, args);
    requestAnimationFrame(animationTick);
  };
};

function App() {
  return (
    <div className="App">
      <List rowHeight={30} rows={10000} />
    </div>
  );
}

class List extends React.Component {
  state = {
    scrollTop: 0,
    rows: this.props.rows,
    renderRows: 15
  };
  render() {
    const { rowHeight } = this.props;
    const rows = this.state.rows;
    const lis = this._renderChildren();
    return (
      <div
        style={{
          width: 200,
          height: 300,
          overflowY: "auto",
          border: "1px solid #ccc"
        }}
        onScroll={e => {
          const target = e.target;
          this._scroll({
            scrollLeft: target.scrollLeft,
            scrollTop: target.scrollTop
          });
        }}
      >
        <div style={{ height: rows * rowHeight, position: "relative" }}>
          {lis}
        </div>
      </div>
    );
  }

  _renderChildren() {
    const { scrollTop, renderRows } = this.state;
    const { rowHeight } = this.props;
    const viewRows = renderRows;
    const startIdx = scrollTop / rowHeight;

    return Array.from({ length: viewRows }).map((r, i) => {
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            top: scrollTop + i * rowHeight,
            left: 0,
            right: 0,
            height: rowHeight
          }}
        >
          {startIdx + i}
        </div>
      );
    });
  }

  // 防止过度更新
  _scroll = createRAF(next => {
    const { rows, renderRows } = this.state;
    const { rowHeight } = this.props;
    const min = 0;
    if (next.scrollTop < min) next.scrollTop = min;
    const max = rowHeight * (rows - renderRows);
    if (next.scrollTop > max) next.scrollTop = max;
    this.setState({
      scrollTop: parseInt(next.scrollTop / rowHeight) * rowHeight
    });
  });
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
