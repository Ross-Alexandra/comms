var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

export async function playNote(frequency, duration) {
    // create Oscillator node
    return new Promise((resolve) => {
        const oscillator = audioCtx.createOscillator();
    
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency; // value in hertz
        const volume = audioCtx.createGain();
        oscillator.connect(volume);
        volume.connect(audioCtx.destination);
        volume.gain.value = 0.15;
        oscillator.start();
        
        setTimeout(() => {
                oscillator.stop();
                resolve();
            }, duration);
    });
}
