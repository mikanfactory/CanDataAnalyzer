# NaiveClassifier V1
Red/All = 593/1042 = 0.569098
1 - Red/All = 449/1042 = 0.430902
Red: Mean correct/predict = 0.614529
Blue: Mean correct/predict = 0.505811
チューニング前 CV value: 0.425145
チューニング後 CV value: 0.416602

# NaiveClassifier V2
Red/All = 593/1042 = 0.569098
1 - Red/All = 449/1042 = 0.430902
Red: Mean correct/predict = 0.633449
Blue: Mean correct/predict = 0.538239
チューニング前 CV value: 0.402115
チューニング後 CV value: 0.386777

# NaiveClassifier V3
Red/All = 593/1042 = 0.569098
1 - Red/All = 449/1042 = 0.430902
Red: Mean correct/predict = 0.646309
Blue: Mean correct/predict = 0.571601
CV value: 0.382912

# NaiveClassifier V4
Red/All = 593/1042 = 0.569098
1 - Red/All = 449/1042 = 0.430902
Red: Mean correct/predict = 0.662786
Blue: Mean correct/predict = 0.576736
CV value: 0.371364

# Variable importance in V4
         RoadType      CurveAverage             Speed          MaxSpeed
               13                11                10                 9
       RiskFactor             Curve        DistSignal             Pitch
                8                 7                 6                 6
    AheadDistance   AverageVelocity   TimeToCollision AccelerationSpeed
                5                 5                 4                 4
        LaneCount            Engine          PathType     SteeringAngle
                3                 2                 2                 2
         MinSpeed              Jerk
                1                 1
