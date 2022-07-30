import { Effect } from '../database/db';
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
export function getEffectTypeIcon(type?: Effect['type']) {
    switch (type) {
        case 'positive':
            return <i className="bi bi-hand-thumbs-up effect-text-positive"></i>
        case 'neutral':
            return <i className="bi bi-dash-circle effect-text-neutral"></i>
        case 'negative':
            return <i className="bi bi-hand-thumbs-down effect-text-negative"></i>
        case 'card':
            return <i className="bi bi-postcard effect-text-card"></i>
        case 'secret':
            return <i className="bi bi-patch-question effect-text-secret"></i>
        case 'system':
            return <i className="bi bi-robot effect-text-system"></i>

        default:
            return <i className="bi bi-question-lg"></i>
    }
}