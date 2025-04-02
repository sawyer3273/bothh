
export const PROJECT_NAME = "MovieQuiz"

export const NOTIF_SUCCESS = "success"
export const NOTIF_FAIL = "danger"
export const NOTIF_CONFIRM = "info"

export const ERROR_EXPIRED = "EXPIRED"

export default PROJECT_NAME

export const quizTypeOptions = [
    { id: 'text', label: 'Текстовый вопрос' },
    { id: 'video', label: 'Видео вопрос' },
    { id: 'photo', label: 'Фото вопрос' },
    { id: 'audio', label: 'Аудио вопрос' },
    { id: 'cast', label: 'Фильм по составу' },
    { id: 'comparison', label: 'Cопоставление' },
    { id: 'order', label: 'Правильный порядок' },
    { id: 'manyAnswers', label: 'Множественный выбор' },
  ]
export const libraryOptions = [
    { id: 'movie', label: 'Тип ответа: фильм' },
    { id: 'person', label: 'Тип ответа: актер' },
    { id: 'abcd', label: 'Тип ответа: абвг' },
    { id: 'common', label: 'Тип ответа: Общие слова' },
  ]