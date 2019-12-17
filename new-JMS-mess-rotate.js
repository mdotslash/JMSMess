//
// JMS Booth

/**
 *the video will punch in at beats 3 by 20% and beat 1 by 20%.
*/



// Rotate the thing, thanks Mena!


function auxRotationHandler(angle){
    /*
    // handles AUX input angle and adjusts scale, translation, and rotation accordingly
    // you may have to fine tune the translation values to get image to center where you want it
    */
    let result = {}
        if(angle == 0){
            //scale height to 1280 
            result.scale = 1280/1080.
            result.translation = {x: 0, y: 0}
            result.rotation = 0;
        }
        if(angle == 90){
            result.scale = 960/1080
            result.translation = {x: 0, y: 1620}
            result.rotation = -0.5;
        }
        if(angle == 180){
            result.scale = 1280/1080
            result.translation = {x: 1350, y: 1080}
            result.rotation = -1.0;
        }
        if(angle == 270){
            result.scale = 960/1080
            result.translation = {x: 1080, y: -400}
            result.rotation = -1.5
        }
    return result
}

// setup the sequence

function sequence(inputs) {

    HYPNO.composition.renderSize.width = 960
    HYPNO.composition.renderSize.height = 1280

    
    let cameraInput = inputs["camera"] // camera input 5 second video
    let audioInput = inputs["mess-music.mp3"] // 14 second song
    
    let track1 = new Track("video")
    let audioTrack = new Track("audio")

    
    //timing
    let bar = 1.7

    // Assemble Sequence
    let firstClip = new Clip(0, 0.6, cameraInput, "video")
    firstClip.scaleToDuration(bar)
    track1.add(firstClip)

    let secondClip = new Clip(0.8, 0.5, cameraInput, "video")
    secondClip.scaleToDuration(bar)
    track1.add(secondClip)

    let thirdClip = new Clip(1.5, 1, cameraInput, "video")
    thirdClip.scaleToDuration(bar*2)
    track1.add(thirdClip)
    
    // repeat

    let f4thClip = new Clip(2.6, 0.6, cameraInput, "video")
    f4thClip.scaleToDuration(bar)
    track1.add(f4thClip)

    let f5thClip = new Clip(3.3, .6, cameraInput, "video")
    f5thClip.scaleToDuration(bar)
    track1.add(f5thClip)
    

    let f6thClip = new Clip(4, 1, cameraInput, "video")
    f6thClip.scaleToDuration(bar*2)
    track1.add(f6thClip)

    // audio track
    audioClip = new Clip(0.0, 13.5, audioInput, "audio")
    audioTrack.add(audioClip)
    
    return [
        track1,
        audioTrack
    ]
}

// render the sequence

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

        let scale = AffineTransform.makeScale(1.2, 1.2)
        let translation = AffineTransform.makeTranslation(-(1.2 - 1.0) * (960/2), -(1.2 - 1.0) * (1280/2))
        let transform = AffineTransform.concat(scale, translation)
        
        instruction.setAffineTransform(transform, "video")
    }

    //    if (instruction.index == 3) {
    //     // Use AffineTransform to apply a zoom + translation to the second clip

    //     let scale = AffineTransform.makeScale(2, 2)
    //     let translation = AffineTransform.makeTranslation(-(2 - 1.0) * (960/2), -(2 - 1.0) * (1280/2))
    //     let transform = AffineTransform.concat(scale, translation)
        
    //     instruction.setAffineTransform(transform, "video")
    // }



    //     if (instruction.index == 5) {
    //     // Use AffineTransform to apply a zoom + translation to the second clip

    //     let scale = AffineTransform.makeScale(1.3, 1.3)
    //     let translation = AffineTransform.makeTranslation(-(1.2 - 1.0) * (960/2), -(1.2 - 1.0) * (1280/2))
    //     let transform = AffineTransform.concat(scale, translation)
        
    //     instruction.setAffineTransform(transform, "video")
    // }

    // // rotate it 90 degrees

      let i = instruction.index
    let t = instruction.time

    {
    //VARIABLE INPUT TRANSFORM

// setting input size to camera setting

        let inputSize = instruction.getImageSize("video")

// if it doesn't match it , do something

        if(inputSize.width != 960 && inputSize.height != 1280){

// if landscape 

            if(inputSize.width > inputSize.height){
                /*  
                    AIR CAM/LANDSCAPE INPUT HANDLING
                    modify ANGLE parameter to rotate + translate
                    *it's good to note that if though the air camera is rotated, the 
                    input will still be landscape, just sideways!*
                */

                // rotate it by xx degrees

                let angle = 90
                
                // math shit to turn 90 into something a computer understands

                let result = auxRotationHandler(angle)

                let t1 = AffineTransform.makeRotation(result.rotation * Math.PI)
                let t2 = AffineTransform.makeTranslation(result.translation.x, result.translation.y)
                let t3 = AffineTransform.makeScale(result.scale, result.scale)
                let x1 = AffineTransform.concat(t1, t2)
                let x2 = AffineTransform.concat(x1, t3)
                instruction.setAffineTransform(x2, "video")

               //  crop it


                let crop = new Filter("CICrop")
                crop.setValue(instruction.getImage("camera"), "inputImage")
                crop.setValue([0, 0, 960, 1280], "inputRectangle")
                instruction.addFilter(crop, "video")

            } else { // resize this if it doesnt fit

                // PORTRAIT RESIZE for eye, iphone, etc.
                
                let scale = 1280/inputSize.height
                let t1 = AffineTransform.makeScale(scale, scale)
                instruction.setAffineTransform(t1, "video")
            }        
        }
    }

}

function exportSettings() {

    let bitrate = (HYPNO.composition.renderSize.width) * (HYPNO.composition.renderSize.height) * (30.0)

    bitrate *= 0.35

    return {
        video: {
            averageBitRate: bitrate,
            profileLevel: "H264Baseline41"
        },
        audio: {
            numberOfChannels: 2,
            sampleRate: 44100,
            bitRate: 64000
        }
    }
}



// v2.0
