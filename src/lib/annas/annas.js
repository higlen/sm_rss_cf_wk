import { renderRss2 } from '../../utils/util';

let annas = async (ctx) => {
	const { username } = ctx.req.param();
	let timestamp = Date.now();
	let _url = `https://annas-archive.org/search?index=&lang=zh&sort=newest&page=98&t=${timestamp}`;

	const res = await fetch(_url, {
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
			"Accept-Language": "en-US,en;q=0.5",
			"Accept-Encoding": "gzip, deflate, br, zstd",
			"Connection": "keep-alive",
			"Cookie": "cf_clearance=dHmr9IEOA.xBsDEPSiqsBmsIb9sPLk5O2tNk3_P1fFk-1725631018-1.2.1.1-Y0H1wT3_L2329tXJadJ5vteXr6KVyP_OjFPLjg6JeFYtn4BPCl2DiR4yO.63bYJduFU36EiP5KlubalBvuAFeu8AbH5JUrhghNfTcqc9V5J1Nn1Acfdv2dotdK4_AqMWDr.7lT0YD9NxevXn.8tLB9UqAtlj013j0EMfTspXn0L4gH92j6HF.xWW7KsE_QYFzfwapqV18mFhJrsIcWepHKWjh8C.ssNxDMKseuE5NLjc7u3TuNuygUJX5lVAdjai1YfTvDWKIcTnYVgpiqG5JTVGOaCSYJ2YzWjeGtZ19AlRTmFIDa5Kv.qveRxwf9yPjD11JQcSMq1KpWtx5z6TGTixt3y3xXncUYBP0RT9xJMPHRpirbkd_kMgRKUEInrW4iRuo.gpX7lf8VCk7kyzGg; aa_account_id2=eyJhIjoiM0dTZWtWeSIsImlhdCI6MTcyNzc3NzIwN30.4NnBqnJQpaGXaL0t3X814CsEivSHhMO2hWTPA6vjVwI",
			"Upgrade-Insecure-Requests": "1",
			"Sec-Fetch-Dest": "document",
			"Sec-Fetch-Mode": "navigate",
			"Sec-Fetch-Site": "cross-site",
			"If-Modified-Since": "Tue, 01 Oct 2024 10:05:51 GMT",
			"Priority": "u=0, i",
			"TE": "trailers"
		}
	});

	const rewriter = new HTMLRewriter();
	let title = 'annas-archive';
	//let link = `https://t.me/s/${username}`;
	let description = 'latest chinese books list from annas-archive';
	let language = 'zh-cn';
	let each_item_links = [];
	let each_item_texts = [];
	let each_item_titles = [];
	let each_item_dates = [];	
	let new_res = new HTMLRewriter()
		.on('a.items-center', {
			element(element) {
				each_item_links.push(element.getAttribute('href'));
				_txt=element.getAttribute('innerText')
				_txt=_txt.trim();
				each_item_texts.push(_txt);
			}
		})
		.on('h3', {
			element(element) {
				each_item_titles.push(element.getAttribute('innerText'));
			},
		})
		.on('div.truncate', {
			element(element) {
				each_item_dates.push(element.getAttribute('innerText'));
			},
		})
		.transform(res);
	await new_res.text();
	let items = [];
	for (let i = 0; i < each_item_texts.length; i++) {
		if (each_item_texts[i] === '') {
			continue;
		}
		let item = {
			title: each_item_titles[i],
			link: each_item_links[i],
			description: each_item_texts[i],
			pubDate: each_item_dates[i],
		};
		items.push(item);
	}
	let data = {
		title: title,
		link: link,
		description: description,
		language: language,
		items: items,
	};
	ctx.header('Content-Type', 'application/xml');
	return ctx.body(renderRss2(data));
};

let setup = (route) => {
	route.get('/annas', annas);
};

export default { setup };
