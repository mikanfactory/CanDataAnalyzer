import numpy as np
import pandas as pd
import math
import json
from argparse import ArgumentParser

ACCEL = "RawPedal_APOFS[%]"
SPEED = "VSO[km/h]"
AVERAGE_VELOCITY = "AverageVelocity"
CURVE_AVERAGE = "CurveAverage"
MAX_SPEED = "MaxSpeed"
MIN_SPEED = "MinSpeed"
ROAD_TYPE = "RoadType"
AHEAD_DISTANCE = "Z_ABST_toAT[m]"
THW = "TimeHeadway"
TTC = "TimeToCollision"
RF = "RiskFactor"
DIFF_AVG_SPEED = "DiffAvgSpeed"
EMPTINESS_OF_ROAD = "EmptinessOfRoad"
ROAD_FACTOR = "RoadFactor"
LANE_COUNT = "VC_LaneCount.1"
BRAKE_CAR = "VC_CarBrake"
MAN_CYCLE_COUNTS = "VC_ManCycleCount"

CURVES1 = [
    "Curve_0[\xef\xbf\xbd\xef\xbf\xbdm]",
    "Curve_1[\xef\xbf\xbd\xef\xbf\xbdm]",
    "Curve_2[\xef\xbf\xbd\xef\xbf\xbdm]",
    "Curve_3[\xef\xbf\xbd\xef\xbf\xbdm]",
    "Curve_4[\xef\xbf\xbd\xef\xbf\xbdm]",
    "Curve_5[\xef\xbf\xbd\xef\xbf\xbdm]",
    "Curve_6[\xef\xbf\xbd\xef\xbf\xbdm]"
]

CURVES2 = [
    "Curve_0[\xd0\x83\xd0\xb3m]",
    "Curve_1[\xd0\x83\xd0\xb3m]",
    "Curve_2[\xd0\x83\xd0\xb3m]",
    "Curve_3[\xd0\x83\xd0\xb3m]",
    "Curve_4[\xd0\x83\xd0\xb3m]",
    "Curve_5[\xd0\x83\xd0\xb3m]",
    "Curve_6[\xd0\x83\xd0\xb3m]",
]

RF_CONST = {
    "a": 1,
    "b": 4
}

def addAvgVelocity(df):
    df[AVERAGE_VELOCITY] = 0
    df[MAX_SPEED] = 0
    df[MIN_SPEED] = 0
    accelOffs = df[df[ACCEL] == -1].index
    starts = df.ix[accelOffs].index.map(lambda x: max(0, x-1000))
    for start, stop in zip(starts, accelOffs):
        df.loc[stop, AVERAGE_VELOCITY] = df.ix[start:stop][SPEED].mean()
        df.loc[stop, MAX_SPEED] = df.ix[start:stop][SPEED].max()
        df.loc[stop, MIN_SPEED] = df.ix[start:stop][SPEED].min()


def addCurveAverage(df):
    if CURVES1[0] in df.columns:
        C0, C1, C2, C3, C4, C5, C6 = CURVES1
    else:
        C0, C1, C2, C3, C4, C5, C6 = CURVES2

    df[CURVE_AVERAGE] = 0
    highSpeeds = df[ROAD_TYPE].apply(lambda x: x in [0.0, 2.0, 3.0])
    df.loc[highSpeeds, CURVE_AVERAGE] = df[highSpeeds].apply(lambda x: min(x[C0], x[C1], x[C2], x[C3], x[C4], x[C5], x[C6]), axis=1)
    lowSpeeds = df[ROAD_TYPE].apply(lambda x: x not in [0.0, 2.0, 3.0])
    df.loc[lowSpeeds, CURVE_AVERAGE] = df[lowSpeeds].apply(lambda x: min(x[C0], x[C1], x[C2], x[C3], x[C4]), axis=1)


def addDeviatinFromAvgSpeed(df):
    df[DIFF_AVG_SPEED] = 0
    meanSpeeds = df.groupby(ROAD_TYPE).agg("mean")[SPEED]
    for rtype in [0, 2, 3, 4, 5, 6, 7]:
        meanSpeed = meanSpeeds[rtype]
        rtypeIdx = df[ROAD_TYPE] == rtype
        df[DIFF_AVG_SPEED][rtypeIdx] = df[SPEED][rtypeIdx] - meanSpeed


def addEmptinessOfRoad(df):
    df[EMPTINESS_OF_ROAD] = 0
    emptiness = df[(df[AHEAD_DISTANCE] > 90) | (df[AHEAD_DISTANCE] == 0)].groupby(ROAD_TYPE).size()
    counts = df.groupby(ROAD_TYPE).size()
    for rtype in [0, 2, 3, 4, 5, 6, 7]:
        emp = float(emptiness[rtype]) / counts[rtype]
        rtypeIdx = df[ROAD_TYPE] == rtype
        df[EMPTINESS_OF_ROAD][rtypeIdx] = [(df[rtypeIdx][AHEAD_DISTANCE] > 90) | (df[rtypeIdx][AHEAD_DISTANCE] == 0)][0].apply(int)*0.1 + emp


def addRoadFactor(df):
    df[ROAD_FACTOR] = 0
    accelOffs = df[df[ACCEL] == -1].index
    starts = df.ix[accelOffs].index.map(lambda x: max(0, x-30))
    for start, stop in zip(starts, accelOffs):
        fastOrElse = df.loc[stop, ROAD_TYPE] not in [0.0, 2.0, 3.0]
        wideOrElse = df.loc[stop, LANE_COUNT] < 2
        aheadBrakeOrElse = df.ix[start:stop][BRAKE_CAR].sum() >= 1
        manyObstacleOrElse = df.ix[start:stop][MAN_CYCLE_COUNTS].sum() > 3
        df.loc[stop, ROAD_FACTOR] = int(fastOrElse) + int(wideOrElse) + int(aheadBrakeOrElse) + int(manyObstacleOrElse)


def updateCSV(target, integers):
    df = pd.read_csv(target)
    names = [df.columns[idx] for idx in integers]
    df[ROAD_TYPE] = df[ROAD_TYPE].fillna(-1)
    df["D_BRANCH_FLG"] = df["D_BRANCH_FLG"].fillna(-1)
    df[names] = df[names].astype(int)
    addAvgVelocity(df)
    addCurveAverage(df)
    addDeviatinFromAvgSpeed(df)
    addEmptinessOfRoad(df)
    addRoadFactor(df)
    df.to_csv(target, index=False)


if __name__ == "__main__":
    desc = u'{0} [Args] [Options]\nDetailed options -h or --help'.format(__file__)
    parser = ArgumentParser(description=desc)
    parser.add_argument('-u', '--update', dest='config', default=False, const=True, nargs="?", help='Update cache config')
    args = parser.parse_args()
    config = args.config

    with open("config/targets.json") as f:
        tconfig = json.load(f)

    with open("config/cacheConfig.json", "r") as f:
        cconfig = json.load(f)

    # Update csv
    targets = tconfig["names"]
    integers = [col["Index"] for col in cconfig["columns"] if col["Type"] == "int64"]
    for target in targets:
        fname = "data/input/%s.csv" % target
        print fname
        updateCSV(fname, integers)

    if config:
        with open("config/cacheConfig.json", "w") as f:
            size = len(cconfig["columns"])
            aveVelocity = {
                "Read": True,
                "Name": AVERAGE_VELOCITY,
                "Type": "float64",
                "Index": size+1,
            }
            curveAve = {
                "Read": True,
                "Name": CURVE_AVERAGE,
                "Type": "float64",
                "Index": size+2,
            }
            cconfig["columns"].append(aveVelocity)
            cconfig["columns"].append(curveAve)

            json.dump(cconfig, f)
