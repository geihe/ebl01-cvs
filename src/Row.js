import {average} from "./helper/helper";
import {times} from "./times";

export class Row {
  constructor(row = {}) {
    this.row = row;
    this.data = row.data || [];
    console.log(this.row);

    this.idFirst = frameId => (this.data.find(f => f.id === frameId) || {});
    this.idSecond = frameId => this.data.filter(f => f.id === frameId)[1];
    this.idLast = frameId => {
      const filtered = this.data.filter(f => f.id === frameId);
      const length = filtered.length;
      return length > 0 ? filtered[length - 1] : null;
    };
    this.compFirst = compId => (this.data.find(f => f.component === compId) || {});
    this.IdFilter = frameId => this.data.filter(f => f.id === frameId);
  }

  csv() {
    return {
      nr: this.row.nr,
      ...this.meta(),
      ...this.demographics(),
      ...this.times(),
      ...this.preTest(),
      ...this.examples(),
      ...this.fss(),
      ...this.cl(),
      ...this.jol(),
      ...this.postText(),
      ...this.postValidate(),
      ...this.postYesNo(),
      ...this.postMultipleChoice(),
      ...this.feedback(),
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
    const anzahlInstructionTest = this.IdFilter("InstructionTest").length;
    const data = this.data[0];
    const ernst = !this.idFirst("Ernsthaft").log
      .includes('nicht');

    return {
      META_gruppe: data.group,
      META_gruppeID: data.groupId,
      META_anzahlInstruktionsTest: anzahlInstructionTest,
      META_ernsthaft: ernst
    }
  }

  times() {//TODO
    const zeiten= times(this.data);
    const prepare=zeiten.map(z=> ({
      [`TIME_${z.name}`]: z.minutes,
    }));
    return Object.assign({}, ...prepare);
  }

  feedback() {
    const stoerung = this.idFirst('Störung').log.rating;
    const konz = this.idFirst('Konzentration').log.rating;
    const allg = this.idFirst('Feedback').log.feedbackAllgemein;
    const neu = this.idFirst('IstStudieNeu').log
      .includes('NICHT') ? 'ja' : 'nein';
    const hilfe = this.idFirst('Hilfsmittel').log
      .includes('Ja');
    const schwierig = this.compFirst('En').log
      .includes('Ja');
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

  fss() { //Flow Short Scale
    const ids1 = ['fss_1', 'fss_2', 'fss_3', 'fss_4', 'fss_5', 'fss_6', 'fss_7',];
    const ids2 = ['fss_8', 'fss_9', 'fss_10'];
    //Durch einen Fehler haben die cl-Items auch die id fss_
    //fss_1-7 gibt es 8 mal, index 0,2,4,6 sind cl, index 1,3,5,7 sind tatsächlich fss
    //fss_8-10 sind normal, da es nur 7 cl-Items gab

    const fss1 = ids1.map(id => {
      const values = this.IdFilter(id).map(v => v.log.rating);
      const slice = [1, 3, 5, 7].map(i => values[i]);
      return average(slice);
    });
    const fss2 = ids2.map(id => {
      const values = this.IdFilter(id).map(v => v.log.rating);
      return average(values);
    });
    const fss = [...fss1, ...fss2];

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

  cl() { //cognitive load
    const paas = this.IdFilter('cognitive effort').map(p => p.log.rating);
    const ids = ['fss_1', 'fss_2', 'fss_3', 'fss_4', 'fss_5', 'fss_6', 'fss_7',];
    const clArray = ids.map(id => {
      const values = this.IdFilter(id).map(v => v.log.rating);
      const cl = [0, 2, 4, 6].map(i => values[i]);
      return average(cl);
    });
    const icl_1 = clArray[0];
    const icl_2 = clArray[1];
    const gcl_1 = clArray[2];
    const gcl_2 = clArray[3];
    const ecl_1 = clArray[4];
    const ecl_2 = clArray[5];
    const ecl_3 = clArray[6];
    return {
      CL17: average(paas),
      icl_1, icl_2, icl: average([icl_1, icl_2]),
      gcl_1, gcl_2, gcl: average([gcl_1, gcl_2]),
      ecl_1, ecl_2, ecl_3, ecl: average([ecl_1, ecl_2, ecl_3]),

    };
  }

  jol() {
    const jolIds = [
      'JoL1',
      'JoL2',
      'JoL3',
      'JoL4',
    ];

    const items = jolIds.map(itemId => this.idFirst(itemId).log.percent);
    const JOL_1=items[0];
    const JOL_2=items[1];
    const JOL_3=items[2];
    const JOL_4=items[3];

      return {
        JOL_1, JOL_2, JOL_3, JOL_4, JOL: average([JOL_1, JOL_2, JOL_3, JOL_4])
      };
  }

  examples() {//TODO
    const exFrames=this.data.filter(d=>d.id?.includes('Examples_'));
    const summarys = exFrames.map(f => f.log.summary);
    const validCount = summarys.reduce((sum, cur) => sum + cur.validCount, 0);
    const totalCount = summarys.reduce((sum, cur) => sum + cur.totalCount, 0);
    return {EX_max32: validCount};
  }

  preTest() {
    const preTestIds = [
      'pre1step_2',
      'pre1step_3',
      'pre1step_1',
      'pre1step_4',
      'preMulti_4',
      'preMulti_1',
      'preMulti_2',
      'preMulti_3',
      'postMC_1',
      'postMC_3',
      'postMC_6',
      'postMC_7',
    ];

    const items = preTestIds.map(itemId => {
      const selection = this.idFirst(`Test_${itemId}`);
      return {
        [`PRE_${itemId}_R`]: selection.log.response,
        [`PRE_${itemId}_V`]: selection.log.valid
      }
    });
    return Object.assign({}, ...items);
  }

  postText() {
    const postTextIds = [
      'postConceptNew_1',
      'postConceptNew_2',
      'postConceptNew_3',
      'postConceptNew_4',
      'postOpen_1',
      'postOpen_2',
    ];
    const items = postTextIds.map(itemId => {
      const selection = this.idFirst(`Test_${itemId}`);
      return {
        [`POST_${itemId}_R`]: selection.log.response,
      }
    });
    return Object.assign({}, ...items);
  }

  postValidate() {
    const postValididatorIds = [
      ['postMC_1', 'postMC_3', 'postMC_6', 'postMC_7'],
      ['postMC_1_draw3', 'postMC_3_draw3', 'postMC_6_draw3', 'postMC_7_draw3'],
      ['postNT2step_1', 'postNT2step_2', 'postNT2step_3', 'postNT2step_4'],
      ['postFT2step_1', 'postFT2step_2', 'postFT2step_3', 'postFT2step_4'],
    ].flat();

    const items = postValididatorIds.map(itemId => {
      const selection = this.idLast(`Test_${itemId}`);
      return {
        [`POST_${itemId}_R`]: selection.log.response,
        [`POST_${itemId}_V`]: selection.log.valid
      }
    });
    return Object.assign({}, ...items);
  }

  postYesNo() {
    const
      postYesNoIds = [
        ['pz-rvt1', 'pz-rvt2', 'pz-rvt3', 'pz-rvt4', 'pz-rvt5', 'pz-rvt6', 'pz-rvt7', 'pz-rvt8'],
        ['lw-rvt1', 'lw-rvt2', 'lw-rvt3', 'lw-rvt4', 'lw-rvt5', 'lw-rvt6', 'lw-rvt7', 'lw-rvt8'],
      ].flat();

    const items = postYesNoIds.map(itemId => {
      const selection = this.idFirst(`Test_${itemId}`);
      return {
        [`POST_${itemId}_R`]: selection.log.response.answer,
        [`POST_${itemId}_V`]: selection.log.valid,
        [`POST_${itemId}_sicher15`]: selection.log.response.rating,
      }
    });
    return Object.assign({}, ...items);
  }

  postMultipleChoice() {
    const postMultipleChoiceIds = [
      ['postConcept_1', 'postConcept_2', 'postConcept_3', 'postConcept_4'],
    ].flat();

    const items = postMultipleChoiceIds.map(itemId => {
      const selection = this.idFirst(`Test_${itemId}`);
      return {
        [`POST_${itemId}_R`]: selection.log.response.value,
        [`POST_${itemId}_V`]: selection.log.valid
      }
    });
    return Object.assign({}, ...items);

  }
}
