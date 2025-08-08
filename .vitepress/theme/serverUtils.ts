import { globby } from 'globby'
import matter from 'gray-matter'
import fs from 'fs-extra'
import { resolve, join } from 'path'
import { forceString } from './date'

async function getPosts(pageSize: number) {
    const isProd = process.env.NODE_ENV === 'production'
    const ignorePaths = isProd ? ['posts/draft/**/*.md', 'posts/trash/**/*.md'] : []

    let paths = await globby(['posts/**/**.md'], {
        ignore: ignorePaths
    })

    // 여기서는 페이징을 생성할 때만 사용됨
    // await generatePaginationPages(paths.length, pageSize)

    let posts = await Promise.all(
        paths.map(async (item) => {
            const content = await fs.readFile(item, 'utf-8')
            const { data } = matter(content)
            return {
                frontMatter: {
                    ...data,
                    date: forceString(data.date),
                    // order 처리: 숫자가 아닐 경우 0으로 강제 변환
                    order: _convertOrder(data.order)
                },
                regularPath: `/${item.replace('.md', '.html')}`
            }
        })
    )
    posts.sort(_compareDate as any)
    return posts
}

async function generatePaginationPages(total: number, pageSize: number) {
    // 전체 페이지 수 계산
    let pagesNum = total % pageSize === 0 ? total / pageSize : Math.floor(total / pageSize) + 1
    const paths = resolve('./')

    if (total > 0) {
        for (let i = 1; i < pagesNum + 1; i++) {
            const page = `
                    ---
                    page: true
                    title: ${i === 1 ? 'home' : 'page_' + i}
                    aside: false
                    comment: false
                    ---
                    <script setup>
                    import Page from "./.vitepress/theme/components/Page.vue";
                    import { useData } from "vitepress";
                    const { theme } = useData();
                    const posts = theme.value.posts.slice(${pageSize * (i - 1)},${pageSize * i})
                    </script>
                    <Page :posts="posts" :pageCurrent="${i}" :pagesNum="${pagesNum}" />
                `.trim()

            const file = paths + `/page_${i}.md`
            await fs.writeFile(file, page)
        }
    }
    // page_1을 index로 이름 변경하여 홈페이지로 사용
    await fs.move(paths + '/page_1.md', paths + '/index.md', { overwrite: true })
}

// YYYY-MM-DD 일때의 코드
// function _compareDate(
//     obj1: { frontMatter: { date: number; order: number } },
//     obj2: { frontMatter: { date: number; order: number } }
// ) {
//     const orderCompare = obj2.frontMatter.order - obj1.frontMatter.order
//     if (orderCompare !== 0) return orderCompare
//     return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1
// }

function _compareDate(
    obj1: { frontMatter: { date: string; order: number } },
    obj2: { frontMatter: { date: string; order: number } }
) {
    const orderCompare = obj2.frontMatter.order - obj1.frontMatter.order
    if (orderCompare !== 0) return orderCompare

    // "YYYY년 QQ기 WW주차" → "YYYY-QQ-WW" 형태로 변환하여 비교
    const weekKey1 = _parseYearQuarterWeek(obj1.frontMatter.date)
    const weekKey2 = _parseYearQuarterWeek(obj2.frontMatter.date)

    // 주차(연도+기수+주차) 비교
    if (weekKey1 !== weekKey2) {
        return weekKey1 < weekKey2 ? 1 : -1
    }

    // 같은 주차면 동일 그룹으로 간주 → 순서 그대로
    return 0
}

function _parseYearQuarterWeek(dateStr: string): string {
    // 예: "2025년 01기 03주차"
    const match = dateStr.match(/(\d{4})년\s*(\d{1,2})기\s*(\d{1,2})주차/)
    if (!match) return dateStr // 형식이 맞지 않으면 원본 반환
    const [, year, quarter, week] = match
    // 비교 용도로 YYYYQQWW 숫자 문자열 생성
    return `${year.padStart(4, '0')}${quarter.padStart(2, '0')}${week.padStart(2, '0')}`
}

function _convertOrder(input?: unknown): number {
    if (input === undefined || input === null) return 0
    if (typeof input === 'number') return input
    const num = Number(input)
    return isNaN(num) ? 0 : num
}

export { getPosts }