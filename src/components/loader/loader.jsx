import React from 'react';
import "./loader.scss";

const Loader = ({ status = 'Loading...', className = '' }) => {
  return (
      <div className={`loader-wrapper-center ${className}`}>
        <div className={`los-custom-loading`}>
          <div className="loader"></div>
          <div dangerouslySetInnerHTML={{__html:status}}></div>
        </div>
      </div>
  )
}
export default Loader;