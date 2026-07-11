// ==========================================
// ハンバーガーメニュー
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // ハンバーガーメニューのトグル
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // ナビゲーションリンクをクリックしたらメニューを閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});

// ==========================================
// スムーズスクロール
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// ヘッダーの表示/非表示とスクロール時の背景変更
// ==========================================
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;

    // 100px以上スクロールしたらヘッダーを表示
    if (scrollY > 100) {
        header.classList.add('header-visible');
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.classList.remove('header-visible');
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// ==========================================
// フェードインアニメーション
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// アニメーション対象の要素を監視
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.menu-card, .gallery-item, .contact-method, .about-content, .info-item');

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
});

// ==========================================
// 現在のナビゲーションハイライト
// ==========================================
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    const headerHeight = document.querySelector('.header').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ==========================================
// WordPress ブログ記事の取得と表示
// ==========================================
// WordPress REST APIのURLを設定してください
// 例: const WORDPRESS_API_URL = 'https://your-wordpress-site.com/wp-json/wp/v2/posts';
const WORDPRESS_API_URL = 'https://caresalonfleur.net/blog/wp-json/wp/v2/posts'; // ここにWordPressサイトのREST API URLを入力

async function fetchBlogPosts() {
    const blogPostsContainer = document.getElementById('blog-posts');

    // WordPress API URLが設定されていない場合
    if (!WORDPRESS_API_URL || WORDPRESS_API_URL === '') {
        blogPostsContainer.innerHTML = `
            <p class="blog-error">
                ブログ記事を表示するには、js/script.js の WORDPRESS_API_URL を設定してください。<br>
                例: const WORDPRESS_API_URL = 'https://your-wordpress-site.com/wp-json/wp/v2/posts';
            </p>
        `;
        return;
    }

    try {
        // WordPress REST APIから最新3件の記事を取得
        const response = await fetch(`${WORDPRESS_API_URL}?per_page=3&_embed`);

        if (!response.ok) {
            throw new Error('記事の取得に失敗しました');
        }

        const posts = await response.json();

        if (posts.length === 0) {
            blogPostsContainer.innerHTML = '<p class="blog-error">まだ記事がありません。</p>';
            return;
        }

        // 記事一覧のHTML生成（タイトルのみ1行ずつ）
        let postsHTML = '<ul class="blog-post-list">';
        posts.forEach(post => {
            const title = post.title.rendered;
            const date = new Date(post.date).toLocaleDateString('ja-JP');
            const link = post.link;

            postsHTML += `
                <li class="blog-post-item">
                    <a href="${link}" class="blog-post-link" target="_blank" rel="noopener noreferrer">
                        <span class="blog-post-date">${date}</span>
                        <span class="blog-post-title">${title}</span>
                    </a>
                </li>
            `;
        });
        postsHTML += '</ul>';

        blogPostsContainer.innerHTML = postsHTML;

    } catch (error) {
        console.error('Error fetching blog posts:', error);
        blogPostsContainer.innerHTML = `
            <p class="blog-error">
                ブログ記事の読み込みに失敗しました。<br>
                WordPress REST APIのURLを確認してください。
            </p>
        `;
    }
}

// ページ読み込み時にブログ記事を取得
document.addEventListener('DOMContentLoaded', fetchBlogPosts);
