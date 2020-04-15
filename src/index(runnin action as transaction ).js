import { observable, computed, action, transaction,configure } from "mobx";
import { observer } from "mobx-react";
import ReactDOM from "react-dom";
import React from "react";
import DevTools from "mobx-react-devtools";

configure({
  enforceActions: true
});


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

  //This action call tow action and are run as
  //transaction
  @action setTempratureAndUnit(unit, degree) {
    this.setUnit(unit);
    this.setCelcius(degree);
  }
}

const t = new Temprature();
window["t"] = t;
const temps = observable([]);
temps.push(new Temprature());

window["temps"] = temps;
window["tempClass"] = new Temprature();
window["observable"] = observable;
window["transaction"] = transaction;
const App = observer(({ tempratures }) => (
  <div>
    {tempratures.map(t => (
      <div key={t.id}>{t.temprature}</div>
    ))}
  </div>
));

ReactDOM.render(<App tempratures={temps} />, document.getElementById("root"));

/*
In console try
=================
//calling action recalculate temps for unit and value 
temps[0].setCelcius(300)
index.js:27 Calcculating Farenheit
index.js:27 Calcculating temprature
300
//Calling action action re cacutales 
temps[0].setUnit('K')
index.js:27 Calcculating temprature
index.js:27 Calcculating celcius
//Now calling  two actions in action will calculate temprature only once. 
transaction(()=>{})
undefined
transaction(()=>{
temps[0].setCelcius(600);
temps[0].setUnit('F')
});
index.js:27 Calcculating temprature
index.js:27 Calcculating Farenheit

//we can combine tow actions in one action so it to run as trancation 
temps[0].setTempratureAndUnit('K',599);
index.js:27 Calcculating temprature
index.js:27 Calcculating celcius

*/

/*
We should use configure to enable only action to change state 

configure({
  enforceActions: true
});

temps[0].unit = 'K';
mobx.min.js:1 Uncaught Error: [mobx] An invariant failed, however the error is obfuscated because this is a production build.
    at invariant (mobx.min.js:1)
    at fail (mobx.min.js:1)
    at checkIfStateModificationsAreAllowed (mobx.min.js:1)
    at t.prepareNewValue (mobx.min.js:1)
    at e.write (mobx.min.js:1)
    at Temprature.set [as unit] (mobx.min.js:1)
    at <anonymous>:1:15
    


