import {average} from "./helper/helper";

export class Row {
  constructor(row = {}) {
    this.row = row;
    this.data = row.data || [];
    // console.log(this.row);

    this.idFirst = frameId => (this.data.find(f => f.id === frameId) || {});
    this.idSecond = frameId => this.data.filter(f => f.id === frameId)[1];
    this.idLast = frameId => {
      const filtered = this.data.filter(f => f.id === frameId);
      const length = filtered.length;
      return length > 0 ? filtered[length - 1] : null;
    };
    this.compFirst = compId => (this.data.find(f => f.component === compId) || {});
    this.filter = frameId => this.data.filter(f => f.id === frameId);
  }

  csv() {
    return {
      ...this.demographics(),
      ...this.meta(),
      ...this.feedback(),
      ...this.fss(),
    };
  }

  demographics() {
    const log = this.idFirst('Demographics').log || {};
    return {
      DEM_age: log.age,
      DEM_gender: log.gender,
      DEM_degree: log.degree,
      DEM_nativeLanguage: log.nativeLanguage,
      DEM_subject: log.subject
    };
  }

  meta() {
    const anzahlInstructionTest = this.filter("InstructionTest").length;
    const data = this.data[0];
    const ernst = this.idFirst("Ernsthaft").log
      .includes('nicht') ? 'nein' : 'ja';

    return {
      META_gruppe: data.group,
      META_gruppeID: data.groupId,
      META_anzahlInstruktionsTest: anzahlInstructionTest,
      META_ernsthaft: ernst
    }
  }

  feedback() {
    const stoerung = this.idFirst('Störung').log.rating;
    const konz = this.idFirst('Konzentration').log.rating;
    const allg = this.idFirst('Feedback').log.feedbackAllgemein;
    const neu = this.idFirst('IstStudieNeu').log
      .includes('NICHT') ? 'ja' : 'nein';
    const hilfe = this.idFirst('Hilfsmittel').log
      .includes('Ja') ? 'ja' : 'nein';
    const schwierig = this.compFirst('En').log
      .includes('Ja') ? 'ja' : 'nein';
    const schwierigText = this.idFirst('Schwierigkeiten')?.log?.feedbackSchwierigkeit;
    return {
      FB_stoerung19: stoerung,
      FB_konzentration19: konz,
      FB_feedback: allg,
      FB_StudieNeu: neu,
      FB_Hilfsmittel: hilfe,
      FB_Schwierigkeiten: schwierig,
      FB_SchwierigkeitenText: schwierigText,
    }
  }


  fss() {
    const ids1 = ['fss_1', 'fss_2', 'fss_3', 'fss_4', 'fss_5', 'fss_6', 'fss_7',];
    const ids2 = ['fss_8', 'fss_9', 'fss_10'];
    //Durch einen Fehler haben die cl-Items auch die id fss_
    //fss_1-7 gibt es 8 mal, index 0,2,4,6 sind cl, index 1,3,5,7 sind tatsächlich fss
    //fss_8-10 sind normal, da es nur 7 cl-Items gab

    const fss1 = ids1.map(id => {
      const values = this.filter(id).map(v => v.log.rating);
      const slice = [1, 3, 5, 7].map(i => values[i]);
      return average(slice);
    });
    const fss2 = ids2.map(id => {
      const values = this.filter(id).map(v => v.log.rating);
      return average(values);
    });
    const fss=[...fss1, ...fss2];

    return {
      FSS_01: fss[0],
      FSS_02: fss[1],
      FSS_03: fss[2],
      FSS_04: fss[3],
      FSS_05: fss[4],
      FSS_06: fss[5],
      FSS_07: fss[6],
      FSS_08: fss[7],
      FSS_09: fss[8],
      FSS_10: fss[9],
      FSS: average(fss),
    }

  }
}

