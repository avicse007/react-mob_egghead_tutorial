import { observable, computed } from "mobx";
import { observer } from "mobx-react";
import ReactDOM from "react-dom";
import React from "react";
//import  DevTools from "mobx-devtools";

class Temprature {
  @observable unit = "C";
  @observable tempratureCelcius = 25;

  @computed get tempratureKelvin() {
    console.log("Calcculating celcius");
    return this.tempratureCelcius * (9 / 5) + 32;
  }

  @computed get tempratureFarenheit() {
    console.log("Calcculating Farenheit");
    return this.tempratureCelcius + 273.4;
  }

  @computed get temprature() {
    console.log("Calcculating temprature");
    switch (this.unit) {
      case "K":
        return this.tempratureKelvin + "*K";
      case "F":
        return this.tempratureFarenheit + "*F";
      case "C":
        return this.tempratureCelcius + "*C";
      default:
        console.log("Indefault");
        break;
    }
  }
}

const t = new Temprature();
window["t"] = t;
const App = observer(({ temprature }) => <div>{temprature.temprature}</div>);

ReactDOM.render(<App temprature={t} />, document.getElementById("root"));
