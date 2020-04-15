import {
  observable,
  computed,
  action,
  transaction,
  configure,
  extendObservable,
  asMap
} from "mobx";
import { observer } from "mobx-react";
import ReactDOM from "react-dom";
import React from "react";

configure({
  enforceActions: true
});

//const DevTools = mobxDevtools.default;

class Temprature {
  id = Math.random();
  @observable unit = "C";
  @observable tempratureCelcius = 25;
  @observable location = "Noida";
  @observable loading = true;

  constructor(location) {
    this.location = location;
    this.myfetch();
  }
  //
  @action myfetch() {
    const appId = "tester";
    window
      .fetch(
        `https://samples.openweathermap.org/data/2.5/weather?q=${
          this.location
        }&appid=${appId}`
      )
      .then(res => res.json)
      .catch(error => {
        return "500";
      })
      .then(
        action(json => {
          console.log("json", json.main);
          this.tempratureCelcius = Math.random() * json - 273.15;
          this.loading = false;
        })
      );
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
window["temps"] = temps;
window["observable"] = observable;
window["transaction"] = transaction;
const App = observer(({ tempratures }) => (
  <ul>
    <TempratureInputs tempratures={tempratures} />
    {tempratures.map(t => (
      <Tview key={t.id} tempratures={t} />
    ))}
  </ul>
));

@observer
class TempratureInputs extends React.Component {
  @observable inputs = "";
  render() {
    return (
      <li>
        Destination : :
        <input onChange={this.onChange} value={this.inputs} />
        <button onClick={this.onSubmit}>Add</button>
      </li>
    );
  }

  @action onChange = e => {
    this.inputs = e.target.value;
  };

  @action onSubmit = () => {
    this.props.tempratures.push(new Temprature(this.inputs));
    if (this.inputs.length == 10) this.inputs = "";
    this.inputs += "abcdefghijklmnopqrstuvwxyz".charAt(
      Math.floor(Math.random() * 10)
    );
  };
}

@observer
class Tview extends React.Component {
  @action onTempratureClick = () => {
    this.props.tempratures.inc();
  };
  render() {
    const t = this.props.tempratures;
    return (
      <li onClick={this.onTempratureClick}>
        {t.location} : {t.loading ? "loading ...." : t.temprature}
      </li>
    );
  }
}

ReactDOM.render(<App tempratures={temps} />, document.getElementById("root"));
