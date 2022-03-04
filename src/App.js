import './App.css';
import {useEffect, useState} from "react";
import {RowManager} from "./RowManager";
import {csv} from "./RowAna";
import {Row} from "./Row";


function App() {
  const baseURL = 'https://beispielbasiertes-lernen.de/rest/EBL/';
  const dataURL = baseURL + 'data.php';
  useEffect(() =>
      fetch(dataURL)
        .then(response => response.json())
        .then(data => setData(data)),
    []
  );

  const [data, setData] = useState([]);
  const rows = new RowManager(data);
  const complete = rows.complete().sortDate().addNr();
  const rowsComplete = complete.rows;

  const csvArrays=rowsComplete.map(r=>new Row(r).csv())
  const first = csvArrays[0];
  const descr=first?.descr;
  const header = first?.header.map(h => descr + '_' + h).join('~');
  const dataArray = csvArrays.map(a => a.values.join('~'));

  const csvString = header + "\n" + dataArray.join("\n");
  console.log(csvString);
  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([csvString], {type: 'text/csv;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "auswertung.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  return (
    <div className="App">
      <button onClick={downloadTxtFile}>Download data</button>

    </div>
  );
}

export default App;
