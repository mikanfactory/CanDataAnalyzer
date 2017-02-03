# V1 vs V2 vs V3
## invalids <- c('Time', 'Longitude', 'Latitude', 'Brake', 'Accel', 'RoadType', 'flag')

RoadType: 0 (都市間高速)
Red/All = 55/81 = 0.679012
1 - Red/All = 26/81 = 0.320988
Red: Mean correct/predict = 0.625476
Blue: Mean correct/predict = NaN
CV value: 0.470437
CV value: 0.482937
CV value: 0.516270

RoadType: 2 (有料道路) *****************
Red/All = 31/47 = 0.659574
1 - Red/All = 16/47 = 0.340426
Red: Mean correct/predict = 0.916667
Blue: Mean correct/predict = 0.583333
CV value: 0.230000
CV value: 0.250000
CV value: 0.250000

RoadType: 3 (国道)
Red/All = 202/324 = 0.623457
1 - Red/All = 122/324 = 0.376543
Red: Mean correct/predict = 0.679084
Blue: Mean correct/predict = 0.471566
CV value: 0.453504
CV value: 0.398106
CV value: 0.425758

RoadType: 4 (県道) *****************
Red/All = 36/71 = 0.507042
1 - Red/All = 35/71 = 0.492958
Red: Mean correct/predict = 0.565000
Blue: Mean correct/predict = 0.505000
CV value: 0.540476
CV value: 0.470238
CV value: 0.454762

RoadType: 5 (主要地方道) *****************
Red/All = 154/303 = 0.508251
1 - Red/All = 149/303 = 0.491749
Red: Mean correct/predict = 0.567004
Blue: Mean correct/predict = 0.554949
CV value: 0.438495
CV value: 0.445161
CV value: 0.438280

RoadType: 6 (一般道1、一般道2、一般道3) *****************
Red/All = 90/189 = 0.476190
1 - Red/All = 99/189 = 0.523810
Red: Mean correct/predict = 0.608948
Blue: Mean correct/predict = 0.630505
CV value: 0.380994
CV value: 0.391520
CV value: 0.380994

RoadType: 7 (その他) *****************
Red/All = 25/27 = 0.925926
1 - Red/All = 2/27 = 0.074074
Red: Mean correct/predict = 0.933333
Blue: Mean correct/predict = NaN
CV value: 0.066667
CV value: 0.066667
CV value: 0.066667
