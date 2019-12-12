//
// JMS Booth

/**
 *the video will punch in at beats 3 by 20% and beat 1 by 20%.
*/


function sequence(inputs) {
    
    let cameraInput = inputs["camera"] // camera input 5 second video
    let audioInput = inputs["mess-music.mp3"] // 14 second song
    
    let track1 = new Track("video")
    let audioTrack = new Track("audio")

    
    //timing
    let bar = 1.7

    // Assemble Sequence
    let firstClip = new Clip(0.1, 0.4, cameraInput, "video")
    firstClip.scaleToDuration(bar)
    track1.add(firstClip)

    let secondClip = new Clip(0.5, 0.5, cameraInput, "video")
    secondClip.scaleToDuration(bar)
    track1.add(secondClip)

    let thirdClip = new Clip(0.2, .7, cameraInput, "video")
    thirdClip.scaleToDuration(bar*2)
    track1.add(thirdClip)
    
    // repeat

    track1.add(firstClip)
    track1.add(secondClip)
    track1.add(thirdClip)

    // audio track
    audioClip = new Clip(0.0, 13.5, audioInput, "audio")
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

        let scale = AffineTransform.makeScale(1.2, 1.2 )
        let translation = AffineTransform.makeTranslation(-(1.2 - 1.0) * (960/2), -(1.2 - 1.0) * (1280/2))
        let transform = AffineTransform.concat(scale, translation)
        
        instruction.setAffineTransform(transform, "video")
        //clip.scaleToDuration(120,30)
    }

 // instruction.index reflects the numbered index of each clip in the timeline
    if (instruction.index == 2) {
        // Use AffineTransform to apply a zoom + translation to the second clip

        let scale = AffineTransform.makeScale(1.5, 1.5)
        let translation = AffineTransform.makeTranslation(-(1.5 - 1.0) * (960/2), -(1.5 - 1.0) * (1280/2))
        let transform = AffineTransform.concat(scale, translation)
        
        instruction.setAffineTransform(transform, "video ")
    }

       if (instruction.index == 3) {
        // Use AffineTransform to apply a zoom + translation to the second clip

        let scale = AffineTransform.makeScale(2, 2)
        let translation = AffineTransform.makeTranslation(-(2 - 1.0) * (960/2), -(2 - 1.0) * (1280/2))
        let transform = AffineTransform.concat(scale, translation)
        
        instruction.setAffineTransform(transform, "video ")
    }
}

// v2.0