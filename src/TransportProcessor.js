class TransportProcessor extends AudioWorkletProcessor {

    constructor(options) {
        super(options);
        this.port.addEventListener("message", this.handleMessage);
        this.port.start();
        this.started = false;
        this.bpm = 120;
        this.ppqn = 48;
        this.currentPulsePosition = 0;
   }
 
    handleMessage = (message) => {
        if(message.data && message.data.type === "ping") {
            this.port.postMessage(message.data);
        } else if (message.data === "start") {
            this.started = true;
       } else if(message.data === "pause") {
            this.started = false;
        } else if(message.data === "stop") {
            this.started = false;
        } else if(message.data.type === 'bpm') {
            this.bpm = message.data.value;
            this.currentPulsePosition = 0;
        } else if(message.data.type === 'ppqn') {
            this.ppqn = message.data.value;
            this.currentPulsePosition = 0;
        }
    };

    process(inputs, outputs, parameters) {
        if (this.started) {
            const beatNumber = currentTime / (60 / this.bpm);
            const currentPulsePosition = Math.ceil(beatNumber * this.ppqn);
            if(currentPulsePosition > this.currentPulsePosition) {
                this.currentPulsePosition = currentPulsePosition;
                this.port.postMessage({ type: "bang" });
            }
        }
        return true;
    }
}

registerProcessor(
    "transport", 
    TransportProcessor
);