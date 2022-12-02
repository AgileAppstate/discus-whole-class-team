import React from 'react';
import { useDropzone } from 'react-dropzone';
import './dropzone.css';

function Dropzone({ onDrop, accept }) {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, open } = useDropzone({
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
          <button type="button" onClick={open} className="btn">
            {isDragActive ? (
              <p className="dropzone-content">Choose a file or drag it here.</p>
            ) : (
              <p className="dropzone-content">Choose a file or drag it here.</p>
            )}
          </button>
        </div>
      </div>
      <aside>
        <ul>{files}</ul>
      </aside>
    </div>
  );
}

export default Dropzone;
