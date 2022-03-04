const idFirst = frameId => (data => data.find(f => f.id === frameId));
const idSecond = frameId => (data => data.filter(f => f.id === frameId)[1]);
const idLast = frameId => (data => {
  const filtered = data.filter(f => f.id === frameId);
  const length = filtered.length;
  return length > 0 ? filtered[length - 1] : null;
});
const idArray = frameId => (data => data.filter(f => f.id === frameId));
const idArrayItem = (frameId, index) => (data => data.filter(f => f.id === frameId)[index]);

const stringCompare = (a, b) => (a.descr < b.descr ? -1 : 1)

const ratingLog = sel => {
  const {min, max, percent, rating} = sel.log;
  return {min, max, percent, rating};
}


export function csv(row) {
  const rowLog = (row, logFuncObj) => {
      return row ? {descr: logFuncObj.descr, log: logFuncObj.log(logFuncObj.sel(row.data))} : {};
    };
  console.log(row);
  const d = demographics();
  const csv = rowLog(row, d);
  return csv;

}

function getLogs() {
  const rowLog = row =>
    logFuncObj => {
      return {descr: logFuncObj.descr, log: logFuncObj.log(logFuncObj.sel(row.data))};
    };

  const rowLogger = row => ({
    nr: row.nr,
    log: this.total().map(a => [].concat(a).map(rowLog(row)))
  });

  return this.rows.map(rowLogger);
}

function instructionCount() {
  return ({
    descr: 'Instruction Count',
    sel: idArray('InstructionTest'),
    log: sel => sel.length
  });
}

function demographics(row) {
  const data = idFirst('Demographics')(row);
  console.log(data);
  return ({
    descr: 'Demographics',
    header: ['age', 'gender', 'degree', 'nativeLanguage', 'subject'],
    sel: idFirst('Demographics'),
    log: sel => sel.log
  });
}

function preTestAuto() {
  const preTestIds = [
    'pre1step_1',
    'pre1step_2',
    'pre1step_3',
    'pre1step_4',
    'preMulti_4',
    'preMulti_1',
    'preMulti_2',
    'preMulti_3',
    'postMC_1',
    'postMC_3',
    'postMC_6',
    'postMC_7',
  ].map(s => `Test_${s}`);
  const ptaObj = id => ({
    descr: `pre_${id}`,
    sel: idFirst(id),
    log: sel => sel.log.valid,
  })
  return preTestIds.flat().map(ptaObj);
}

function examples() {
  const rename = sum => ({
    min: 0,
    max: sum.totalCount,
    percent: sum.percentage,
    rating: sum.validCount
  })
  return {
    descr: 'Examples',
    sel: data => data.filter(f => f.component === 'Me'),
    log: sel => sel.map(a => rename(a.log.summary)),
  }
}

function cognitivEffort() {
  return [0, 1, 2, 3].map(i =>
    ({
      descr: 'cognitive effort ' + (i + 1),
      sel: idFirst('cognitive effort', i),
      log: ratingLog
    })
  );
}

function cl() {
  const idMap = new Map([
    ["fss_1", "icl_1"],
    ["fss_2", "icl_2"],
    ["fss_3", "gcl_1"],
    ["fss_4", "gcl_2"],
    ["fss_5", "gcl_3"],
    ["fss_6", "ecl_1"],
    ["fss_7", "ecl_2"],
  ]);
  const ids = [...idMap.keys()];

  return [0, 2, 4, 6].map(i => ids.map(frameId =>
    ({
      descr: `${idMap.get(frameId)}_${i}`,
      sel: idArrayItem(frameId, i),
      log: ratingLog
    })
  )).flat().sort(stringCompare);
  ;
}

function fss() {
  const ids1 = ['fss_1', 'fss_2', 'fss_3', 'fss_4', 'fss_5', 'fss_6', 'fss_7',];
  const ids2 = ['fss_8', 'fss_9', 'fss_10'];
  const part1 = [1, 3, 5, 7].map(i => ids1.map(frameId => {
      return ({
        descr: `${frameId}_${(i - 1) / 2}`,
        sel: idArrayItem(frameId, i),
        log: ratingLog
      });
    }
  )).flat();
  const part2 = [0, 1, 2, 3].map(i => ids2.map(frameId =>
    ({
      descr: `${frameId}_${i}`,
      sel: idArrayItem(frameId, i),
      log: ratingLog
    })
  )).flat();
  return [...part1, ...part2].sort(stringCompare);
}

function jol() {
  const jolIds = ['JoL1', 'JoL2', 'JoL3', 'JoL4'];
  return jolIds.map(frameId => ({
    descr: frameId,
    sel: idFirst(frameId),
    log: ratingLog
  }))
}

function postTestText() {
  const postTestTextIds = [
    'Test_postConceptNew_1', 'Test_postConceptNew_2', 'Test_postConceptNew_3', 'Test_postConceptNew_4',
    'Test_postOpen_1', 'Test_postOpen_1'
  ]
  const pttObj = id => ({
    descr: `posttext_${id}`,
    sel: idLast(id),
    log: sel => sel.log.response,
  })
  return postTestTextIds.flat().map(pttObj);
}

function postTestAuto() {
  const postTestAutoIds = [
    ['Test_postMC_1', 'Test_postMC_3', 'Test_postMC_6', 'Test_postMC_7'],
    ['Test_postNT2step_1', 'Test_postNT2step_2', 'Test_postNT2step_3', 'Test_postNT2step_4'],
    ['Test_postFT2step_1', 'Test_postFT2step_2', 'Test_postFT2step_3', 'Test_postFT2step_4'],
    ['Test_postMC_1_draw3', 'Test_postMC_3_draw3', 'Test_postMC_6_draw3', 'Test_postMC_7_draw3'],
    ['Test_postConcept_1', 'Test_postConcept_2', 'Test_postConcept_3', 'Test_postConcept_4'],
    ['Test_pz-rvt1', 'Test_pz-rvt2', 'Test_pz-rvt3', 'Test_pz-rvt4', 'Test_pz-rvt5', 'Test_pz-rvt6', 'Test_pz-rvt7', 'Test_pz-rvt8'],
    ['Test_lw-rvt1', 'Test_lw-rvt2', 'Test_lw-rvt3', 'Test_lw-rvt4', 'Test_lw-rvt5', 'Test_lw-rvt6', 'Test_lw-rvt7', 'Test_lw-rvt8'],
  ];
  const ptaObj = id => ({
    descr: `post_${id}`,
    sel: idLast(id),
    log: sel => sel.log.valid,
  })
  return postTestAutoIds.flat().map(ptaObj);
}

function feedback() {
  const fbInstructionCount = {
    descr: 'Instruction Count',
    sel: idArray('InstructionTest'),
    log: sel => sel.length
  }
  const fbSstoerung = {
    descr: 'Störung?',
    sel: idFirst('Störung'),
    log: ratingLog,
  }
  const fbKonz = {
    descr: 'Konzentration?',
    sel: idFirst('Konzentration'),
    log: ratingLog,
  }
  const fbNeu = {
    descr: 'Studie Neu?',
    sel: idFirst('IstStudieNeu'),
    log: sel => sel.log.includes('NICHT'),
  }
  const fbAllg = {
    descr: 'Allgemeines Feedback',
    sel: idFirst('Feedback'),
    log: sel => sel.log.feedbackAllgemein,
  }
  const fbErnst = {
    descr: 'Ernsthaft teilgenommen?',
    sel: idFirst('Ernsthaft'),
    log: sel => !sel.log.includes('nicht'),
  }
  const fbHilfe = {
    descr: 'Hilfsmittel benutzt?',
    sel: idFirst('Hilfsmittel'),
    log: sel => sel.log.includes('Ja'),
  }
  const fbSchwierigkeitText = {
    descr: 'Welche Schwierigkeiten?',
    sel: idFirst('Schwierigkeiten'),
    log: sel => sel?.log?.feedbackSchwierigkeit
  }
  const fbSchwierig = {
    descr: 'Gab es Schwierigkeiten?',
    sel: data => data.find(f => f.component === 'En'),
    log: sel => sel.log.includes('Ja'),
  }

  return [
    fbInstructionCount,
    fbKonz,
    fbSstoerung,
    fbNeu,
    fbErnst,
    fbHilfe,
    fbSchwierig,
    fbSchwierigkeitText,
    fbAllg,
  ]
}


