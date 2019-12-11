//
// JMS Booth

/**
 *the video will punch in at 8 beats, 12 and 16.
*/

HYPNO.composition.timeFormat = "frames"
HYPNO.composition.preferredTimescale = 30
HYPNO.composition.renderSize.width = 960
HYPNO.composition.renderSize.height = 1280

function sequence(inputs) {
    let cameraInput = inputs["camera"]
    let audioInput = inputs["mess-music.mp3"]
    
    let track1 = new Track("video")
    let audioTrack = new Track("audio")
    
    // let's figure out how long the audio is in our timebase (30fps)
    let audioDurationOriginal = audioInput.duration
    let audioDuration = new Time(
        Math.floor((audioDurationOriginal.value / audioDurationOriginal.timescale) * 30),
        30
    )
    
    // ticks represents how many frames exists in the audio file
    let ticks = audioDuration.value
    // we can break the audio's duration up into 8ths
    let measureDuration = Math.floor(ticks / 4  )
    // the last measure is a little flexible to account for rounding to the nearest frame
    let lastMeasureDuration = ticks - (measureDuration * 3)
    
	let start = new Time(0, 30)
    let dur = new Time(60, 30)
    let measure = new Time(measureDuration, 30)
    let lastMeasure = new Time(lastMeasureDuration, 30)
    let lMeasure = new Time(lastMeasureDuration/2, 30)
    let quartMeasure = Time(measureDuration , 30)
    let lastClip = new Clip(start, lastMeasure, cameraInput, "video")
    
    
    for (let i = 0; i < 3; i++) {
        // we'll make every clip start a little later in our media for variety
        let clip = new Clip(new Time(0 + i*20, 30), measure, cameraInput, "video")
        track1.add(clip)
        clip.scaleToDuration(120,30)
        
    }
    
   // let clip1 = new Clip(new Time(0 + i*20, 30), measure, cameraInput, "video") 
   // track1.add(clip1)
    //clip1.scaleToDuration(20,30)

   lastClip.scaleToDuration(120,30)
    track1.add(lastClip)
    
    // audio track
    audioClip = new Clip(start, new Time(ticks, 30), audioInput, "audio")
    audioTrack.add(audioClip)
    
    return [
        track1,
        audioTrack
    ]
}

function render(context, instruction) {
    /**
     * The render function is where you make any changes to the like scaling, adding effects, and blending tracks together.
    */
    
    // instruction.index reflects the numbered index of each clip in the timeline
    if (instruction.index == 1) {
        // Use AffineTransform to apply a zoom + translation to the second clip

        let scale = AffineTransform.makeScale(1.5, 1.5)
        let translation = AffineTransform.makeTranslation(-(1.5 - 1.0) * (960/2), -(1.5 - 1.0) * (1280/2))
        let transform = AffineTransform.concat(scale, translation)
        
        instruction.setAffineTransform(transform, "video")
        //clip.scaleToDuration(120,30)
    }

 // instruction.index reflects the numbered index of each clip in the timeline
    if (instruction.index == 2) {
        // Use AffineTransform to apply a zoom + translation to the second clip

        let scale = AffineTransform.makeScale(2, 2)
        let translation = AffineTransform.makeTranslation(-(1.5 - 1.0) * (960/2), -(1.5 - 1.0) * (1280/2))
        let transform = AffineTransform.concat(scale, translation)
        
        instruction.setAffineTransform(transform, "video ")
    }
}