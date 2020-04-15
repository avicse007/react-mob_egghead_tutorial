import { observable, computed, action, transaction, configure } from "mobx";
import { observer } from "mobx-react";
import ReactDOM from "react-dom";
import React from "react";
//import  { devTools } from "mobx-devtools";
import { DevTools } from "mobx-react-devtools";
//configure({
//  enforceActions: true
//});
class Temprature {
  id = Math.random();
  @observable unit = "C";
  @observable tempratureCelcius = 25;
  constructor(temprature, unit) {
    this.unit = unit;
    this.tempratureCelcius = temprature;
  }

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

  //This action call tow action and are run as
  //transaction
  @action setTempratureAndUnit(unit, degree) {
    this.setUnit(unit);
    this.setCelcius(degree);
  }

  @action inc() {
    console.log("inc clicked");
    this.setCelcius(this.tempratureCelcius + 1);
  }
}

const t = Temprature;
window["t"] = t;
let temps = observable([]);
temps.push(new Temprature("230", "K"));
temps.push(new Temprature("20", "C"));
temps.push(new Temprature("30", "F"));

window["temps"] = temps;
window["observable"] = observable;
window["transaction"] = transaction;
const App = observer(({ tempratures }) => (
  <ul>
    {tempratures.map(t => (
      <Tview key={t.id} tempratures={t} />
    ))}
  </ul>
));

@observer
class Tview extends React.Component {
  @action onTempratureClick = () => {
    this.props.tempratures.inc();
  };
  render() {
    const t = this.props.tempratures;
    return <li onClick={this.onTempratureClick}>{t.temprature}</li>;
  }
}

ReactDOM.render(<App tempratures={temps} />, document.getElementById("root"));
