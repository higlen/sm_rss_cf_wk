import { renderRss2 } from '../../utils/util';

let dw_zh = async (ctx) => {
	const { username } = ctx.req.param();
	let timestamp = Date.now();
	let _url = `https://www.dw.com/zh/%E5%9C%A8%E7%BA%BF%E6%8A%A5%E5%AF%BC/s-9058?t=${timestamp}`;

	const res = await fetch(_url, {
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
			"Accept-Language": "en-US,en;q=0.5",
			"Accept-Encoding": "gzip, deflate, br, zstd",
			"Connection": "keep-alive",
			"Cookie": "__cmpcc=1; __cmpconsentx70166=CQFsZAAQFsZAAAfCmDZHBJFwAP_gAEPgAAigI7JB9G5VSWFDOHpTYKoAIAUXx1hJQgAgAACAAuAACBKAIAQEEEAQIAgAIAAAABAAIBYAIQAIAAAAAACAAAAAAAAAAAAAAAAIAAAAAAAAQkAAAAAMAAAAAAAQAAAAAlAAgBAAABAAAIAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAIAAAAAAAAAAEEM4FAACwAHQAUABUAC4AHAAPAAgABIADIAGgAPwAiABHACYAFIAKoAXQA9AB-AEJAIgAiQBHACaAE4AMMAaIA5wB3AD9AIQARYAjgBnwEXgJkgUeBSAC5AF5gMWAhmAAA; __cmpcccx70166=aBQFvfH1gAwAxADIC-AAIABQAGAAcABcADQAOAAmABcADQAHgARAAoABdAEAAQQAhgBeAEOAJkAYIAywBtAELgKeAqABZgDKgHJARIAjEBugDfQHEgOWAeiBBkCDgELAJSgTAAn-BYEC0QFwwMcAY7BB-CS8FCgKNAVAADKcXU58qbnWs9a0K1qVsYA",
            "Host":"www.dw.com",
            "If-None-Match":"2a6d5-6mGCzTlNokO6PoxhHalhbmSb8E0",
			"Upgrade-Insecure-Requests": "1",
			"Sec-Fetch-Dest": "document",
			"Sec-Fetch-Mode": "navigate",
			"Sec-Fetch-Site": "None",
            "Sec-Fetch-User": "?1",
			"Priority": "u=0, i",
			"TE": "trailers"
		}
	});

	const rewriter = new HTMLRewriter();
	let title = 'DW_ZH';
	//let link = `https://t.me/s/${username}`;
	let description = 'latest news from dw.com zh';
	let language = 'zh-cn';
	let each_item_links = [];
	let each_item_texts = [];
	let each_item_titles = [];
	let each_item_dates = [];
	let new_res = new HTMLRewriter()
        .on('div.news-item span.timestamp', {
			element(element) {
				each_item_dates.push('');
			},
            text(text) {
                each_item_dates[each_item_dates.length - 1] += text.text;
            },
        })
        .on('div.news-title h3 a', {
			element(element) {
				each_item_links.push(element.getAttribute('href'));
				each_item_texts.push('');
				each_item_titles.push('');
			},
			text(text) {
				each_item_texts[each_item_texts.length - 1] += text.text;
				each_item_titles[each_item_titles.length - 1] += text.text;
			},
		})
		.on('.title a', {
			element(element) {
				each_item_links.push(element.getAttribute('href'));
				each_item_titles.push('');                
			},
			text(text) {
				each_item_titles[each_item_titles.length - 1] += text.text;
			},
		})
		.on('div.teaser-description', {
			element(element) {
				each_item_texts.push('');
				//each_item_dates.push(element.getAttribute('innerText'));
			},
			text(text) {
				each_item_texts[each_item_texts.length - 1] += text.text;
			},
		})
		.on('h4.title', {
			element(element) {
				each_item_texts.push('');
            },
        })
		.on('div.teaser-footer-wrapper', {
			element(element) {
				each_item_dates.push('');
				//each_item_dates.push(element.getAttribute('innerText'));
			},
			text(text) {
				each_item_dates[each_item_dates.length - 1] += text.text;
			},
		})
		.transform(res);
	await new_res.text();
	let items = [];
	for (let i = 0; i < each_item_texts.length; i++) {
		if (each_item_links[i] === '') {
			continue;
		}
		let item = {
			title: each_item_titles[i].trim(),
			link: `https://annas-archive.org${each_item_links[i]}`,
			description: each_item_texts[i].trim(),
			pubDate: each_item_dates[i].trim(),
		};
		items.push(item);
	}
	let data = {
		title: title,
		link: _url,
		description: description,
		language: language,
		items: items,
	};
	ctx.header('Content-Type', 'application/xml');
	return ctx.body(renderRss2(data));
};

let setup = (route) => {
	route.get('/dw_zh', dw_zh);
};

export default { setup };
