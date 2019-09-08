import React, { useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
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

export default RegionModal;