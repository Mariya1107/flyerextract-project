import React, { useRef, useState } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const TestCropper = () => {
  const cropperRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log("Selected:", url);
      setImage(url);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>🧪 Cropper Test</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && (
        <div style={{ marginTop: 20, border: '2px solid red' }}>
          <Cropper
            src={image}
            style={{ height: 400, width: '100%' }}
            aspectRatio={1}
            guides={true}
            ref={cropperRef}
            viewMode={1}
          />
        </div>
      )}
    </div>
  );
};

export default TestCropper;
