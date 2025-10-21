require("dotenv").config();
const settings = require("../../helpers/constants");
const path = require("path");

const allSettings = settings.ALL_NOTE_SETTINGS;

// 微信验证文件配置
const WECHAT_VERIFICATION_FILE = "f952a42c560e851c448d41642fcb431b.txt";
const WECHAT_CONTENT = "b56b89b01f1337ef4f09ed67fca5cabdaed39964";

module.exports = {
  eleventyComputed: {
    layout: (data) => {
      if (data.tags.indexOf("gardenEntry") != -1) {
        return "layouts/index.njk";
      }
      return "layouts/note.njk";
    },
    permalink: (data) => {
      // 特殊处理微信验证文件
      if (data.page && data.page.inputPath) {
        const fileName = path.basename(data.page.inputPath, path.extname(data.page.inputPath));
        if (fileName === WECHAT_VERIFICATION_FILE) {
          return `/${WECHAT_VERIFICATION_FILE}`;
        }
      }
      
      if (data.tags.indexOf("gardenEntry") != -1) {
        return "/";
      }
      return data.permalink || undefined;
    },
    settings: (data) => {
      const noteSettings = {};
      allSettings.forEach((setting) => {
        let noteSetting = data[setting];
        let globalSetting = process.env[setting];

        let settingValue =
          noteSetting || (globalSetting === "true" && noteSetting !== false);
        noteSettings[setting] = settingValue;
      });
      return noteSettings;
    },
    // 添加内容处理逻辑
    content: (data) => {
      // 如果是微信验证文件，直接返回指定内容
      if (data.page && data.page.inputPath) {
        const fileName = path.basename(data.page.inputPath, path.extname(data.page.inputPath));
        if (fileName === WECHAT_VERIFICATION_FILE) {
          return WECHAT_CONTENT;
        }
      }
      return data.content;
    }
  },
};
