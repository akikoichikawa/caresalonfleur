// ==========================================
// ブログ一覧ページ（bloglist.html）
// WordPress REST API から記事を取得して一覧表示する
// ==========================================

// WordPress のREST API ベースURL（script.js と同じWordPress）
const WP_API_BASE = 'https://caresalonfleur.net/blog/wp-json/wp/v2';

// 1ページあたりの表示件数
const POSTS_PER_PAGE = 10;

// ==========================================
// ハンバーガーメニュー
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});

// ==========================================
// 記事一覧
// ==========================================
const state = {
    page: 1,
    category: 0,      // 0 = すべて
    totalPages: 1
};

const listEl = document.getElementById('blog-list');
const categoriesEl = document.getElementById('blog-categories');
const paginationEl = document.getElementById('blog-pagination');

// フェードイン用
const cardObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// HTML付きの抜粋をテキストだけにして短くする
function toPlainExcerpt(html, maxLength) {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = (div.textContent || '').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}

function formatDate(dateString) {
    const d = new Date(dateString);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
}

// URLのクエリ（?page=2&cat=3）から状態を復元
function readStateFromURL() {
    const params = new URLSearchParams(location.search);
    state.page = Math.max(1, parseInt(params.get('page'), 10) || 1);
    state.category = parseInt(params.get('cat'), 10) || 0;
}

function writeStateToURL() {
    const params = new URLSearchParams();
    if (state.page > 1) params.set('page', state.page);
    if (state.category) params.set('cat', state.category);
    const query = params.toString();
    history.replaceState(null, '', query ? `?${query}` : location.pathname);
}

// ------------------------------------------
// カテゴリー一覧
// ------------------------------------------
async function renderCategories() {
    try {
        const res = await fetch(`${WP_API_BASE}/categories?per_page=100&hide_empty=true&orderby=count&order=desc`);
        if (!res.ok) return;
        const categories = (await res.json()).filter(c => c.name !== '未分類');
        if (categories.length < 2) return; // カテゴリーが1つ以下なら絞り込みは出さない

        const buttons = [{ id: 0, name: 'すべて' }, ...categories];
        categoriesEl.innerHTML = buttons.map(c => `
            <button type="button" class="blog-category-btn${c.id === state.category ? ' active' : ''}" data-id="${c.id}">
                ${escapeHTML(c.name)}
            </button>
        `).join('');

        categoriesEl.querySelectorAll('.blog-category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                state.category = parseInt(this.dataset.id, 10);
                state.page = 1;
                categoriesEl.querySelectorAll('.blog-category-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                loadPosts();
            });
        });
    } catch (e) {
        console.error('Error fetching categories:', e);
    }
}

// ------------------------------------------
// 記事一覧
// ------------------------------------------
async function loadPosts() {
    listEl.innerHTML = '<p class="blog-loading">記事を読み込み中...</p>';
    paginationEl.innerHTML = '';
    writeStateToURL();

    const params = new URLSearchParams({
        per_page: POSTS_PER_PAGE,
        page: state.page,
        _embed: 'wp:featuredmedia,wp:term',
        _fields: 'id,date,link,title,excerpt,_links,_embedded'
    });
    if (state.category) params.set('categories', state.category);

    try {
        const res = await fetch(`${WP_API_BASE}/posts?${params}`);

        // 存在しないページ番号（URL直打ちなど）の場合は1ページ目に戻す
        if (res.status === 400 && state.page > 1) {
            state.page = 1;
            return loadPosts();
        }
        if (!res.ok) throw new Error('記事の取得に失敗しました');

        state.totalPages = parseInt(res.headers.get('X-WP-TotalPages'), 10) || 1;
        const posts = await res.json();

        if (posts.length === 0) {
            listEl.innerHTML = '<p class="blog-error">まだ記事がありません。</p>';
            return;
        }

        listEl.innerHTML = `<ul class="blog-card-list">${posts.map(renderCard).join('')}</ul>`;
        listEl.querySelectorAll('.blog-card').forEach(card => cardObserver.observe(card));
        renderPagination();

        // ページ切り替え時は一覧の先頭へスクロール
        if (document.readyState === 'complete') {
            const top = listEl.getBoundingClientRect().top + window.scrollY - 140;
            if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        listEl.innerHTML = `
            <p class="blog-error">
                ブログ記事の読み込みに失敗しました。<br>
                時間をおいて再度お試しください。
            </p>
        `;
    }
}

function renderCard(post) {
    const embedded = post._embedded || {};
    const media = embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0];
    const thumb = media && media.source_url
        ? ((media.media_details && media.media_details.sizes && media.media_details.sizes.medium_large)
            ? media.media_details.sizes.medium_large.source_url
            : media.source_url)
        : '';
    const terms = (embedded['wp:term'] && embedded['wp:term'][0]) || [];
    const categories = terms.filter(t => t.name && t.name !== '未分類');

    const title = post.title.rendered;              // WordPress側でサニタイズ済みのHTML
    const excerpt = toPlainExcerpt(post.excerpt.rendered, 90);

    return `
        <li class="blog-card">
            <a href="${escapeHTML(post.link)}" class="blog-card-link${thumb ? '' : ' no-thumb'}">
                ${thumb ? `
                <div class="blog-card-thumb">
                    <img src="${escapeHTML(thumb)}" alt="" loading="lazy">
                </div>` : ''}
                <div class="blog-card-body">
                    <div class="blog-card-meta">
                        <time class="blog-card-date" datetime="${escapeHTML(post.date)}">${formatDate(post.date)}</time>
                        ${categories.map(c => `<span class="blog-card-category">${escapeHTML(c.name)}</span>`).join('')}
                    </div>
                    <h2 class="blog-card-title">${title}</h2>
                    ${excerpt ? `<p class="blog-card-excerpt">${escapeHTML(excerpt)}</p>` : ''}
                    <span class="blog-card-more">続きを読む</span>
                </div>
            </a>
        </li>
    `;
}

// ------------------------------------------
// ページネーション
// ------------------------------------------
function renderPagination() {
    if (state.totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    const pages = [];
    for (let p = 1; p <= state.totalPages; p++) {
        // 現在ページの前後2ページ＋最初と最後だけ表示
        if (p === 1 || p === state.totalPages || Math.abs(p - state.page) <= 2) {
            pages.push(p);
        } else if (pages[pages.length - 1] !== '…') {
            pages.push('…');
        }
    }

    paginationEl.innerHTML = `
        <button type="button" class="blog-page-btn prev" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''}>前へ</button>
        ${pages.map(p => p === '…'
            ? '<span class="blog-page-ellipsis">…</span>'
            : `<button type="button" class="blog-page-btn${p === state.page ? ' active' : ''}" data-page="${p}">${p}</button>`
        ).join('')}
        <button type="button" class="blog-page-btn next" data-page="${state.page + 1}" ${state.page === state.totalPages ? 'disabled' : ''}>次へ</button>
    `;

    paginationEl.querySelectorAll('.blog-page-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', function() {
            state.page = parseInt(this.dataset.page, 10);
            loadPosts();
        });
    });
}

// ==========================================
// 初期化
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    readStateFromURL();
    renderCategories();
    loadPosts();
});
