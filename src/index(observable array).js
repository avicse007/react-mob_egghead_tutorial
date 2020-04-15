import { observable, computed, action } from "mobx";
import { observer } from "mobx-react";
import ReactDOM from "react-dom";
import React from "react";
//import  { devTools } from "mobx-devtools";
import DevTools from "mobx-react-devtools";

class Temprature {
  id = Math.random();
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

  @action setUnit(newUnit) {
    this.unit = newUnit;
  }

  @action setCelcius(degree) {
    this.tempratureCelcius = degree;
  }

  @action("Update temprature and Unit")
  setTempratureAndUnit(degree, unit) {
    this.setCelcius(degree);
    this.setUnit(unit);
  }
}

const t = new Temprature();
window["t"] = t;
const temps = observable([]);
temps.push(new Temprature());

window["temps"] = temps;
window["tempClass"] = new Temprature();
window["observable"] = observable;
const App = observer(({ tempratures }) => (
  <div>
    {tempratures.map(t => (
      <div key={t.id}>{t.temprature}</div>
    ))}
  </div>
));

ReactDOM.render(<App tempratures={temps} />, document.getElementById("root"));
