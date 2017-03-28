# 使い方

1. Go, Node.js, MySQL (必要に応じてPython)のインストール
2. 初期化
3. データの前処理
4. データの入力

# 1. Go, Node.js, MySQL (必要に応じてPython)のインストール
## Mac
Mac の場合はパッケージ管理に Homebrew を使うと良いです。なので今回は Homebrew を使って
環境構築していきます。Homebrew のインストールは https://brew.sh/index_ja.html
に飛んでインストール用のスクリプトをターミナルで実行します。

1. Go のインストール

```
brew update && brew install go
mkdir ~/go
echo '# golang \nexport GOPATH=$HOME/go \nexport PATH=$PATH:$GOPATH/bin' >> ~/.bash_profile
source ~/.bash_profile
```

2. Node.js のインストール

```
brew install curl
curl -L git.io/nodebrew | perl - setup
echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> ~/.bash_profile
source ~/.bash_profile
nodebrew install-binary v6.3.0
nodebrew use v6.3.0
```

3. MySQL のインストール

```
brew install mysql
```

また Mac の場合は MySQL を自動で起動するようにしておきます。

```
brew tap homebrew/services
brew services start mysql
```

4. Python とパッケージのインストール
Mac にはすでに Python が入っていますが、セキュリティ向上のために　Elcapitan あたりから
local に入れた pip によるパッケージの管理が難しくなりました。そのため virtualenv を入れて
作業する必要があります。

まず

`sudo easy_install pip && pip install virtualenv`

で pip と virtualenv をインストールします。その後プロジェクトルートに行き

`virtualenv venv`

とします。するとプロジェクトルート以下に venv というディレクトリが作られ、ここに Python
のパッケージがインストールされるようになります。そのためにはまず

```
echo 'alias venv=". venv/bin/active"' >> ~/.bash_profile
source ~/.bash_profile
venv
```

としてください。すると local での pip ではなく virtualenv で作った仮想的な環境での pip を
使うように切り替えることができます。切り替わっているかどうかは terminal の一番先頭に (venv)
といのが付きます。この状態で

`pip install numpy scipy matplotlib seaborn pandas sklearn jupyter`

とすると各パッケージをインストールできます。

`jupyter notebook`

で jupyter が起動すれば成功です。

5. R のインストール
WIP

## Windows
Windows でのインストールは基本的にバイナリを落としてきてインストールする形になります。

0. Github Desktop のインストール
https://desktop.github.com から Github Desktop をダウンロードしてインストールします。
Git が必要なのためインストールするのですが、windows で Git を使うにはこれが一番いいらしいです。

1.  Go のインストール
https://golang.org/dl/ にある go1.8.windows-amd64.msi をクリックしてダウンロードします。
その後、環境変数の設定で GOROOT の部分を C:\Go\ から C:\Go に修正します。
また GOPATH という環境変数を C:\Users\username\go で新しく追加します。
さらに Path に C:\Users\username\go\bin を追加します。
(詳しくは http://qiita.com/kent_ocean/items/566e6a23d76ef3b4d125 参照)

この後再起動します。

2. Node.js のインストール
https://nodejs.org/en/ にある v6.10.1 LTS をダウンロードします。
あとは指示に従ってインストールしてください。

3. MySQL のインストール
https://dev.mysql.com/downloads/installer/ からダウンロードします。
server だけインストールすればいいです。また root のパスワードは mysql とかに
しておきましょう。


# 2. 初期化
Mac は先程の brew services を使って起動されているはずなので、
起動していない場合は、先程のところを参照にするか、

`mysql.server start`

として起動してください。Windows の場合は多分起動しています。起動しているか
どうかの確認は Mac なら

`netstat -ant | grep 3306`

で、 Windows なら

`netstat -ant | Select-String "3306"`

として LISTENING になっていれば OK です。

次に以下のディレクトリを作成します。

`mkdir -p $GOPATH/src/github.com/mikanfactory`

このプロジェクト CanDataAnalyzer は今作ったディレクトリ以下に移動し

$GOPATH/src/github.com/mikanfactory/CanDataAnalyzer

となるように配置してください。次にプロジェクトルートで初期化コマンドを打ちます

`npm run deps`

これで初期化は終了です。ちなみにこれを実行すると、必要な Node.js と Go の
パッケージを取ってくるようになっています。

# 3. データの前処理
まずデータを CanDataAnalyzer/data/original 以下に保存してください。
この original に置かれたファイルを元に前処理を行なった結果は input に置かれ、最終的に
このアプリケーションで利用されます。

1. 読み込むデータのリストアップ

プロジェクトルートで

`npm run listUp`

としてください。すると CandataAnalyzer/config/targets.json に今配置したファイル名が
上書きされます。


2. config ファイルの自動生成 (任意)

`npm run createConfig`

とすると、CandataAnalyzer/config/cacheConfig.json が上書きされます。これは今回使うデータ
の特徴量を指定するファイルで、次のような構造になっています。

```
{
  "Summary": "average",
  "Read": true,
  "Name": "Time",
  "Type": "float64",
  "Index": 0
},
```

一番上の Summary はサマリ方を示していて、 avarage, max, min, max||min の 4 択です。
次の Read が実際にその特徴量を使うかどうかを示しています。
その次の Name はその名の通り名前です。今回 DB にこの名前で登録するため、英語にしてください。
またここは Go の規約に基づいて初め大文字でお願いします。
Type 型を示していて、ここでは int64 か float64 の 2 択です。
最後に Index は何番目のカラムなのかを示します。ここは変更しないようにお願いします。
CanDataAnalyzer/config/cacheConfigDenso.json にD社で使った際のものを残してあるので、
これを参考にしてください。ここは面倒なので自動化スクリプトを書きましたが、既にあれば
(例えば cacheConfigDenso.json を使うなど) 実行しなくても大丈夫です。また新しいカラムを追加
するのであれば、この cacheConfig.json に新しいカラムの情報を付け加えれば OK です。


3. config ファイルを Go に読み込ませる

`npm run writeSchema`

とすると上で指定した特徴量を元に Go の struct の定義を書き換えます。

4. 実際に元データに変更を加える

ここは自由にしてください。スクリプトを書いてクレンジングしたり新しい特徴量を加えたりしてください。
ただし、新しい特徴量を付け加えた場合は config ファイルを更新して(2)、それを Go に読み込ませて(3)
ください。

ここでは実際に使った、ブレーキとアクセルから変化点を検知するプログラムの走らせ方を示します。

`npm run preprocess`

とすると、OFF -> ON に変われば 2 を、ON -> OFF に変われば -1 を、それ以外で ON なら 1,
OFF なら 0 に変更します。このとき、ブレーキとアクセルのカラム名は Brake と Accel になっている
必要があります。


# 4. データの入力
このプロジェクトでは MySQL 上に 2 つの database を生成します。

+ summary
+ sp (switching point)

地図上に要約した CAN データを表示する際には summary を用い、sp には動作の切り替わり点を格納します。

summary にデータを格納するには

`npm run setupDB`

としてください。すると DB のマイグレーションを行い、input ディレクトリにあるデータ
を入力していきます。一方、sp にデータを入れるには 2 つ方法があります。

`npm run csv` または `npm run kml`

どちらも sp にデータを入れたあと、 CandataAnalyzer/data/middle に sp.csv または
sp.kml というファイルが作成されます。動作の切り替わり点を分析する際にはこのファイルを
使用しました。


# 5. 地図上に要約したCANデータの表示
データを DB に格納した状態で

`npm run server`

とすると

`http server started on [::]:1323`

と表示され、1323 ポートでアプリケーションが立ち上がります。なので chrome で localhost:1323
にアクセスしてください。そこで各特徴量の条件を元にCANデータをマップしていきます。



(注) cacheConfig.json を変更して再び server を起動した場合、Chrome にキャッシュが
残っているかもしれません。その場合は (Chromeでは) Command + Shift + R で強制リロードできます。
その際に"新しいマーカーの作成をする"を選択した場合、 features 以下が
変化していれば成功です。

## 付録
## GPSSpeed
case GPSSpeed < 10:
  return stop
case GPSSpeed >= 10 && GPSSpeed < 30:
  return green
case GPSSpeed >= 30 && GPSSpeed < 60:
  return yellow
case GPSSpeed >= 60:
  return red

## Brake (ブレーキとアクセルは踏み込んだ瞬間だけ取り出します)
case Brake == 2:
  return green

## Accel
case Accel == 2:
  return green

## SteeringPositive (右折)
case SteeringAngle > 7.5:
  return green

## SteeringNegative (左折)
case SteeringAngle < 4.8:
  return green


# 6. カウントしたデータを元にクラスタリング
非常に申し訳ないのですが、まず jupyter と pandas, seaborn, scikit-learn をダウンロードしてください。
ご存知かと思われますが、

  `sudo -H pip install numpy scipy matplotlib pandas scikit-learn seaborn jupyter`

でインストールできるはずです (sudo -H はいらないかも)。その後 CanDataAnalyzer 上で jupyter notebook
とすると localhost:8888 で jupyter が立ち上がります。 jupyter は見やすい iPython または REPL です。
(jupyter については調べると色々と出てくると思います。基本的には shift + enter で実行だとわかっていれば良いです。)

ここで CanDataAnalyzer/analysis に VBGMM-DENSO があるはずなので、これをクリックしてください。
すると僕が以前使った python コードが表示されるはずで、コメントを書いておいたのでそれをざっくり読んで
流れを掴んでください。まずは

GPSSpeed, Brake, Accel SteeringPositive, SteeringNegative

だけで実行することをおすすめします。松儀くんにやってほしいことは新しい動画からの特徴量を付け加えることなので、
実際にいじるところは DetectCount などの結果を付け加えて新しい data frame を作るところと、
ハイパーパラメータの設定だと思います。そこ以外はそのままそのコードを実行すれば良いかと思います。
最後までエラーが無く実行できればOKです。


# 7. 解析したデータを表示
解析プログラムを最後まで実行すると work/CanDataAnalyzer/data/output/Result1/Result 以下に clusters.csv
が保存されています。この状態でアプリ上で"クラスタリングの結果を表示/非表示"ボタンを押すとクラスタリングした
結果をもとに地図上に色が塗られるはずです。

=============================================
TODO:

+ DB pass
+ 色分け
+ segement size
+ Grid init
+ Marker default context

をそれぞれ config に入れる

右下モーダル問題 && ドキュメントの完成
