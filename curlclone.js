const axios = require('axios');
const { program } = require('commander');
const fs = require('fs');

// コマンドライン引数の設定
program
  .argument('<url>', 'URL')  // URLは必須引数
  .option('-o, --output <file>', 'ファイルにデータを保存：-o ファイル名')  // ファイルに保存するオプション
  .option('-v, --verbose', '詳細な出力')  // 詳細な出力を有効にするオプション
  .option('-X, --request <method>', 'リクエストメソッドの指定：-X POSTでPOSTリクエストができる', 'GET')  // リクエストメソッドの指定、デフォルトはGET
  .option('-d, --data <data>', 'データを送信する(POST)')  // データを送信するオプション
  .parse(process.argv);

const url = program.args[0];
const options = program.opts();

console.log(options.optionName);

// ヘッダーとリクエストデータの設定
let axiosConfig = {
  method: options.request,
  url: url
};

// データ送信がある場合
if (options.data) {
  axiosConfig.data = options.data;
}

// リクエストの送信
axios(axiosConfig)
  .then(response => {
    if (options.verbose) {
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
    }

    // 出力をファイルに保存するか、コンソールに出力するか
    if (options.output) {
      fs.writeFileSync(options.output, response.data, 'utf8', (err) => {
        //エラー
        if(err) {
          console.log(err);
        }
      });
      console.log(`${options.output}というファイル名でデータを保存しました`);
    } else {
      console.log(response.data);
    }
  })
  .catch(error => {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Body:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  });