import React from 'react';

export default function CreateTFRecord() {
  let fileReader;

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    // fileReader.onload = loadHandler;
    fileReader.onloadend = loadHandler;
    fileReader.readAsText(file);
  };

  function loadHandler(event) {
    var csv = event.target.result;
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    for (var i = 0; i < allTextLines.length; i++) {
      var data = allTextLines[i].split(';');
      var tarr = [];
      for (var j = 0; j < data.length; j++) {
        tarr.push(data[j]);
      }
      lines.push(tarr);
    }
    console.log(lines);
  }


  return (
    <div>
      <input type='file'
        id='file'
        className='input-file'
        accept='.csv'
        onChange={e => handleFileChosen(e.target.files[0])}
      />
    </div>
  )
}