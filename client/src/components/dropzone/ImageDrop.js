import React from 'react';
import { useDropzone } from 'react-dropzone';
import "./dropzone.css"

function Dropzone({ onDrop, accept }) {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept,
    onDrop
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p className="dropzone-content"><b>Chose a file</b> or drag it here.</p>
          ) : (
            <p className="dropzone-content">
              Chose a file or drag it here.
            </p>
          )}
        </div>
      </div>
      <aside>
        <ul>{files}</ul>
      </aside>
    </div>
  );
}

export default Dropzone;
