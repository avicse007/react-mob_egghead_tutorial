import { observable, computed, action, transaction } from "mobx";
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

/*
