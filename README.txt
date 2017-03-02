# 使い方
今回クラスタリングまでしてもらうのですが、大きく分けてこんな感じの処理をしてもらいます。

0. Docker の image, container の作成
1. データの前処理
2. 地図上に要約したCANデータの表示し、 メッシュに区切り、そのメッシュ内に含まれるマーカーの数のカウント
3. カウントしたデータを元にクラスタリング
4. 解析したデータを表示

これらの各処理に対して細かく説明していきます。


# 0. Docker の image, container の作成
まず新しいディレクトリを作成し（ 以下 work とする ）、その中にこの CanDataAnalyzer を入れてください。
次に CanDataAnalyzer の直下にある docker ディレクトリの中身をすべて work に移動させてください。

work--CanDataAnalyzer
     |- Dockerfile
     |- install_container.sh
     |- install_image.sh
     |- remove_container.sh
     |- restart_container.sh

そうしたら terminal で work ディレクトリに移動し、一度

  `bash remove_container`

としてください。その後

  `bash install_image.sh`

及び

  `bash install_container.sh`

と打つと docker の中に入ります。この後,

  `npm run init`

とすると、初期化を実行します。


# 1. データの前処理
まず松儀くんが集めてくれたデータを　work/CanDataAnalyzer/data 以下に
csv と tsv というディレクトリがあるはずなので、そこを置き換えてください。（ ここは Mac 上で操作できます ）

そうして

  `npm run setupDB`

とすると、データを結合し、ブレーキ、アクセルのオンオフ地点を書き加え、データベースに挿入します。
申し訳ないのですが、この処理は時間がかかります。ので、Netflix で映画を見ながらコーヒーでも
飲んでリラックスしていてください。この後、

  `npm run server`

でアプリが起動します。


# 2. 地図上に要約したCANデータの表示
chrome で localhost:1323 にアクセスしてください。そこで各特徴量の条件を元にCANデータをマップしていきます。
もしかしたら Chrome にキャッシュが残っているかもしれません。その場合は command + option + j を押し、
Developer tool を起動します。すると Network というタブ？があるはずなので、そこをクリックし、
Disable Cache を On にしてください。その後リロードするとキャッシュを消してリロードできます。
キャッシュが消えているかどうかの判断に"新しいマーカーを作成"をクリックし、features 以下が

// features
// Latitude Longitude GPSSpeed
// Time Brake Accel
// SteeringAngle DetectCount AfternoonSun
// Shade Sunshine Cloud

になっていれば成功です。なお、Developer tool は同じく command + option + j で消せます。

で、本命のカウントする特徴量については山崎さんと相談してほしいのですが、

GPSSpeed, Brake, Accel SteeringPositive, SteeringNegative

と松儀くんが追加してくれた DetectCount(detectsousu), AfternoonSun(nishibi),
Shade(hikage), Sunshine(hare), Cloud(kumori) でしょうか。 GPSSpeed などは
カウントの条件をこの章の最後に付録しましたので参考にしてください。 基本的に

1. "新しいマーカーを作成"をクリック
2. 条件を設定
3. なんか良さげなら"グリッドの結果を保存"をクリック (今回はグリッドの表示/非表示はしなくてOKです)
4. すると work/CanDataAnalyzer/output/yyyy-mm-dd_HH:MM:SS の形で保存される
5. わかりやすい名前に変更し、work/CanDataAnalyzer/output/Result1 に入れる
6. いっぱい読み込むと重いので chrome をリロードし、他の特徴量も試す

をループすれば良いです。ここで得られた結果を解析していきます。一応 GPSSpeed については
結果をおいておきます。

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


# 3. カウントしたデータを元にクラスタリング
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
実際にいじるところは DetectCount などの結果を付け加えて新しいdata frame を作るところと、
ハイパーパラメータの設定だと思います。そこ以外はそのままそのコードを実行すれば良いかと思います。
最後までエラーが無く実行できればOKです。


# 4. 解析したデータを表示
解析プログラムを最後まで実行すると work/CanDataAnalyzer/data/output/Result1/Result 以下に clusters.csv
が保存されています。この状態でアプリ上で"クラスタリングの結果を表示/非表示"ボタンを押すとクラスタリングした
結果をもとに地図上に色が塗られるはずです。


## 最後に
2/24日にすべて終わらなくても大丈夫です。火曜日に僕も行くので、それまでは遊んでみてください。
