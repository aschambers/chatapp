import React, { useEffect, useRef } from 'react';
import usregion from '../../assets/images/usregion.png';
import europe from '../../assets/images/europe.png';
import russia from '../../assets/images/russia.png';
import './RegionModal.css';

const RegionModal = (props) => {
  const ref = useRef();
  useOnClickOutside(ref, () => props.setIsChangingRegion(false));

  return (
    <div ref={ref} className="regionmodal">
      <h1 className="regionmodal-title">Select a server region</h1>
      <div className="regionmodal-container">
        <div className="regionmodal-select" onClick={() => { props.setServerRegion("US West"); }}>
          <img src={usregion} height={50} width={90} alt="server-region" />
          <span className="regionmodal-select-current">US West</span>
        </div>
        <div className="regionmodal-select" onClick={() => { props.setServerRegion("US Central"); }}>
          <img src={usregion} height={50} width={90} alt="server-region" />
          <span className="regionmodal-select-current">US Central</span>
        </div>
        <div className="regionmodal-select" onClick={() => { props.setServerRegion("US East"); }}>
          <img src={usregion} height={50} width={90} alt="server-region" />
          <span className="regionmodal-select-current">US East</span>
        </div>
      </div>
      <div className="regionmodal-container">
        <div className="regionmodal-select" onClick={() => { props.setServerRegion("Western Europe"); }}>
          <img src={europe} height={50} width={90} alt="server-region" />
          <span className="regionmodal-select-current">Western Europe</span>
        </div>
        <div className="regionmodal-select" onClick={() => { props.setServerRegion("Central Europe"); }}>
          <img src={europe} height={50} width={90} alt="server-region" />
          <span className="regionmodal-select-current">Central Europe</span>
        </div>
        <div className="regionmodal-select" onClick={() => { props.setServerRegion("Russia"); }}>
          <img src={russia} height={50} width={90} alt="server-region" />
          <span className="regionmodal-select-current">Russia</span>
        </div>
      </div>
    </div>
  );
}

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = event => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default RegionModal;