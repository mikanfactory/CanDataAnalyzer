#*------- This code is too late! So use preprocess.go -------*

import pandas as pd
import json

def colmunName(df, cacheConfig, name):
    for columns in cacheConfig["columns"]:
        if columns["Name"] == name:
            return df.columns[columns["Index"]]


def brakeName(df, cacheConfig):
    return colmunName(df, cacheConfig, "Brake")


def accelName(df, cacheConfig):
    return colmunName(df, cacheConfig, "Accel")


def findSwitchPoint(df, colname):
    zeroIndex = df[df[colname] == 0].index
    oneIndex = df[df[colname] == 1].index

    for start in zeroIndex[:-1]:
        prv, nxt = df.ix[start], df.ix[start+1]
        if prv[colname] == 0 and nxt[colname] == 1:
            df.ix[start, colname] = 2

    for start in oneIndex:
        prv, nxt = df.ix[start], df.ix[start+1]
        if prv[colname] == 1 and nxt[colname] == 0:
            df.ix[start, colname] = -1


def updateCSV(fname, cacheConfig):
    df = pd.read_csv(fname)
    BRAKE = brakeName(df, cacheConfig)
    ACCEL = accelName(df, cacheConfig)

    findSwitchPoint(df, BRAKE)
    findSwitchPoint(df, ACCEL)

    df.to_csv(fname, index=False)


if __name__ == "__main__":
    with open("config/targets.json") as f:
        tconfig = json.load(f)

    with open("config/cacheConfig.json", "r") as f:
        cacheConfig = json.load(f)

    # Update csv
    targets = tconfig["names"]
    for target in targets:
        fname = "data/input/%s.csv" % target
        print fname
        updateCSV(fname, cacheConfig)
