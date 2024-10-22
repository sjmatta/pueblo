import { v4 as uuidv4 } from 'uuid'

export default class Interaction {
    constructor(prompt) {
        this.id = uuidv4()
        this.prompt = prompt
        this.response = ''
        this.loading = true
        this.createdTimestamp = new Date()
    }
}