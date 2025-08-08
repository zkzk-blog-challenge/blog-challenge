/**
 * 표준화된 날짜/시간 문자열(YYYY-MM-DD HH:mm)로 변환
 * @param input Date 객체 또는 문자열 입력값
 * @returns "YYYY-MM-DD" 또는 "YYYY-MM-DD HH:mm" 포맷의 문자열
 */
export function convertDateV2(input: Date | string): string {
    // ISO 문자열(예: "2025-05-01T12:30:00Z")이면 Date로 변환
    if (typeof input === 'string' && input.includes('T')) {
        input = new Date(input)
    }

    // Date 객체면 "YYYY-MM-DD"로 변환
    if (input instanceof Date && !isNaN(input.getTime())) {
        const pad = (n: number) => n.toString().padStart(2, '0')
        return [input.getFullYear(), pad(input.getMonth() + 1), pad(input.getDate())].join('-')
    }

    // 문자열이면 공백 분리 후, 날짜 부분만 반환
    if (typeof input === 'string') {
        const trimmed = input.trim()
        const parts = trimmed.split(/\s+/)
        const datePart = parts[0]

        if (parts.length < 2 || parts[1].trim() === '') {
            return datePart
        }

        const timeComponents = parts[1].split(':').map((component) => component.padStart(2, '0'))
        return `${datePart} ${timeComponents.join(':')}`
    }

    return ''
}

/**
 * 어떤 타입이든 입력값을 문자열로 강제 변환 (null/undefined면 빈 문자열)
 * @param input 아무 값이나
 * @returns string
 */
export function forceString(input: any): string {
    if (input === null || input === undefined) return ''
    return String(input)
}