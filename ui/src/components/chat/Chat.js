import { v4 as uuidv4 } from 'uuid'

export default class Chat extends Array {
    constructor(title, ...items) {
        super(...items)
        this.title = title
        
        this.id = uuidv4()
        this.lastUpdated = new Date()
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            lastUpdated: this.lastUpdated,
            items: [...this],
        }
    }
}