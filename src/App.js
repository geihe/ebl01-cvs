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

  const csv=rowsComplete.map(r=>new Row(r).csv())
  console.log(csv);
  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(csv)], {type: 'application/json; charset=UTF-8'});
    element.href = URL.createObjectURL(file);
    element.download = "auswertung.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  return (
    <div className="App">
      <button onClick={downloadFile}>Download data</button>

    </div>
  );
/*  return (
    <div className="App">

    </div>
  );*/
}

export default App;
