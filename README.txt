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
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!! この作業は 2. 初期化 を行い、GOPATH 以下にこのアプリケーションを配置した後で行ってください !!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

Mac にはすでに Python が入っていますが、セキュリティ向上のために　Elcapitan あたりから
local に入れた pip によるパッケージの管理が難しくなりました。そのため virtualenv を入れて
作業するのがおすすめです。まず

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

5. R のインストールおよび jupyter で R を起動する

https://cran.r-project.org/bin/macosx/ で R をインストールしてください。その後、
https://irkernel.github.io/installation/ に従って irkernel をインストールしてください。

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
しておきましょう。その際、CanDataAnalyzer/config/config.toml の [DB] の
pass のところを

pass = "mysql"

とかにしておいてください。


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

次にデータベースを作成をします。Mac の場合、

`npm run createDB`

としてください。Windows の場合は MySQL を起動して

```
create database summary;
create database sp;
```

としてください。これでデータベースが作成されます。
次に以下のディレクトリを作成します。

`mkdir -p $GOPATH/src/github.com/mikanfactory`

このプロジェクト CanDataAnalyzer は今作ったディレクトリ以下に移動し

$GOPATH/src/github.com/mikanfactory/CanDataAnalyzer

となるように配置してください。次にプロジェクトルートで初期化コマンドを打ちます

`npm run init`

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
を入力していきます。この際、サマる粒度は CanDataAnalyzer/config/config.toml
の [Command] の segment_size によって指定できます。(デフォルトは30)
一方、sp にデータを入れるには 2 つ方法があります。

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

画面右上のメニューバーの "新しいマーカーの作成" を選択すると、モーダルが立ち上がります。
まず Target となっているセレクトボックスでどのファイルに対して実行するかを指定します。
隣の Title となっているところは任意です。その下の Conditions となっているところは
エディタになっていて、Emacs のキーバインドが使えます。ここに疑似コードで条件とそれに
マッチした場合にどの画像でマップするかを指定します。デフォルトは Speed で条件分岐
させたときのものとなっています。基本的に文法がおかしければエディタの方でエラーが
でるようになっています。ただし return の後にセミコロンは書いてはいけないので
注意してください。条件指定ができたら OK をクリックするとデータベースを読み込んで
指定した条件に従って地図上にマップされます。

(注) cacheConfig.json を変更して再び server を起動した場合、Chrome にキャッシュが
残っているかもしれません。その場合は (Chromeでは) Command + Shift + R で
強制リロードできます。その際に"新しいマーカーの作成をする"を選択した場合、
features 以下が変化していれば成功です。

# 6. グリッドの表示と移動
メニューバーで "グリッドを表示/非表示" をクリックすると地図上に赤枠が表示されます。
この赤枠は移動&拡大ができる状態とグリッドを表示する状態の2つの状態があります。
ダブルクリックすることによってこの2つの状態を行き来することができます。

このグリッドサイズはデフォルトは 30x30 ですが、
CanDataAnalyzer/config/config.toml の [App] 以下の grid_size によって
変更することができます。

# 7. ヒートマップの作成
メニューバーで "ヒートマップの表示/非表示" をクリックすると、各グリッドに含まれる
マーカーのカウント数によってヒートマップを表示します。

# 8. マーカーのカウント数を保存
メニューバーで "グリッドの結果を保存" をクリックすると、各グリッドに含まれる
マーカーのカウント数を CanDataAnalyzer/data/output に保存します。
この出力形式は json と csv で、setting.json にグリッドや表示条件など
のメタ情報を出力し、result.csv に実際のカウント数を出力します。
result.csv の id はグリッドの右上から数えた際のインデックスを示しており、
仮にグリッドサイズが 30x30 ならば 0 ~ 899 までとなります。
この情報を用いてさらに分析を行います。

# 9. カウントしたデータを元にクラスタリング
8. マーカーのカウント数を保存 で出力したデータを元にクラスタリングをかけ、
その結果を CanDataAnalyzer/data/output/Result1/Result/clusters.csv
と保存してください。この形式は csv とついていますが、ヘッダー無しで各グリッドが
どのクラスタに含まれるかを 0 ~ 25 で示してください。この値については後述します。
また、clusters.csv と同じディレクトリに section 8 で出力した setting.json を
ひとつだけ保存してください。ここに書かれているグリッドのメタ情報を section 10
で使います。

なお実際に jupyter notebook を用いて分析したコードが analysis ディレクトリ
以下に保存してあります。そのため jupyter notebook を入れればサンプルコード
が見れます。良ければ参考にしてください。

# 10. クラスタリングの結果を表示
メニューバーで "クラスタリングの結果を表示/非表示" をクリックすると、clusters.csv
に基づいて結果を表示します。ここで 0 を指定されたグリッドには色を付けません。
1 ~ 25 を指定されたグリッドは 赤 ~ 青 を割り振るようになっています。なお、
24 色に分けると、どうしても近い色が見分けにくくなってしまいます。そこでメニューバーで
"通過点のクラスタインデックスを表示" をクリックすると、そのグリッドが何番目のクラスタ
に含まれるかを表示してくれます。

# 11. リスクの計算する
リスクは

各グリッドの個数 / 各グリッドでの滞在回数

によって計算されます。速度の速いグリッドではマーカーを打つ回数が必然的に少なくなり、
逆もまた然りであるため、こうすることで単位時間あたりにどれだけ色々な動作をしたか
を表せます。正規化をかけているようなイメージです。従ってこれを計算することためには
各グリッドでの滞在回数を求める必要があります。このアプリケーションでそれをやるためには
target を All にして conditions を

```
switch (true) {
	default:
		green;
}
```

にすれば良いです。あとはこの結果を用いてリスクを計算してください。その結果を
CanDataAnalyzer/data/output/Result1/Result/risks.csv に保存してください。
データ形式は clusters.csv と同じで、各グリッドのリスク値を書いてください。

なお、この計算も実際に使用したものが analysis ディレクトリに入っています。

# 12 リスクの結果を表示
メニューバーで "危険度の結果を表示/非表示" とクリックすると、risks.csv に
基づいて緑から赤までの5段階で結果を表示します。デフォルトでは1段階を
3.0/5 = 0.6 ごとに区切っています。ここの5は固定ですが、max の値は
/config/config.toml で [App] の　color_max によって変えられます。

また、リスクが高いところのインデックスが欲しくなるときがあります。その際に
メニューバーで "通過点のインデックスを表示" をクリックすると、右上から数えた
場合のグリッドのインデックスを表示するようになっています。
