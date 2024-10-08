import { Hono } from 'hono';
import bilibili_user_dynamic from './lib/bilibili/user/dynamic';
import bilibili_user_video from './lib/bilibili/user/video';
import telegram_channel from './lib/telegram/channel';
import weibo_user from './lib/weibo/user';
import xiaohongshu_user from './lib/xiaohongshu/user';
import annas_annas from './lib/annas/annas';
import dw_zh_dw_zh from './lib/dw_zh/dw_zh';

const route = new Hono();

let plugins = [bilibili_user_dynamic, bilibili_user_video, telegram_channel, weibo_user, xiaohongshu_user, annas_annas, dw_zh_dw_zh];

for (let plugin of plugins) {
	plugin.setup(route);
}

export default route;
