import type { ChecklistData } from '../types';

export const checklistData: ChecklistData = {
  daily: [
    { id: 'd1', text: '每日簽到 (朝夕共賞)', sub: '活動介面', category: 'core' },
    { id: 'd2', text: '戰令每日任務', sub: '解好解滿', category: 'core' },
    {
      id: 'd_orders',
      text: '江湖號令 (6次)',
      sub: '點擊下方格子記錄',
      type: 'counter',
      max: 6,
      category: 'core'
    },
    { id: 'd_shiyimo', text: '時一墨答題', sub: '心心相印', category: 'core' },
    { id: 'd_collect', text: '世界採集', sub: '單人 24h / 多人 5 分鐘刷新，材料補給', category: 'optional' },
    { id: 'd_haibu', text: '仇殺／海捕', sub: '懸賞換四方錢與時裝', category: 'optional' },
    {
      id: 'd_pojun',
      text: '破軍殺將 (20:30)',
      sub: '限週三、週六',
      days: [3, 6],
      category: 'timed'
    },
    {
      id: 'd_yijue',
      text: '一決高下 (20:30)',
      sub: '限週四、週日',
      days: [0, 4],
      category: 'timed'
    },
    {
      id: 'd_train',
      text: '天泉特訓 (體魄+1)',
      sub: '神仙渡西邊',
      trackLifetime: true,
      limit: 10,
      category: 'optional'
    },
    {
      id: 'd_comb',
      text: '不羨仙梳頭 (2次)',
      sub: '共5天免費髮型',
      trackLifetime: true,
      limit: 5,
      category: 'micro'
    },
    {
      id: 'd_massage',
      text: '開封按摩 (1次)',
      sub: '領金縷衣',
      trackLifetime: true,
      limit: 10,
      category: 'social'
    },
    { id: 'd6', text: '不伏馬場賣馬', sub: '賺短陌錢 (每週限5)', category: 'micro' },
    { id: 'd7', text: '下棋贏3次', sub: '不羨仙葉不休，賺麼玉', category: 'micro' },
    { id: 'd8', text: '大鵝治病', sub: '每日1次，每週限5', category: 'micro' },
    { id: 'd9', text: '消耗體力 (450點)', sub: '鍛造/製藥', category: 'optional' },
    { id: 'd10', text: '消耗心力', sub: '副本/據點', category: 'core' }
  ],
  weekly: [
    { id: 'w_guild', text: '門派號令', sub: '每週 1200 上限，選天數完成', category: 'weekly-activity' },
    {
      id: 'w_store_group',
      text: '商店必買清單 (每週/每季)',
      sub: '不肝/真商店/戰令/雜貨',
      type: 'group',
      category: 'weekly-shop',
      subList: [
        { id: 'ws_bugan_0', text: '【每週-不肝】裊裊之音·綁 (百珍)', sub: '' },
        { id: 'ws_bugan_1', text: '【每週-不肝】羽衣殘縷圖', sub: '' },
        { id: 'ws_bugan_2', text: '【每週-不肝】嘯玉 & 振玉', sub: '' },
        { id: 'ws_bugan_3', text: '【每週-不肝】心法心得·散本', sub: '' },
        { id: 'ws_bugan_4', text: '【每週-不肝】奇術 & 生活物資支援箱', sub: '' },
        { id: 'ws_bugan_5', text: '【每週-不肝】一小盒短陌錢 & 裝備匣', sub: '' },
        { id: 'ws_bugan_6', text: '【每週-不肝】當前最高階金裝自選', sub: '' },
        { id: 'ws_bugan_7', text: '【每週-不肝】最高階金妙音石 & 定音石', sub: '' },
        { id: 'ws_bugan_8', text: '【每週-不肝】營生養成道具 (全買)', sub: '' },
        { id: 'ws_real_1', text: '【每週-真商店】裊裊之音·綁 (x2)', sub: '' },
        { id: 'ws_grocer', text: '【每週-雜貨】粗毛皮 & 粗礦石 (清河/開封)', sub: '' },
        { id: 'ws_hexi', text: '【每週-淘金】最高級變音石 & 轉律石', sub: '' },
        { id: 'ws_insight', text: '【每週-置換】金色自選置換·散本', sub: '' },
        { id: 'ss_bp_1', text: '【每季-戰令】最高級變音石 & 轉律石', sub: '' },
        { id: 'ss_bp_2', text: '【每季-戰令】武學/奇術突破升級自選匣', sub: '' },
        { id: 'ss_bp_3', text: '【每季-戰令】桃花枝/烏羽/染粉', sub: '' },
        { id: 'ss_coop', text: '【同遊】綠蟻酒 & 染色材料', sub: '' }
      ]
    },
    { id: 'w1', text: '戰令每週任務', sub: '經驗上限', category: 'weekly-activity' },
    { id: 'w2', text: '俠境副本 (51級)', sub: '每週1次，定音石', category: 'weekly-activity' },
    { id: 'w5', text: '煙花晚會 (週末)', sub: '開封豔湖 20:30，搶紅包', category: 'weekly-activity' },
    { id: 'w6', text: '浮景行舟 (週日)', sub: '臨江驛 19:00，掛機拿獎', category: 'weekly-activity' },
    { id: 'w7', text: '百業每週活動', sub: '駐地停留/止戈/貨運', category: 'weekly-activity' },
    { id: 'w8', text: '不伏馬場賣馬', sub: '每週限5匹', category: 'weekly-misc' },
    { id: 'w9', text: '八大碗兌換', sub: '隨機獲得八種碗', category: 'weekly-misc' },
    { id: 'w10', text: '市買司倒賣', sub: '週六前賣出所有商品', category: 'weekly-misc' }
  ]
};
