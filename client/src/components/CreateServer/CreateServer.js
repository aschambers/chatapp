import React, { useState, useEffect, useRef } from 'react';
import useOnClickOutside from '../../utils/useOnClickOutside';
import { connect } from 'react-redux';
import * as actions from '../../redux/store';
import usregion from '../../assets/images/usregion.png';
import europe from '../../assets/images/europe.png';
import russia from '../../assets/images/russia.png';
import image from '../../assets/images/image.png';
import './CreateServer.css';

const CreateServer = (props) => {
  const [isChangingRegion, setIsChangingRegion] = useState(false);
  const [serverImageUrl, setServerImageUrl] = useState("");
  const [serverFile, setServerFile] = useState("");
  const [name, setName] = useState("");

  const mainSubmit = React.createRef();
  const mainFile = React.createRef();

  const ref = useRef();
  useOnClickOutside(ref, () => props.setModalOpen(false));

  useEffect(() => {
    if (props.createServerSuccess) {
      props.getUpdatedServerList(true);
      props.resetServerValues();
    } else if (props.createServerError) {
      props.getUpdatedServerList(false);
      props.resetServerValues();
    }
  }, [props]);

  const serverCreate = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('userId', props.id);
    formData.append('public', false);
    formData.append('region', props.region);
    if (serverFile) {
      formData.append('imageUrl', serverFile);
    }
    props.serverCreate(formData);
  }

  const showMainFile = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      setServerImageUrl(reader.result);
      setServerFile(file);
    }
    reader.readAsDataURL(file)
  }

  const clickMainFile = () => {
    mainFile.current.click();
  }

  return (
    <div ref={ref} className="servermodal">
      {!isChangingRegion ?
        <div>
          <h1 className="servermodal-title">Create your server</h1>
          <p className="servermodal-info">Creating a server will allow you to setup chatrooms and channels to communicate with others.</p>
          <p className="servermodal-name">Server Name</p>
          <input className="servermodal-input" placeholder="Enter a server name" value={name} onChange={(event) => { setName(event.target.value); }} />
          <p className="servermodal-region">Server Region</p>
          <div className="servermodal-select">
            {props.region === "US West" || props.region === "US Central" || props.region === "US East" ? <img src={usregion} height={35} width={55} alt="server-region" /> : null}
            {props.region === "Central Europe" || props.region === "Western Europe" ? <img src={europe} height={35} width={55} alt="server-region" /> : null}
            {props.region === "Russia" ? <img src={russia} height={35} width={55} alt="server-region" /> : null}
            <span className="servermodal-select-current">{props.region}</span>
            <span className="servermodal-select-change" onClick={() => { setIsChangingRegion(true); }}>Change</span>
            <input id="file" type="file" style={{ display: 'none' }} ref={mainFile} onChange={(event) => { showMainFile(event) }} />
            <div className="servermodal-select-image" ref={mainSubmit} onClick={clickMainFile}>
              <img src={serverImageUrl ? serverImageUrl : image} alt="current-server" />
              <p style={{ display: (serverImageUrl ? 'none' : 'initial') }}>Change</p>
              <p style={{ display: (serverImageUrl ? 'none' : 'initial') }}>icon</p>
            </div>
          </div>
          <p className="servermodal-rules">By creating a server, you agree to meet our community guidelines.</p>
          <div className="servermodal-actions">
            <p onClick={props.setModalOpen}>&larr; Back</p>
            <button onClick={() => { serverCreate(); }}>Create</button>
          </div>
        </div> :
        <div>
          <h1 className="regionmodal-title">Select a server region</h1>
          <div className="regionmodal-container">
            <div className="regionmodal-select" onClick={() => { props.setRegion("US West"); setIsChangingRegion(false); }}>
              <img src={usregion} height={50} width={90} alt="server-region" />
              <span className="regionmodal-select-current">US West</span>
            </div>
            <div className="regionmodal-select" onClick={() => { props.setRegion("US Central"); setIsChangingRegion(false); }}>
              <img src={usregion} height={50} width={90} alt="server-region" />
              <span className="regionmodal-select-current">US Central</span>
            </div>
            <div className="regionmodal-select" onClick={() => { props.setRegion("US East"); setIsChangingRegion(false); }}>
              <img src={usregion} height={50} width={90} alt="server-region" />
              <span className="regionmodal-select-current">US East</span>
            </div>
          </div>
          <div className="regionmodal-container">
            <div className="regionmodal-select" onClick={() => { props.setRegion("Western Europe"); setIsChangingRegion(false); }}>
              <img src={europe} height={50} width={90} alt="server-region" />
              <span className="regionmodal-select-current">Western Europe</span>
            </div>
            <div className="regionmodal-select" onClick={() => { props.setRegion("Central Europe"); setIsChangingRegion(false); }}>
              <img src={europe} height={50} width={90} alt="server-region" />
              <span className="regionmodal-select-current">Central Europe</span>
            </div>
            <div className="regionmodal-select" onClick={() => { props.setRegion("Russia"); setIsChangingRegion(false); }}>
              <img src={russia} height={50} width={90} alt="server-region" />
              <span className="regionmodal-select-current">Russia</span>
            </div>
          </div>
        </div>}
    </div>
  );
}

function mapStateToProps({ server }) {
  return {
    createServerError: server.createServerError,
    isLoading: server.isLoading,
    createServerSuccess: server.createServerSuccess
  };
}

export default connect(mapStateToProps, actions)(CreateServer);