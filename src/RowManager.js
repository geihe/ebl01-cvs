import {ageInSeconds} from "./helper/helper";

export class RowManager {
  constructor(rows = []) {
    this.rows = rows;
    this.log = sel => sel.log; //StandardLogfunktion
  }

  //fügt eine laufende Nummer zu row hinzu
  addNr() {
    return new RowManager(this.rows.map(
      (c, index) => ({...c, nr: index + 1}))
    );
  }

  //filtert die abgeschlossenen Experimente (Enddatum vorhanden) heraus
  complete() {
    return new RowManager(
      this.rows.filter(row => row.end).map(r => ({...r, data: JSON.parse(r?.data)}))
    );
  }

  //filtert Gruppenid heraus
  group(id) {
    return new RowManager(this.rows.filter(
      row => row.group_id === `${id}`
    ));
  }

  //sortiert nach Datum, true - neuestes Datum zuerst
  sortDate(desc = false) {
    return new RowManager(this.rows.sort(
      (a, b) => (new Date(a.start) - new Date(b.start)) * (desc ? -1 : 1)
    ));
  }

  getSingeLog(fbFunc) {
    const {sel: selFunc, log: logFunc = this.log} = fbFunc;
    return this.rows.map(row => {
      const {nr} = row;
      const sel = selFunc(row.data);
      const log = logFunc(sel);
      return {nr, log};
    })
  }

  //filtert die letzten days Tage nach Startdatum (end=false) oder Enddatum (end=true)
  filterDays(days, end = true) {
    const dayCondition = (days, dateString) => ageInSeconds(dateString) < days * 24 * 3600;
    return new RowManager(this.rows.filter(
      row => dayCondition(days, end ? row.end : row.start)
    ));
  }
}