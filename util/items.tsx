export function getTypeIcon(type?: string) {
    switch (type) {
        case 'game':
            return <i className="bi bi-controller"></i>
        case 'anime':
            return <i className="bi bi-record-btn"></i>
        case 'movie':
            return <i className="bi bi-film"></i>
        case 'series':
            return <i className="bi bi-stickies"></i>

        default:
            return <i className="bi bi-question-lg"></i>
    }
}