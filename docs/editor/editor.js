/* ========== Mizuki Editor - JavaScript ========== */
(function() {
'use strict';

// ========== i18n System ==========
const I18N = {
  'zh-CN': {
    pageTitle: 'Mizuki Visual Editor',
    themeColor: 'Theme Color', themeMode: 'Theme Mode',
    themeDark: 'Default Dark', themeLight: 'Light Theme', themeDeepBlue: 'Deep Blue', themeHighContrast: 'High Contrast',
    colorRed: 'Red', colorOrange: 'Orange', colorYellow: 'Yellow', colorGreen: 'Green',
    colorCyan: 'Cyan', colorBlue: 'Blue', colorPurple: 'Purple', colorPink: 'Pink',
    modulePanel: 'Modules', searchModules: 'Search modules...',
    editorPlaceholder: 'Type your Markdown here...',
    cmdHeading: 'Heading', cmdBold: 'Bold', cmdItalic: 'Italic', cmdStrikethrough: 'Strikethrough',
    cmdUl: 'Bullet List', cmdOl: 'Numbered List', cmdTask: 'Task List', cmdQuote: 'Blockquote',
    cmdCode: 'Inline Code', cmdCodeblock: 'Code Block', cmdLink: 'Link', cmdImage: 'Image',
    cmdTable: 'Table', cmdHr: 'Horizontal Rule',
    viewEdit: 'Edit', viewSplit: 'Split', viewPreview: 'Preview',
    importFile: 'Import', exportFile: 'Export',
    fmConfig: 'Front Matter Settings',
    fmTitle: 'Title', fmTitlePh: 'Article title',
    fmPublished: 'Published', fmUpdated: 'Updated',
    fmDesc: 'Description', fmDescPh: 'Article description',
    fmImage: 'Cover image', fmCategory: 'Category', fmCategoryPh: 'Category name',
    fmTags: 'Tags', fmTagsPh: 'tag1, tag2, tag3',
    fmDraft: 'Draft', fmPinned: 'Pinned', fmComment: 'Comments', fmEncrypted: 'Encrypted',
    fmPassword: 'Password', fmPasswordPh: 'Access password',
    fmPriority: 'Priority', fmAlias: 'Alias', fmLang: 'Language', fmLangDefault: 'Default',
    fmLicense: 'License', fmAuthor: 'Author', fmAuthorPh: 'Author name', fmSourceLink: 'Source link',
    fmApply: 'Apply to Article', fmCancelBtn: 'Cancel',
    exportTitle: 'Export File', exportTxt: '📄 Plain Text (.txt)',
    dropMain: '📂 Drop files here to import', dropSub: 'Supports .md .txt .html',
    catFrontMatter: 'Front Matter', catBasicMd: 'Basic Markdown', catExtended: 'Extended Features',
    catMermaid: 'Mermaid Diagrams', catVideo: 'Video Embed', catTemplates: 'Article Templates',
    modBasicConfig: 'Basic Config', modEncryptConfig: 'Encrypt Config', modPinConfig: 'Pin Config', modDraftConfig: 'Draft Config',
    modH1: 'Heading 1', modH2: 'Heading 2', modH3: 'Heading 3',
    modBold: 'Bold', modItalic: 'Italic', modStrike: 'Strikethrough',
    modUl: 'Bullet List', modOl: 'Numbered List', modTask: 'Task List',
    modQuote: 'Blockquote', modInlineCode: 'Inline Code', modCodeBlock: 'Code Block',
    modLink: 'Link', modImage: 'Image', modTable: 'Table', modHr: 'Horizontal Rule', modHtml: 'HTML Block',
    modGithubCard: 'GitHub Card',
    modNote: 'Note', modTip: 'Tip', modImportant: 'Important',
    modWarning: 'Warning', modCaution: 'Caution', modCustomAdmonition: 'Custom Admonition',
    modSpoiler: 'Spoiler', modExcerpt: 'Excerpt Separator',
    modInlineMath: 'Inline Math', modBlockMath: 'Block Math',
    modFlowchart: 'Flowchart', modSequence: 'Sequence', modGantt: 'Gantt',
    modClassDiag: 'Class Diagram', modPie: 'Pie Chart', modState: 'State Diagram',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: 'Standard Article', modEncArticle: 'Encrypted Article', modPinArticle: 'Pinned Announcement', modTutorial: 'Tech Tutorial'
  },
  'zh-TW': {
    pageTitle: 'Mizuki 視覺化編輯器',
    themeColor: '主題顏色', themeMode: '主題模式',
    themeDark: '預設深色', themeLight: '亮色主題', themeDeepBlue: '深藍主題', themeHighContrast: '高對比度',
    colorRed: '紅色', colorOrange: '橙色', colorYellow: '黃色', colorGreen: '綠色',
    colorCyan: '青色', colorBlue: '藍色', colorPurple: '紫色', colorPink: '粉色',
    modulePanel: '模組面板', searchModules: '搜尋模組...',
    editorPlaceholder: '在此輸入 Markdown 內容...',
    cmdHeading: '標題', cmdBold: '粗體', cmdItalic: '斜體', cmdStrikethrough: '刪除線',
    cmdUl: '無序清單', cmdOl: '有序清單', cmdTask: '任務清單', cmdQuote: '引用',
    cmdCode: '行內程式碼', cmdCodeblock: '程式碼區塊', cmdLink: '連結', cmdImage: '圖片',
    cmdTable: '表格', cmdHr: '分隔線',
    viewEdit: '編輯', viewSplit: '分屏', viewPreview: '預覽',
    importFile: '匯入', exportFile: '匯出',
    fmConfig: 'Front Matter 設定',
    fmTitle: '標題', fmTitlePh: '文章標題',
    fmPublished: '發佈日期', fmUpdated: '更新日期',
    fmDesc: '描述', fmDescPh: '文章描述',
    fmImage: '封面圖片', fmCategory: '分類', fmCategoryPh: '分類名稱',
    fmTags: '標籤', fmTagsPh: '標籤1, 標籤2, 標籤3',
    fmDraft: '草稿', fmPinned: '置頂', fmComment: '留言', fmEncrypted: '加密',
    fmPassword: '密碼', fmPasswordPh: '存取密碼',
    fmPriority: '優先順序', fmAlias: '別名', fmLang: '語言', fmLangDefault: '預設',
    fmLicense: '授權條款', fmAuthor: '作者', fmAuthorPh: '作者名', fmSourceLink: '來源連結',
    fmApply: '套用至文章', fmCancelBtn: '取消',
    exportTitle: '匯出檔案', exportTxt: '📄 純文字 (.txt)',
    dropMain: '📂 拖曳檔案至此匯入', dropSub: '支援 .md .txt .html',
    catFrontMatter: 'Front Matter', catBasicMd: '基礎 Markdown', catExtended: '擴充功能',
    catMermaid: 'Mermaid 圖表', catVideo: '影片嵌入', catTemplates: '文章模板',
    modBasicConfig: '基本設定', modEncryptConfig: '加密設定', modPinConfig: '置頂設定', modDraftConfig: '草稿設定',
    modH1: '一級標題', modH2: '二級標題', modH3: '三級標題',
    modBold: '粗體', modItalic: '斜體', modStrike: '刪除線',
    modUl: '無序清單', modOl: '有序清單', modTask: '任務清單',
    modQuote: '引用區塊', modInlineCode: '行內程式碼', modCodeBlock: '程式碼區塊',
    modLink: '連結', modImage: '圖片', modTable: '表格', modHr: '分隔線', modHtml: 'HTML區塊',
    modGithubCard: 'GitHub 卡片',
    modNote: 'Note 提示框', modTip: 'Tip 技巧框', modImportant: 'Important 重要框',
    modWarning: 'Warning 警告框', modCaution: 'Caution 注意框', modCustomAdmonition: '自訂標題提示框',
    modSpoiler: 'Spoiler 隱藏', modExcerpt: '摘要分隔',
    modInlineMath: '行內公式', modBlockMath: '區塊公式',
    modFlowchart: '流程圖', modSequence: '時序圖', modGantt: '甘特圖',
    modClassDiag: '類別圖', modPie: '圓餅圖', modState: '狀態圖',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: '標準文章', modEncArticle: '加密文章', modPinArticle: '置頂公告', modTutorial: '技術教學'
  },
  en: {
    pageTitle: 'Mizuki Visual Editor',
    themeColor: 'Theme Color', themeMode: 'Theme Mode',
    themeDark: 'Default Dark', themeLight: 'Light Theme', themeDeepBlue: 'Deep Blue', themeHighContrast: 'High Contrast',
    colorRed: 'Red', colorOrange: 'Orange', colorYellow: 'Yellow', colorGreen: 'Green',
    colorCyan: 'Cyan', colorBlue: 'Blue', colorPurple: 'Purple', colorPink: 'Pink',
    modulePanel: 'Modules', searchModules: 'Search modules...',
    editorPlaceholder: 'Type your Markdown here...',
    cmdHeading: 'Heading', cmdBold: 'Bold', cmdItalic: 'Italic', cmdStrikethrough: 'Strikethrough',
    cmdUl: 'Bullet List', cmdOl: 'Numbered List', cmdTask: 'Task List', cmdQuote: 'Blockquote',
    cmdCode: 'Inline Code', cmdCodeblock: 'Code Block', cmdLink: 'Link', cmdImage: 'Image',
    cmdTable: 'Table', cmdHr: 'Horizontal Rule',
    viewEdit: 'Edit', viewSplit: 'Split', viewPreview: 'Preview',
    importFile: 'Import', exportFile: 'Export',
    fmConfig: 'Front Matter Settings',
    fmTitle: 'Title', fmTitlePh: 'Article title',
    fmPublished: 'Published', fmUpdated: 'Updated',
    fmDesc: 'Description', fmDescPh: 'Article description',
    fmImage: 'Cover image', fmCategory: 'Category', fmCategoryPh: 'Category name',
    fmTags: 'Tags', fmTagsPh: 'tag1, tag2, tag3',
    fmDraft: 'Draft', fmPinned: 'Pinned', fmComment: 'Comments', fmEncrypted: 'Encrypted',
    fmPassword: 'Password', fmPasswordPh: 'Access password',
    fmPriority: 'Priority', fmAlias: 'Alias', fmLang: 'Language', fmLangDefault: 'Default',
    fmLicense: 'License', fmAuthor: 'Author', fmAuthorPh: 'Author name', fmSourceLink: 'Source link',
    fmApply: 'Apply to Article', fmCancelBtn: 'Cancel',
    exportTitle: 'Export File', exportTxt: '📄 Plain Text (.txt)',
    dropMain: '📂 Drop files here to import', dropSub: 'Supports .md .txt .html',
    catFrontMatter: 'Front Matter', catBasicMd: 'Basic Markdown', catExtended: 'Extended Features',
    catMermaid: 'Mermaid Diagrams', catVideo: 'Video Embed', catTemplates: 'Article Templates',
    modBasicConfig: 'Basic Config', modEncryptConfig: 'Encrypt Config', modPinConfig: 'Pin Config', modDraftConfig: 'Draft Config',
    modH1: 'Heading 1', modH2: 'Heading 2', modH3: 'Heading 3',
    modBold: 'Bold', modItalic: 'Italic', modStrike: 'Strikethrough',
    modUl: 'Bullet List', modOl: 'Numbered List', modTask: 'Task List',
    modQuote: 'Blockquote', modInlineCode: 'Inline Code', modCodeBlock: 'Code Block',
    modLink: 'Link', modImage: 'Image', modTable: 'Table', modHr: 'Horizontal Rule', modHtml: 'HTML Block',
    modGithubCard: 'GitHub Card',
    modNote: 'Note', modTip: 'Tip', modImportant: 'Important',
    modWarning: 'Warning', modCaution: 'Caution', modCustomAdmonition: 'Custom Admonition',
    modSpoiler: 'Spoiler', modExcerpt: 'Excerpt Separator',
    modInlineMath: 'Inline Math', modBlockMath: 'Block Math',
    modFlowchart: 'Flowchart', modSequence: 'Sequence', modGantt: 'Gantt',
    modClassDiag: 'Class Diagram', modPie: 'Pie Chart', modState: 'State Diagram',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: 'Standard Article', modEncArticle: 'Encrypted Article', modPinArticle: 'Pinned Announcement', modTutorial: 'Tech Tutorial'
  },
  ja: {
    pageTitle: 'Mizuki ビジュアルエディタ',
    themeColor: 'テーマカラー', themeMode: 'テーマモード',
    themeDark: 'デフォルトダーク', themeLight: 'ライト', themeDeepBlue: 'ディープブルー', themeHighContrast: 'ハイコントラスト',
    colorRed: '赤', colorOrange: 'オレンジ', colorYellow: '黄', colorGreen: '緑',
    colorCyan: 'シアン', colorBlue: '青', colorPurple: '紫', colorPink: 'ピンク',
    modulePanel: 'モジュール', searchModules: 'モジュール検索...',
    editorPlaceholder: 'ここにMarkdownを入力...',
    cmdHeading: '見出し', cmdBold: '太字', cmdItalic: '斜体', cmdStrikethrough: '取消線',
    cmdUl: '箇条書き', cmdOl: '番号付き', cmdTask: 'タスク', cmdQuote: '引用',
    cmdCode: 'インラインコード', cmdCodeblock: 'コードブロック', cmdLink: 'リンク', cmdImage: '画像',
    cmdTable: '表', cmdHr: '区切り線',
    viewEdit: '編集', viewSplit: '分割', viewPreview: 'プレビュー',
    importFile: 'インポート', exportFile: 'エクスポート',
    fmConfig: 'Front Matter 設定',
    fmTitle: 'タイトル', fmTitlePh: '記事タイトル',
    fmPublished: '公開日', fmUpdated: '更新日',
    fmDesc: '説明', fmDescPh: '記事の説明',
    fmImage: 'カバー画像', fmCategory: 'カテゴリ', fmCategoryPh: 'カテゴリ名',
    fmTags: 'タグ', fmTagsPh: 'タグ1, タグ2, タグ3',
    fmDraft: '下書き', fmPinned: 'ピン留め', fmComment: 'コメント', fmEncrypted: '暗号化',
    fmPassword: 'パスワード', fmPasswordPh: 'アクセスパスワード',
    fmPriority: '優先度', fmAlias: 'エイリアス', fmLang: '言語', fmLangDefault: 'デフォルト',
    fmLicense: 'ライセンス', fmAuthor: '著者', fmAuthorPh: '著者名', fmSourceLink: 'ソースリンク',
    fmApply: '記事に適用', fmCancelBtn: 'キャンセル',
    exportTitle: 'ファイルエクスポート', exportTxt: '📄 プレーンテキスト (.txt)',
    dropMain: '📂 ファイルをここにドラッグ＆ドロップ', dropSub: '.md .txt .html に対応',
    catFrontMatter: 'Front Matter', catBasicMd: '基本 Markdown', catExtended: '拡張機能',
    catMermaid: 'Mermaid 図表', catVideo: '動画埋め込み', catTemplates: '記事テンプレート',
    modBasicConfig: '基本設定', modEncryptConfig: '暗号化設定', modPinConfig: 'ピン留め設定', modDraftConfig: '下書き設定',
    modH1: '見出し1', modH2: '見出し2', modH3: '見出し3',
    modBold: '太字', modItalic: '斜体', modStrike: '取消線',
    modUl: '箇条書き', modOl: '番号付き', modTask: 'タスク',
    modQuote: '引用ブロック', modInlineCode: 'インラインコード', modCodeBlock: 'コードブロック',
    modLink: 'リンク', modImage: '画像', modTable: '表', modHr: '区切り線', modHtml: 'HTMLブロック',
    modGithubCard: 'GitHub カード',
    modNote: 'Note ノート', modTip: 'Tip ヒント', modImportant: 'Important 重要',
    modWarning: 'Warning 警告', modCaution: 'Caution 注意', modCustomAdmonition: 'カスタムタイトル',
    modSpoiler: 'Spoiler 隠す', modExcerpt: '抜粋区切り',
    modInlineMath: 'インライン数式', modBlockMath: 'ブロック数式',
    modFlowchart: 'フローチャート', modSequence: 'シーケンス図', modGantt: 'ガントチャート',
    modClassDiag: 'クラス図', modPie: '円グラフ', modState: '状態図',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: '標準記事', modEncArticle: '暗号化記事', modPinArticle: 'ピン留め公告', modTutorial: '技術チュートリアル'
  }
};

let currentLang = 'en';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.en[key]) || key;
}

function applyI18n() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'TITLE') {document.title = t(key);}
    else {el.textContent = t(key);}
  });
  // Titles (tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  // Update html lang attribute
  const langMap = { 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en', ja: 'ja' };
  document.documentElement.lang = langMap[currentLang] || 'en';
  // Re-render modules with new language
  renderModules($('#moduleSearch').value);
}

// ========== Code Snippet Localization ==========
const CODE_TRANSLATIONS = {
  'zh-TW': {
    'This is an encrypted article. Enter the correct password to view.': '這是一篇加密文章，只有輸入正確密碼才能查看', 'Admonition content with custom title.': '帶有自訂標題的提示框內容', 'Encrypted article requiring password': '需要密碼存取的加密文章', 'Technical tutorial description': '技術教學描述',
    'Encrypted article description': '加密文章描述', 'Introduction paragraph here.': '這裡是文章開頭部分', 'Pinned article description': '置頂文章描述', 'Encrypted Article Example': '加密文章範例',
    'Technical Tutorial Title': '技術教學標題', 'Important content here.': '重要資訊內容', 'Protected content here.': '這裡包含需要保護的內容', 'Announcement details...': '公告詳情',
    'Introduction paragraph.': '簡介段落', 'Important Announcement': '重要公告', 'Concept explanation...': '概念說明', 'Warning content here.': '警告內容',
    'Caution content here.': '注意事項內容', 'Article description': '文章描述', 'Note content here.': '提示資訊內容', 'Important Reminder': '重要提醒',
    'Encrypted Article': '加密文章', 'Tip content here.': '技巧與建議內容', 'Encrypted Content': '加密內容', 'Second paragraph': '引用第二段',
    'Project Timeline': '專案時間線', 'Summary section.': '文章總結部分', 'Important notice': '重要通知', 'Incomplete task': '未完成任務',
    'Practical Usage': '實際應用', 'Pinned Article': '置頂文章', 'Completed task': '已完成任務', 'Quoted content': '引用內容',
    'Hidden content': '隱藏的內容', 'Submit request': '提交請求', 'Body text with': '正文內容，支持', 'Sensitive Info': '敏感資訊',
    'Please note...': '請注意', 'Basic Concepts': '基本概念', 'Article Title': '文章標題', 'Draft Article': '草稿文章',
    'Return result': '回傳結果', 'Data Analysis': '資料分析', 'Section Title': '二級標題', 'Tech Tutorial': '技術教學',
    'Announcement': '公告', 'Deleted text': '刪除文字', 'Custom Title': '自訂標題', 'Requirements': '需求分析',
    'Example Code': '範例程式碼', 'Tip content.': '技巧內容', 'HTML content': 'HTML內容', 'Italic text': '斜體文字',
    'List item 1': '清單項一', 'List item 2': '清單項二', 'List item 3': '清單項三', 'Second item': '第二項',
    'inline code': '行內程式碼', 'Image title': '圖片標題', 'Show result': '顯示結果', 'Development': '開發',
    'VIDEO_BV_ID': '影片BV號', 'Entire site': '全站', 'Useful Tips': '實用技巧', 'First item': '第一項',
    'Third item': '第三項', 'Category A': '分類A', 'Category B': '分類B', 'Category C': '分類C',
    'Main Title': '文章主標題', 'Subsection': '三級標題', 'Encrypted': '加密', 'Bold text': '粗體文字',
    'Todo item': '待辦事項', 'code here': '程式碼內容', 'Link text': '連結文字', 'user/repo': '使用者名稱/儲存庫名稱',
    'Condition': '條件判斷', 'Process 1': '處理步驟1', 'Process 2': '處理步驟2', 'Send data': '傳送資料',
    'UI Design': 'UI設計', 'Reviewing': '審核中', 'Published': '已發佈', 'Important': '重要',
    'Category': '分類名稱', 'Security': '安全', 'Alt text': '替代文字', 'Frontend': '前端開發',
    'username': '使用者名稱', 'password': '密碼', 'Archived': '已歸檔', 'VIDEO_ID': '影片ID',
    'Tutorial': '教學', 'Keywords': '關鍵詞', 'keyword1': '關鍵詞1', 'keyword2': '關鍵詞2',
    'Example': '範例', 'Heading': '標題', 'Content': '內容', 'Backend': '後端開發',
    'Article': '文章', 'publish': '發佈', 'Approve': '通過', 'Archive': '歸檔',
    'Summary': '總結', 'Details': '詳細內容', 'Server': '伺服器', 'Design': '設計',
    'logout': '登出', 'writes': '撰寫', 'Others': '其他', 'Submit': '提交',
    'Reject': '拒絕', 'Draft': '草稿', 'Col 1': '欄1', 'Col 2': '欄2',
    'Col 3': '欄3', 'Start': '開始', 'login': '登入', 'Scope': '影響範圍',
    'Tag1': '標籤1', 'Tag2': '標籤2', 'code': '程式碼', 'User': '使用者',
    'Date': '時間', 'Tech': '技術', 'Yes': '是', 'End': '結束',
    'App': '應用', 'TBD': '待定', 'No': '否',
  },
  en: {
    '文章标题': 'Article Title', '文章描述': 'Article description', '标签1': 'Tag1', '标签2': 'Tag2', '分类名称': 'Category',
    '加密文章': 'Encrypted Article', '加密文章描述': 'Encrypted article description', '加密': 'Encrypted', '安全': 'Security',
    '置顶文章': 'Pinned Article', '置顶文章描述': 'Pinned article description', '公告': 'Announcement',
    '草稿文章': 'Draft Article', '草稿': 'Draft', '示例': 'Example',
    '标题': 'Heading', '加粗文本': 'Bold text', '斜体文本': 'Italic text', '删除文本': 'Deleted text',
    '列表项一': 'List item 1', '列表项二': 'List item 2', '列表项三': 'List item 3',
    '第一项': 'First item', '第二项': 'Second item', '第三项': 'Third item',
    '已完成任务': 'Completed task', '未完成任务': 'Incomplete task', '待办事项': 'Todo item',
    '引用内容': 'Quoted content', '引用第二段': 'Second paragraph',
    '行内代码': 'inline code', '代码内容': 'code here', '代码': 'code',
    '链接文本': 'Link text', '替代文本': 'Alt text', '图片标题': 'Image title',
    '内容': 'Content', '列1': 'Col 1', '列2': 'Col 2', '列3': 'Col 3',
    '用户名/仓库名': 'user/repo',
    '提示信息内容': 'Note content here.', '技巧和建议内容': 'Tip content here.',
    '重要信息内容': 'Important content here.', '警告内容': 'Warning content here.', '注意事项内容': 'Caution content here.',
    '自定义标题': 'Custom Title', '带有自定义标题的提示框内容': 'Admonition content with custom title.',
    '隐藏的内容': 'Hidden content',
    '开始': 'Start', '条件判断': 'Condition', '是': 'Yes', '否': 'No',
    '处理步骤1': 'Process 1', '处理步骤2': 'Process 2', '结束': 'End',
    '用户': 'User', '应用': 'App', '服务器': 'Server',
    '提交请求': 'Submit request', '发送数据': 'Send data', '返回结果': 'Return result', '显示结果': 'Show result',
    '项目时间线': 'Project Timeline', '设计': 'Design', '需求分析': 'Requirements', 'UI设计': 'UI Design',
    '开发': 'Development', '前端开发': 'Frontend', '后端开发': 'Backend',
    '用户名': 'username', '密码': 'password', '登录': 'login', '退出': 'logout',
    '文章': 'Article', '发布': 'publish', '撰写': 'writes',
    '数据分析': 'Data Analysis', '分类A': 'Category A', '分类B': 'Category B', '分类C': 'Category C', '其他': 'Others',
    '审核中': 'Reviewing', '提交': 'Submit', '拒绝': 'Reject', '已发布': 'Published', '通过': 'Approve', '已归档': 'Archived', '归档': 'Archive',
    '视频ID': 'VIDEO_ID', '视频BV号': 'VIDEO_BV_ID',
    '文章主标题': 'Main Title', '这里是文章开头部分': 'Introduction paragraph here.',
    '二级标题': 'Section Title', '正文内容，支持': 'Body text with',
    '三级标题': 'Subsection', '文章总结部分': 'Summary section.', '总结': 'Summary',
    '加密内容': 'Encrypted Content', '这是一篇加密文章，只有输入正确密码才能查看': 'This is an encrypted article. Enter the correct password to view.',
    '敏感信息': 'Sensitive Info', '这里包含需要保护的内容': 'Protected content here.',
    '重要公告': 'Important Announcement', '重要通知': 'Important notice', '重要': 'Important',
    '时间': 'Date', '待定': 'TBD', '影响范围': 'Scope', '全站': 'Entire site',
    '详细内容': 'Details', '公告详情': 'Announcement details...', '重要提醒': 'Important Reminder', '请注意': 'Please note...',
    '技术教程标题': 'Technical Tutorial Title', '技术教程描述': 'Technical tutorial description',
    '教程': 'Tutorial', '技术': 'Tech', '技术教程': 'Tech Tutorial',
    '简介段落': 'Introduction paragraph.', '基本概念': 'Basic Concepts', '概念说明': 'Concept explanation...',
    '示例代码': 'Example Code', '实际应用': 'Practical Usage', '实用技巧': 'Useful Tips', '技巧内容': 'Tip content.',
    '关键词': 'Keywords', '关键词1': 'keyword1', '关键词2': 'keyword2',
    'HTML内容': 'HTML content',
    '需要密码访问的加密文章': 'Encrypted article requiring password',
    '加密文章示例': 'Encrypted Article Example'
  },
  ja: {
    'Admonition content with custom title.': 'カスタムタイトル付きの内容。', 'Encrypted article description': '暗号化記事の説明', 'Pinned article description': 'ピン留め記事の説明', 'Important content here.': '重要な内容。',
    'Warning content here.': '警告の内容。', 'Caution content here.': '注意の内容。', 'Article description': '記事の説明', 'Note content here.': 'ノートの内容。',
    'Encrypted Article': '暗号化記事', 'Tip content here.': 'ヒントの内容。', 'Second paragraph': '引用の第2段落', 'Project Timeline': 'プロジェクトタイムライン',
    'Incomplete task': '未完了タスク', 'Pinned Article': 'ピン留め記事', 'Completed task': '完了タスク', 'Quoted content': '引用文',
    'Hidden content': '隠された内容', 'Submit request': 'リクエスト送信', 'Basic Concepts': '基本概念', 'Article Title': '記事タイトル',
    'Draft Article': '下書き記事', 'Return result': '結果返却', 'Announcement': 'お知らせ', 'Deleted text': '取消テキスト',
    'Custom Title': 'カスタムタイトル', 'Requirements': '要件分析', 'HTML content': 'HTML内容', 'Italic text': '斜体テキスト',
    'List item 1': 'リスト項目1', 'List item 2': 'リスト項目2', 'List item 3': 'リスト項目3', 'Second item': '2番目の項目',
    'inline code': 'インラインコード', 'Image title': '画像タイトル', 'Show result': '結果表示', 'First item': '最初の項目',
    'Third item': '3番目の項目', 'Encrypted': '暗号化', 'Bold text': '太字テキスト', 'Todo item': 'TODO項目',
    'code here': 'コードの内容', 'Link text': 'リンクテキスト', 'user/repo': 'ユーザー名/リポジトリ名', 'Condition': '条件分岐',
    'Process 1': '処理ステップ1', 'Process 2': '処理ステップ2', 'Send data': 'データ送信', 'Important': '重要',
    'Category': 'カテゴリ名', 'Security': 'セキュリティ', 'Alt text': '代替テキスト', 'Example': 'サンプル',
    'Heading': '見出し', 'Content': '内容', 'Server': 'サーバー', 'Draft': '下書き',
    'Col 1': '列1', 'Col 2': '列2', 'Col 3': '列3', 'Start': '開始',
    'Tag1': 'タグ1', 'Tag2': 'タグ2', 'code': 'コード', 'User': 'ユーザー',
    'Yes': 'はい', 'End': '終了', 'App': 'アプリ', 'No': 'いいえ',
  }


};

function localizeCode(code) {
  if (currentLang === 'en' || currentLang === 'zh-CN') {return code;}
  const map = CODE_TRANSLATIONS[currentLang];
  if (!map) {return code;}
  // Sort keys by length descending so longer phrases are replaced first
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  let result = code;
  keys.forEach(k => {
    result = result.split(k).join(map[k]);
  });
  return result;
}

// ========== Module Data ==========
const MODULES = [
  { catKey: 'catFrontMatter', icon: '⚙️', items: [
    { nameKey: 'modBasicConfig', icon: '📋', code: '---\ntitle: "Article Title"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "Article description"\nimage: "./cover.webp"\ntags: [Tag1, Tag2]\ncategory: Category\ndraft: false\npinned: false\ncomment: true\n---\n\n' },
    { nameKey: 'modEncryptConfig', icon: '🔒', code: '---\ntitle: "Encrypted Article"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "Encrypted article description"\nencrypted: true\npassword: "123456"\ntags: [Encrypted]\ncategory: Security\n---\n\n' },
    { nameKey: 'modPinConfig', icon: '📌', code: '---\ntitle: "Pinned Article"\npublished: ' + new Date().toISOString().split('T')[0] + '\npinned: true\npriority: 0\ndescription: "Pinned article description"\ntags: [Announcement]\ncategory: Announcement\n---\n\n' },
    { nameKey: 'modDraftConfig', icon: '📝', code: '---\ntitle: "Draft Article"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndraft: true\ntags: [Draft]\ncategory: Example\n---\n\n' }
  ]},
  { catKey: 'catBasicMd', icon: '✏️', items: [
    { nameKey: 'modH1', icon: 'H1', code: '# Heading\n\n' },
    { nameKey: 'modH2', icon: 'H2', code: '## Heading\n\n' },
    { nameKey: 'modH3', icon: 'H3', code: '### Heading\n\n' },
    { nameKey: 'modBold', icon: 'B', code: '**Bold text**' },
    { nameKey: 'modItalic', icon: 'I', code: '*Italic text*' },
    { nameKey: 'modStrike', icon: 'S', code: '~~Deleted text~~' },
    { nameKey: 'modUl', icon: '⊙', code: '- List item 1\n- List item 2\n- List item 3\n\n' },
    { nameKey: 'modOl', icon: '①', code: '1. First item\n2. Second item\n3. Third item\n\n' },
    { nameKey: 'modTask', icon: '☑', code: '- [x] Completed task\n- [ ] Incomplete task\n- [ ] Todo item\n\n' },
    { nameKey: 'modQuote', icon: '❝', code: '> Quoted content\n>\n> Second paragraph\n\n' },
    { nameKey: 'modInlineCode', icon: '⌥', code: '`inline code`' },
    { nameKey: 'modCodeBlock', icon: '{ }', code: '```javascript\n// code here\nconsole.log("Hello");\n```\n\n' },
    { nameKey: 'modLink', icon: '🔗', code: '[Link text](https://example.com "Heading")' },
    { nameKey: 'modImage', icon: '🖼', code: '![Alt text](./images/photo.png "Image title")\n\n' },
    { nameKey: 'modTable', icon: '▦', code: '| Col 1 | Col 2 | Col 3 |\n|------|------|------|\n| Content | Content | Content |\n| Content | Content | Content |\n\n' },
    { nameKey: 'modHr', icon: '─', code: '\n---\n\n' },
    { nameKey: 'modHtml', icon: '🏷', code: '<div class="custom">\n  HTML content\n</div>\n\n' }
  ]},
  { catKey: 'catExtended', icon: '🚀', items: [
    { nameKey: 'modGithubCard', icon: '🐙', code: ':::github{repo="user/repo"}\n\n' },
    { nameKey: 'modNote', icon: '💡', code: '::::note\nNote content here.\n::::\n\n' },
    { nameKey: 'modTip', icon: '💚', code: '::::tip\nTip content here.\n::::\n\n' },
    { nameKey: 'modImportant', icon: '💜', code: '::::important\nImportant content here.\n::::\n\n' },
    { nameKey: 'modWarning', icon: '⚠️', code: '::::warning\nWarning content here.\n::::\n\n' },
    { nameKey: 'modCaution', icon: '🔴', code: '::::caution\nCaution content here.\n::::\n\n' },
    { nameKey: 'modCustomAdmonition', icon: '📌', code: '::::note[Custom Title]\nAdmonition content with custom title.\n::::\n\n' },
    { nameKey: 'modSpoiler', icon: '👁', code: ':spoiler[Hidden content]' },
    { nameKey: 'modExcerpt', icon: '✂️', code: '\n<!--more-->\n\n' },
    { nameKey: 'modInlineMath', icon: '∑', code: '$E = mc^2$' },
    { nameKey: 'modBlockMath', icon: '∫', code: '$$\n\\\\int_{-\\\\infty}^{\\\\infty} e^{-x^2} dx = \\\\sqrt{\\\\pi}\n$$\n\n' }
  ]},
  { catKey: 'catMermaid', icon: '📊', items: [
    { nameKey: 'modFlowchart', icon: '🔀', code: '```mermaid\ngraph TD\n    A[Start] --> B{Condition}\n    B -->|Yes| C[Process 1]\n    B -->|No| D[Process 2]\n    C --> E[End]\n    D --> E\n```\n\n' },
    { nameKey: 'modSequence', icon: '⏱', code: '```mermaid\nsequenceDiagram\n    participant User\n    participant App\n    participant Server\n    User->>App: Submit request\n    App->>Server: Send data\n    Server-->>App: Return result\n    App-->>User: Show result\n```\n\n' },
    { nameKey: 'modGantt', icon: '📅', code: '```mermaid\ngantt\n    title Project Timeline\n    dateFormat YYYY-MM-DD\n    section Design\n    Requirements :a1, 2024-01-01, 7d\n    UI Design   :a2, after a1, 10d\n    section Development\n    Frontend :b1, 2024-01-15, 15d\n    Backend :b2, 2024-01-20, 18d\n```\n\n' },
    { nameKey: 'modClassDiag', icon: '🏗', code: '```mermaid\nclassDiagram\n    class User {\n        +username\n        +password\n        +login()\n        +logout()\n    }\n    class Article {\n        +title\n        +content\n        +publish()\n    }\n    User "1" -- "*" Article : writes\n```\n\n' },
    { nameKey: 'modPie', icon: '🥧', code: '```mermaid\npie title Data Analysis\n    "Category A" : 45.6\n    "Category B" : 30.1\n    "Category C" : 15.3\n    "Others"  : 9.0\n```\n\n' },
    { nameKey: 'modState', icon: '🔄', code: '```mermaid\nstateDiagram-v2\n    [*] --> Draft\n    Draft --> Reviewing : Submit\n    Reviewing --> Draft : Reject\n    Reviewing --> Published : Approve\n    Published --> Archived : Archive\n```\n\n' }
  ]},
  { catKey: 'catVideo', icon: '🎬', items: [
    { nameKey: 'modYoutube', icon: '▶️', code: '<iframe width="100%" height="468" src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube" frameborder="0" allowfullscreen></iframe>\n\n' },
    { nameKey: 'modBilibili', icon: '📺', code: '<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=VIDEO_BV_ID&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>\n\n' }
  ]},
  { catKey: 'catTemplates', icon: '📑', items: [
    { nameKey: 'modStdArticle', icon: '📄', code: '---\ntitle: "Article Title"\npublished: ' + new Date().toISOString().split('T')[0] + '\nupdated: \ndescription: "Article description"\nimage: ./cover.webp\ntags: [Tag1, Tag2]\ncategory: Category\ndraft: false\npinned: false\ncomment: true\n---\n\n# Main Title\n\nIntroduction paragraph here.\n\n<!--more-->\n\n## Section Title\n\nBody text with **bold**, *italic*, and `inline code`.\n\n### Subsection\n\n- List item 1\n- List item 2\n\n```javascript\nconsole.log("Hello World");\n```\n\n> Quoted content\n\n---\n\n## Summary\n\nSummary section.\n' },
    { nameKey: 'modEncArticle', icon: '🔐', code: '---\ntitle: "Encrypted Article Example"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "Encrypted article requiring password"\nencrypted: true\npassword: "myPassword123"\ntags: [Encrypted, Security]\ncategory: Security\n---\n\n# 🔒 Encrypted Content\n\n> This is an encrypted article. Enter the correct password to view.\n\n## Sensitive Info\n\nProtected content here.\n' },
    { nameKey: 'modPinArticle', icon: '📢', code: '---\ntitle: "Important Announcement"\npublished: ' + new Date().toISOString().split('T')[0] + '\npinned: true\npriority: 0\ndescription: "Important notice"\ntags: [Announcement, Important]\ncategory: Announcement\n---\n\n# 🚨 Important Announcement\n\n> 📅 **Date**: TBD\n> 🔧 **Scope**: Entire site\n\n## Details\n\nAnnouncement details...\n\n::::warning[Important Reminder]\nPlease note...\n::::\n' },
    { nameKey: 'modTutorial', icon: '🎓', code: '---\ntitle: "Technical Tutorial Title"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "Technical tutorial description"\nimage: "./cover.webp"\ntags: [Tutorial, Tech]\ncategory: Tech Tutorial\nlicenseName: "CC BY-NC-SA 4.0"\n---\n\n# Technical Tutorial Title\n\nIntroduction paragraph.\n\n<!--more-->\n\n## Basic Concepts\n\nConcept explanation...\n\n### Example Code\n\n```python\ndef hello():\n    print("Hello World")\n```\n\n## Practical Usage\n\n::::tip[Useful Tips]\nTip content.\n::::\n\n```mermaid\ngraph TD\n    A[Start] --> B[End]\n```\n\n## Summary\n\n**Keywords**: keyword1, keyword2\n' }
  ]}
];

// ========== DOM References ==========
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const editor = $('#editor');
const preview = $('#preview');
const moduleList = $('#moduleList');
const modulePanel = $('#modulePanel');
const editorSection = $('#editorSection');
const previewSection = $('#previewSection');

// ========== Theme Color ==========
function setHue(h) {
  document.documentElement.style.setProperty('--hue', h);
  $('#huePreview').style.background = `hsl(${h} 70% 55%)`;
  localStorage.setItem('mizuki-editor-hue', h);
}

$('#themePickerBtn').onclick = () => $('#themePickerPanel').classList.toggle('hidden');
$('#hueSlider').oninput = e => setHue(e.target.value);
$$('.preset').forEach(p => p.onclick = () => {
  const h = p.dataset.hue;
  $('#hueSlider').value = h;
  setHue(h);
});

// Restore saved hue
const savedHue = localStorage.getItem('mizuki-editor-hue');
if (savedHue) { $('#hueSlider').value = savedHue; setHue(savedHue); }
else { setHue(60); }

// Close picker on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.theme-picker-btn') && !e.target.closest('.theme-picker-panel'))
    {$('#themePickerPanel').classList.add('hidden');}
  if (!e.target.closest('#btnLang') && !e.target.closest('.lang-dropdown'))
    {$('#langDropdown').classList.add('hidden');}
});

// ========== Theme Switching ==========
const THEME_CLASSES = ['theme-light', 'theme-deep-blue', 'theme-high-contrast'];
const hljsStyleLink = document.querySelector('link[href*="highlight.js"]');

function setTheme(theme) {
  THEME_CLASSES.forEach(c => document.body.classList.remove(c));
  if (theme !== 'dark') {
    document.body.classList.add('theme-' + theme);
  }
  if (hljsStyleLink) {
    hljsStyleLink.href = theme === 'light'
      ? 'https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css'
      : 'https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github-dark.min.css';
  }
  $$('.theme-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.theme === theme);
  });
  localStorage.setItem('mizuki-editor-theme', theme);
  updatePreview();
}

$$('.theme-opt').forEach(opt => {
  opt.onclick = () => setTheme(opt.dataset.theme);
});

const savedTheme = localStorage.getItem('mizuki-editor-theme');
if (savedTheme && savedTheme !== 'dark') {
  setTheme(savedTheme);
}

// ========== Language Switching ==========
$('#btnLang').onclick = () => $('#langDropdown').classList.toggle('hidden');

function setLanguage(lang) {
  currentLang = lang;
  $$('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
  localStorage.setItem('mizuki-editor-lang', lang);
  applyI18n();
}

$$('.lang-opt').forEach(opt => {
  opt.onclick = () => {
    setLanguage(opt.dataset.lang);
    $('#langDropdown').classList.add('hidden');
  };
});

// Restore saved language
const savedLang = localStorage.getItem('mizuki-editor-lang');
if (savedLang && I18N[savedLang]) {
  setLanguage(savedLang);
} else {
  applyI18n(); // apply default en
}

// ========== Module Panel ==========
function renderModules(filter = '') {
  moduleList.innerHTML = '';
  const f = filter.toLowerCase();
  MODULES.forEach(cat => {
    const catName = t(cat.catKey);
    const items = cat.items.filter(i => {
      const itemName = t(i.nameKey);
      return !f || itemName.toLowerCase().includes(f) || catName.toLowerCase().includes(f);
    });
    if (!items.length) {return;}
    const catEl = document.createElement('div');
    catEl.className = 'module-category';
    catEl.innerHTML = `<div class="module-cat-header"><span class="arrow">▼</span>${cat.icon} ${catName}</div><div class="module-cat-items"></div>`;
    const itemsEl = catEl.querySelector('.module-cat-items');
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'module-item';
      el.innerHTML = `<span class="icon">${item.icon}</span>${t(item.nameKey)}`;
      el.onclick = () => insertAtCursor(localizeCode(item.code));
      el.draggable = true;
      el.ondragstart = e => e.dataTransfer.setData('text/plain', localizeCode(item.code));
      itemsEl.appendChild(el);
    });
    catEl.querySelector('.module-cat-header').onclick = function() {
      this.classList.toggle('collapsed');
      itemsEl.classList.toggle('collapsed');
    };
    moduleList.appendChild(catEl);
  });
}

$('#moduleSearch').oninput = e => renderModules(e.target.value);
renderModules();

// Toggle panel
$('#toggleModules').onclick = () => modulePanel.classList.toggle('collapsed');

// ========== Editor Core ==========
function insertAtCursor(text) {
  editor.focus();
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const val = editor.value;
  editor.value = val.substring(0, start) + text + val.substring(end);
  const newPos = start + text.length;
  editor.setSelectionRange(newPos, newPos);
  updatePreview();
}

// Toolbar commands
$$('[data-cmd]').forEach(btn => {
  btn.onclick = () => {
    const cmd = btn.dataset.cmd;
    const map = {
      heading: '## ', bold: '**Bold**', italic: '*Italic*', strikethrough: '~~Deleted~~',
      ul: '- ', ol: '1. ', task: '- [ ] ', quote: '> ',
      code: '`code`', codeblock: '```\ncode\n```\n',
      link: '[text](url)', image: '![description](url)',
      table: '| Col 1 | Col 2 |\n|------|------|\n| Content | Content |\n',
      hr: '\n---\n'
    };
    if (map[cmd]) {insertAtCursor(map[cmd]);}
  };
});

// Tab key support
editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    insertAtCursor('  ');
  }
});

// Drop support on editor
editor.addEventListener('dragover', e => e.preventDefault());
editor.addEventListener('drop', e => {
  e.preventDefault();
  const text = e.dataTransfer.getData('text/plain');
  if (text) {insertAtCursor(text);}
});

// ========== Preview ==========
function updatePreview() {
  if (previewSection.classList.contains('hidden')) {return;}
  let content = editor.value;
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3);
    if (end !== -1) {content = content.substring(end + 3).trim();}
  }
  try {
    preview.innerHTML = marked.parse(content, {
      gfm: true, breaks: true,
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {return hljs.highlight(code, { language: lang }).value;}
        return hljs.highlightAuto(code).value;
      }
    });
  } catch(e) {
    preview.innerHTML = marked.parse(content);
  }
}

let previewTimer;
let saveTimer;
editor.addEventListener('input', () => {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(updatePreview, 300);
  // Auto-save content
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem('mizuki-editor-content', editor.value);
  }, 500);
});

// ========== View Switching ==========
$$('.view-btn').forEach(btn => {
  btn.onclick = () => {
    $$('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    if (view === 'edit') {
      editorSection.classList.remove('hidden');
      previewSection.classList.add('hidden');
    } else if (view === 'preview') {
      editorSection.classList.add('hidden');
      previewSection.classList.remove('hidden');
      updatePreview();
    } else {
      editorSection.classList.remove('hidden');
      previewSection.classList.remove('hidden');
      updatePreview();
    }
  };
});

// ========== Front Matter Modal ==========
function toggleModal(id, show) {
  const m = document.getElementById(id);
  if (show) {m.classList.remove('hidden');}
  else {m.classList.add('hidden');}
}
window.toggleModal = toggleModal;

$('#btnFrontMatter').onclick = () => { parseFMFromEditor(); toggleModal('fmModal', true); };
$('#fmClose').onclick = () => toggleModal('fmModal', false);
$('#fmCancel').onclick = () => toggleModal('fmModal', false);
$('#fmModal .modal-overlay').onclick = () => toggleModal('fmModal', false);

$('#fm-encrypted').onchange = function() {
  $('#fm-password-row').classList.toggle('hidden', !this.checked);
};

function parseFMFromEditor() {
  const val = editor.value;
  if (!val.startsWith('---')) {return;}
  const end = val.indexOf('---', 3);
  if (end === -1) {return;}
  const yaml = val.substring(3, end).trim();
  const lines = yaml.split('\n');
  lines.forEach(line => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) {return;}
    const [, key, value] = m;
    const v = value.replace(/^["']|["']$/g, '').trim();
    const el = document.getElementById('fm-' + key);
    if (el) {
      if (el.type === 'checkbox') {el.checked = v === 'true';}
      else {el.value = v;}
    }
    if (key === 'tags') {
      $('#fm-tags').value = v.replace(/[\[\]]/g, '');
    }
  });
  if ($('#fm-encrypted').checked) {$('#fm-password-row').classList.remove('hidden');}
}

$('#fmApply').onclick = () => {
  let fm = '---\n';
  const add = (k, v) => { if (v) {fm += `${k}: ${v}\n`;} };
  const addQ = (k, v) => { if (v) {fm += `${k}: "${v}"\n`;} };
  addQ('title', $('#fm-title').value);
  add('published', $('#fm-published').value);
  if ($('#fm-updated').value) {add('updated', $('#fm-updated').value);}
  addQ('description', $('#fm-description').value);
  if ($('#fm-image').value) {add('image', $('#fm-image').value);}
  if ($('#fm-tags').value) {
    const tags = $('#fm-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    fm += `tags: [${tags.join(', ')}]\n`;
  }
  if ($('#fm-category').value) {add('category', $('#fm-category').value);}
  fm += `draft: ${$('#fm-draft').checked}\n`;
  fm += `pinned: ${$('#fm-pinned').checked}\n`;
  if ($('#fm-pinned').checked && $('#fm-priority').value) {add('priority', $('#fm-priority').value);}
  fm += `comment: ${$('#fm-comment').checked}\n`;
  if ($('#fm-encrypted').checked) {
    fm += 'encrypted: true\n';
    addQ('password', $('#fm-password').value);
  }
  if ($('#fm-alias').value) {addQ('alias', $('#fm-alias').value);}
  if ($('#fm-lang').value) {add('lang', $('#fm-lang').value);}
  if ($('#fm-license').value) {addQ('licenseName', $('#fm-license').value);}
  if ($('#fm-author').value) {addQ('author', $('#fm-author').value);}
  if ($('#fm-source').value) {addQ('sourceLink', $('#fm-source').value);}
  fm += '---\n\n';

  let content = editor.value;
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3);
    if (end !== -1) {content = content.substring(end + 3).trimStart();}
  }
  editor.value = fm + content;
  toggleModal('fmModal', false);
  updatePreview();
};

// ========== Import ==========
$('#btnImport').onclick = () => $('#fileInput').click();
$('#fileInput').onchange = e => {
  const file = e.target.files[0];
  if (file) {readFile(file);}
  e.target.value = '';
};

function readFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    let content = e.target.result;
    if (file.name.endsWith('.html')) {
      const tmp = document.createElement('div');
      tmp.innerHTML = content;
      content = tmp.textContent || tmp.innerText;
    }
    editor.value = content;
    updatePreview();
  };
  reader.readAsText(file);
}

// Drag & drop file import
document.addEventListener('dragover', e => {
  e.preventDefault();
  if (e.dataTransfer.types.includes('Files'))
    {$('#dropOverlay').classList.remove('hidden');}
});
$('#dropOverlay').addEventListener('dragleave', e => {
  if (e.target === $('#dropOverlay') || e.target.closest('.drop-message'))
    {$('#dropOverlay').classList.add('hidden');}
});
$('#dropOverlay').addEventListener('drop', e => {
  e.preventDefault();
  $('#dropOverlay').classList.add('hidden');
  const file = e.dataTransfer.files[0];
  if (file) {readFile(file);}
});

// ========== Export ==========
$('#btnExport').onclick = () => toggleModal('exportModal', true);
$('#exportModal .modal-overlay').onclick = () => toggleModal('exportModal', false);

$$('.export-btn').forEach(btn => {
  btn.onclick = () => {
    const fmt = btn.dataset.format;
    let content, filename, mime;
    const raw = editor.value;
    if (fmt === 'md') {
      content = raw; filename = 'article.md'; mime = 'text/markdown';
    } else if (fmt === 'html') {
      let body = raw;
      if (body.startsWith('---')) {
        const end = body.indexOf('---', 3);
        if (end !== -1) {body = body.substring(end + 3).trim();}
      }
      const html = marked.parse(body);
      content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Article</title><style>body{font-family:system-ui;max-width:800px;margin:2em auto;padding:0 1em;line-height:1.7;color:#222}code{background:#f4f4f4;padding:2px 6px;border-radius:4px}pre{background:#f4f4f4;padding:1em;border-radius:8px;overflow-x:auto}blockquote{border-left:3px solid #ddd;padding:.5em 1em;color:#666;margin:1em 0}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px 12px}th{background:#f0f0f0}</style></head><body>${html}</body></html>`;
      filename = 'article.html'; mime = 'text/html';
    } else {
      let txt = raw;
      if (txt.startsWith('---')) {
        const end = txt.indexOf('---', 3);
        if (end !== -1) {txt = txt.substring(end + 3).trim();}
      }
      content = txt.replace(/[#*`~>[\]()_|\\-]/g, '').replace(/\n{3,}/g, '\n\n');
      filename = 'article.txt'; mime = 'text/plain';
    }
    const blob = new Blob([content], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click(); URL.revokeObjectURL(url);
    toggleModal('exportModal', false);
  };
});

// ========== Init ==========
// Restore saved content
const savedContent = localStorage.getItem('mizuki-editor-content');
if (savedContent) {
  editor.value = savedContent;
  updatePreview();
}

$('#fm-published').value = new Date().toISOString().split('T')[0];

// Save on page unload as safety net
window.addEventListener('beforeunload', () => {
  if (editor.value.trim()) {
    localStorage.setItem('mizuki-editor-content', editor.value);
  }
});

})();
