const Utils = {
    getPrimitiveByName({name , viewer}) {
        let primitive = null
        const primitives = viewer.scene.primitives
        for(let i = 0 ; i < primitives.length ; i++) {
            if(primitives.get(i).name == name) {
                primitive = primitives.get(i)
                break
            }
        }
        return primitive
    }
}

export default Utils