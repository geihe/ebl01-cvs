export class Row {
  constructor(row = {}) {
    this.row = row;
    this.data = row.data || [];
    // console.log(this.data);
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
    return this.feedback();
  }

  demographics() {
    const log = this.idFirst('Demographics').log || {};
    return {
      descr: 'DEM',
      header: ['age', 'gender', 'degree', 'nativeLanguage', 'subject'],
      values: [log.age, log.gender, log.degree, log.nativeLanguage, log.subject]
    };
  }

  meta() {
    const anzahlInstructionTest = this.filter("InstructionTest").length;
    const data = this.data[0];
    const ernst = this.idFirst("Ernsthaft").log
      .includes('nicht') ? 'nein' : 'ja';

    return ({
      descr: 'META',
      header: ['gruppe', 'gruppeID', 'anzahlInstruktionstest', 'ernsthaft'],
      values: [data.group, data.groupId, anzahlInstructionTest, ernst]
    });
  }

  feedback() {
    const stoerung = this.idFirst('Störung').log.rating;
    const konz = this.idFirst('Konzentration').log.rating;
    const allg = this.idFirst('Feedback').log.feedbackAllgemein;
    const neu = this.idFirst('IstStudieNeu').log
      .includes('NICHT') ? 'ja':'nein';
    const hilfe = this.idFirst('Hilfsmittel').log
      .includes('Ja') ? 'ja':'nein';
    const schwierig = this.compFirst('En').log
      .includes('Ja') ? 'ja':'nein';
    const schwierigText = this.idFirst('Schwierigkeiten')?.log?.feedbackSchwierigkeit;
    return ({
      descr: 'FB',
      header: ['Störung 1-9', 'Konzentration 1-9', 'feedback', 'StudieNeu', 'Hilfsmittel', 'Schwierigkeiten', 'SchwierigkeitenText'],
      values: [stoerung, konz, allg, neu, hilfe, schwierig, schwierigText]
    });
  }

}

