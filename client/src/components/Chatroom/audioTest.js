recordAudioInput = async(stream) => {
  if (stream) {
    let audio = document.createElement('audio');
    const audioTracks = stream.getAudioTracks();

    console.log('Using audio device: ' + audioTracks[0].label);
    stream.oninactive = function() {
      console.log('Stream ended');
    };
    window.stream = stream; // make variable available to browser console
    audio.srcObject = stream;
    audio.autoplay = true;

    // this.socket.emit('SEND_VOICE', {
    //   recording: stream,
    //   socketId: this.state.socketId,
    //   chatroomId: this.state.chatroomId,
    //   room: `${ROOT_URL}/chatroom/${this.state.serverId}/${this.state.chatroomId}`
    // });
  }
}

//   music.setAttribute('src',theNewSource); //change the source
// music.load(); //load the new source
// music.play(); //play