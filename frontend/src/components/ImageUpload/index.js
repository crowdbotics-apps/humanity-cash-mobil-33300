import React, {useEffect, useRef, useState} from 'react';
// used for making the prop types of this component
import PropTypes from 'prop-types';
import defaultAvatar from "assets/images/logo.png";

function ImageUpload(props) {
  const {mainImg, mainImage, width, height, setImage, profileImage} = props;

  const [previewImage, setPreviewImage] = useState(false);

  const imageRef = useRef();


  useEffect(() => {
    profileImage && setPreviewImage(profileImage)
  }, [profileImage])

  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    mainImage(file)
    reader.onloadend = () => {
      setPreviewImage(reader.result);

    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    imageRef.current.click();
  };

  return (
    <div className="fileinput text-center">
      <input type="file" name='myImage' onChange={handleImageChange} ref={imageRef} style={{display: 'none'}}/>
      {mainImg && (
        <img
          src={previewImage ? previewImage : defaultAvatar}
          height={height}
          width={width}
          style={{borderRadius: '50%', objectFit: 'cover'}}
        />
      )}
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button onClick={handleClick} style={styles.uploadText}>Upload Photo</button>
      </div>
    </div>
  );
}

ImageUpload.propTypes = {
  avatar: PropTypes.bool,
};

export default ImageUpload;

const styles = {
  uploadText: {
    fontWeight: "600",
    fontSize: 12,
    color: "#034EA2",
    backgroundColor: "white",
    border: 0,
    boxShadow: "none",
    outline: "none",
    paddingTop: 10
  },

}
